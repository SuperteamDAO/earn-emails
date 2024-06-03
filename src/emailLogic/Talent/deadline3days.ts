import { prisma } from '../../utils/prisma';
import { DeadlineThreeDaysTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export async function processDeadlineThreeDays() {
  dayjs.extend(utc);
  const threeDaysFromNowStart = dayjs.utc().add(3, 'day').startOf('day');
  const threeDaysFromNowEnd = dayjs.utc().add(3, 'day').endOf('day');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      isPrivate: false,
      deadline: {
        gte: threeDaysFromNowStart.toISOString(),
        lt: threeDaysFromNowEnd.toISOString(),
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  let emails = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_CLOSE_DEADLINE',
      },
    });

    if (checkLogs) continue;

    const listingSubscriptions = await prisma.subscribeBounty.findMany({
      where: { bountyId: listing.id },
      include: { User: true },
    });

    for (const sub of listingSubscriptions) {
      const emailHtml = render(
        DeadlineThreeDaysTemplate({
          name: sub?.User?.firstName!,
          listingName: listing.title,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        }),
      );

      emails.push({
        to: sub?.User?.email,
        subject: 'This Listing Is Expiring Soon!',
        html: emailHtml,
      });
    }

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_CLOSE_DEADLINE',
        bountyId: listing.id,
      },
    });
  }

  return emails;
}
