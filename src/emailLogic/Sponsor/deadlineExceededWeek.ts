import { prisma } from '../../utils/prisma';
import { DeadlineExceededbyWeekTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processDeadlineExceededWeek() {
  dayjs.extend(utc);

  const sevenDaysAgo = dayjs.utc().subtract(7, 'day').toISOString();
  const nineDaysAgo = dayjs.utc().subtract(9, 'day').toISOString();

  const category = getCategoryFromEmailType('deadlineExceededWeek');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      deadline: {
        lt: sevenDaysAgo,
        gte: nineDaysAgo,
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  const emailPromises = listings.map(async (listing) => {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_DEADLINE_WEEK',
      },
    });

    if (checkLogs || !listing.poc?.email) return null;

    const pocPreference = await prisma.emailSettings.findFirst({
      where: {
        userId: listing.pocId,
        category,
      },
    });

    if (!pocPreference) return null;

    const emailHtml = render(
      DeadlineExceededbyWeekTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_DEADLINE_WEEK',
        bountyId: listing.id,
      },
    });

    return {
      to: listing.poc.email,
      bcc: ['pratikd.earnings@gmail.com'],
      subject: 'Winner Announcement for Your Earn Bounty Is Due!',
      html: emailHtml,
    };
  });

  const emailData = await Promise.all(emailPromises);
  return emailData.filter(Boolean);
}
