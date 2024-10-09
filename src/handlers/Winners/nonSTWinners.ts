import { prisma } from '../../prisma';
import { NonSTWinnersTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { kashEmail } from '../../constants';
import { getListingTypeLabel } from '../../utils';

export async function processNonSTWinners(id: string) {
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
          Submission: {
            select: {
              isWinner: true,
              rewardInUSD: true,
              listing: {
                select: {
                  isWinnersAnnounced: true,
                },
              },
            },
          },
          GrantApplication: {
            select: {
              approvedAmountInUSD: true,
              applicationStatus: true,
            },
          },
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

    const emails = [];

    for (const winner of winners) {
      const listingWinnings = winner.user.Submission.filter(
        (s) => s.isWinner && s.listing.isWinnersAnnounced,
      ).reduce((sum, submission) => sum + (submission.rewardInUSD || 0), 0);

      const grantWinnings = winner.user.GrantApplication.filter(
        (g) => g.applicationStatus === 'Approved',
      ).reduce(
        (sum, application) => sum + (application.approvedAmountInUSD || 0),
        0,
      );

      const totalEarnings = listingWinnings + grantWinnings;

      const position =
        allRankings.findIndex(
          (ranking) => ranking.totalEarnedInUSD <= totalEarnings,
        ) + 1;

      const emailHtml = render(
        NonSTWinnersTemplate({
          name: winner.user.firstName,
          listingName,
          listingType,
          sponsorName,
          walletAddress: winner.user.publicKey,
          totalEarnings,
          position,
          pocSocials: listing.pocSocials,
        }),
      );

      emails.push({
        from: kashEmail,
        to: winner.user.email,
        subject: `Congratulations! ${sponsorName} will send you the rewards soon`,
        html: emailHtml,
      });
    }

    return emails;
  }

  return;
}