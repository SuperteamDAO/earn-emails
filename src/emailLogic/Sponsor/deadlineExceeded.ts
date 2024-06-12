import { prisma } from '../../utils/prisma';
import { DeadlineSponsorTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processDeadlineExceeded() {
  dayjs.extend(utc);

  const currentTime = dayjs.utc();

  const category = getCategoryFromEmailType('deadlineExceeded');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      deadline: {
        lt: currentTime.toISOString(),
        gte: currentTime.subtract(1, 'day').toISOString(),
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_DEADLINE',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await prisma.emailSettings.findFirst({
      where: {
        userId: listing.pocId,
        category,
      },
    });

    if (!pocPreference) continue;

    const emailHtml = render(
      DeadlineSponsorTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_DEADLINE',
        bountyId: listing.id,
      },
    });

    emailData.push({
      to: listing.poc.email,
      bcc: ['pratikd.earnings@gmail.com'],
      subject: 'Your Earn Listing Is Ready to Be Reviewed',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
