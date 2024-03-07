import { prisma } from '../../utils/prisma';
import { kashEmail } from '../../constants/kashEmail';
import { DeadlineSponsorTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export async function processDeadlineExceeded() {
  dayjs.extend(utc);

  const currentTime = dayjs.utc();

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

  const emailsPromises = listings.map(async (listing) => {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_DEADLINE',
      },
    });

    if (checkLogs || !listing.poc?.email) return null;

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

    return {
      from: kashEmail,
      to: [listing.poc.email],
      bcc: ['pratikd.earnings@gmail.com'],
      subject: 'Your Earn Listing Is Ready to Be Reviewed',
      html: emailHtml,
    };
  });

  const emails = (await Promise.all(emailsPromises)).filter(
    (email) => email !== null,
  );

  return emails;
}
