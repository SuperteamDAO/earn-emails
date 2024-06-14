import { prisma } from '../../prisma';
import { SuperteamWinnersTemplate } from '../../email-templates';
import { render } from '@react-email/render';

export async function processSuperteamWinners(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: { id },
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
      user: true,
    },
  });

  if (listing) {
    const emails: {
      to: string;
      subject: string;
      html: string;
    }[] = winners.map((winner) => {
      const emailHtml = render(
        SuperteamWinnersTemplate({
          name: winner.user.firstName,
          listingName: listing?.title || '',
        }),
      );
      return {
        to: winner.user.email,
        subject: 'Submit This Form to Claim Your Reward',
        html: emailHtml,
      };
    });

    return emails;
  }

  return;
}
