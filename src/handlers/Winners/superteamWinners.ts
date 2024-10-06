import { prisma } from '../../prisma';
import {
  PaymentSTWinnersTemplate,
  SuperteamWinnersTemplate,
} from '../../email-templates';
import { render } from '@react-email/render';
import { kashEmail } from '../../constants';
import { getListingTypeLabel } from '../../utils';

export async function processSuperteamWinners(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: { id },
    include: { sponsor: true },
  });

  const winners = await prisma.submission.findMany({
    where: {
      listingId: id,
      isWinner: true,
      isActive: true,
      isArchived: false,
    },
    take: 100,
    include: {
      user: {
        include: {
          Submission: true,
        },
      },
    },
  });

  if (listing) {
    const sponsorName = listing.sponsor.name;
    const listingType = getListingTypeLabel(listing.type);
    const listingName = listing.title;

    const allRankings = await prisma.talentRankings.findMany({
      where: { skill: 'ALL', timeframe: 'ALL_TIME' },
      orderBy: { totalEarnedInUSD: 'desc' },
    });

    const winnerEmails = [];
    const paymentEmails = [];

    for (const winner of winners) {
      const totalEarnings = winner.user.Submission.reduce(
        (total, submission) => total + submission.rewardInUSD,
        0,
      );

      const position =
        allRankings.findIndex(
          (ranking) => ranking.totalEarnedInUSD <= totalEarnings,
        ) + 1;

      const winnerEmailHtml = render(
        SuperteamWinnersTemplate({
          name: winner.user.firstName,
          listingName,
          listingType,
        }),
      );

      winnerEmails.push({
        from: kashEmail,
        to: winner.user.email,
        subject: 'Congrats! Submit This Form to Claim Your Reward',
        html: winnerEmailHtml,
      });

      const paymentEmailHtml = render(
        PaymentSTWinnersTemplate({
          name: winner.user.firstName,
          listingName,
          listingType,
          sponsorName,
          walletAddress: winner.user.publicKey,
          totalEarnings,
          position,
        }),
      );

      paymentEmails.push({
        from: kashEmail,
        to: winner.user.email,
        subject: `Congratulations! ${sponsorName} will send you the rewards soon`,
        html: paymentEmailHtml,
      });
    }

    return { winnerEmails, paymentEmails };
  }

  return;
}
