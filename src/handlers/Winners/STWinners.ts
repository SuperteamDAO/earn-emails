import { prisma } from '../../prisma';
import { STWinnersTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { kashEmail } from '../../constants';
import { getListingTypeLabel } from '../../utils';

export async function processSTWinners(id: string) {
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
      user: true,
    },
  });

  if (listing) {
    const listingType = getListingTypeLabel(listing.type);
    const listingName = listing.title;

    const emails: {
      to: string;
      subject: string;
      html: string;
    }[] = winners.map((winner) => {
      const emailHtml = render(
        STWinnersTemplate({
          name: winner.user.firstName,
          listingName,
          listingType,
        }),
      );
      return {
        from: kashEmail,
        to: winner.user.email,
        subject: 'Congrats! Submit This Form to Claim Your Reward',
        html: emailHtml,
        checkUnsubscribe: false,
      };
    });

    return emails;
  }

  return;
}
