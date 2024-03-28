import { prisma } from '../../utils/prisma';
import { kashEmail } from '../../constants/kashEmail';
import { DeadlineThreeDaysTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

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

  const category = getCategoryFromEmailType('deadline3days');

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
      const userPreference = await prisma.emailSettings.findFirst({
        where: {
          userId: sub.userId,
          category,
        },
      });

      if (!userPreference) continue;

      const emailHtml = render(
        DeadlineThreeDaysTemplate({
          name: sub?.User?.firstName!,
          listingName: listing.title,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/`,
        }),
      );

      emails.push({
        from: kashEmail,
        to: [sub?.User?.email],
        subject: 'This Bounty Is Expiring Soon!',
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
