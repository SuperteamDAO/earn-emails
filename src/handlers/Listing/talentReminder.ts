import { Regions } from '@prisma/client';
import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { kashEmail } from '../../constants';
import { TalentReminderTemplate } from '../../email-templates';
import { prisma } from '../../prisma';

export async function processTalentReminder() {
  const users = await prisma.user.findMany({
    where: {
      isTalentFilled: false,
      createdAt: {
        lte: dayjs().subtract(3, 'day').toISOString(),
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
    select: {
      id: true,
      firstName: true,
      email: true,
    },
  });

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      isWinnersAnnounced: false,
      region: Regions.GLOBAL,
      deadline: {
        gte: dayjs().add(3, 'day').toISOString(),
      },
      isPrivate: false,
    },
    take: 3,
    orderBy: {
      usdValue: 'desc',
    },
    select: {
      id: true,
      title: true,
      slug: true,
      type: true,
      token: true,
      rewardAmount: true,
      compensationType: true,
      maxRewardAsk: true,
      minRewardAsk: true,
      usdValue: true,
      sponsor: {
        select: {
          name: true,
        },
      },
    },
  });

  const emails = [];

  const totalRewardAmountResult = await prisma.bounties.aggregate({
    _sum: {
      usdValue: true,
    },
    where: {
      isWinnersAnnounced: true,
      isPublished: true,
      status: 'OPEN',
    },
  });

  const totalApprovedGrantAmountResult =
    await prisma.grantApplication.aggregate({
      _sum: {
        approvedAmountInUSD: true,
      },
      where: {
        applicationStatus: 'Approved',
      },
    });

  const totalTVEInMillions = `$${(
    ((totalRewardAmountResult._sum.usdValue || 0) +
      (totalApprovedGrantAmountResult._sum.approvedAmountInUSD || 0)) /
    1000000
  ).toFixed(1)}M`;

  for (const user of users) {
    if (emails.length >= 3000) break;
    if (!user) continue;

    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        userId: user.id,
        type: 'UNFILLED_PROFILE',
      },
    });

    if (checkLogs) continue;

    const emailHtml = render(
      TalentReminderTemplate({
        name: user.firstName,
        TVE: totalTVEInMillions,
        listings: listings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          sponsor: listing.sponsor.name,
          slug: listing.slug,
          type: listing.type,
          token: listing.token,
          rewardAmount: listing.rewardAmount,
          compensationType: listing.compensationType,
          maxRewardAsk: listing.maxRewardAsk,
          minRewardAsk: listing.minRewardAsk,
          usdValue: listing.usdValue,
        })),
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'UNFILLED_PROFILE',
        userId: user.id,
      },
    });

    emails.push({
      from: kashEmail,
      to: user.email,
      subject: "Here's how you can earn in global standards:",
      html: emailHtml,
    });
  }

  return emails;
}
