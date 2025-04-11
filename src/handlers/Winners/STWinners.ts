import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { STWinnersTemplate } from '../../email-templates/Winners/STWinnersTemplate';
import { prisma } from '../../prisma';
import { getListingTypeLabel } from '../../utils/getListingTypeLabel';

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
    include: {
      user: true,
    },
  });

  if (listing) {
    const listingType = getListingTypeLabel(listing.type);
    const listingName = listing.title;

    const emailPromises = winners.map(async (winner) => {
      const emailHtml = await render(
        STWinnersTemplate({
          name: winner.user.firstName,
          listingName,
          listingType,
        }),
      );
      return {
        from: pratikEmail,
        to: winner.user.email,
        subject: '[Important] Submit This Form to Claim Your Reward',
        html: emailHtml,
        checkUnsubscribe: false,
      };
    });

    const emails = await Promise.all(emailPromises);
    return emails;
  }

  return;
}
