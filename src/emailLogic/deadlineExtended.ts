import { prisma } from '../utils/prisma';
import { kashEmail } from '../constants/kashEmail';
import { DeadlineExtendedTemplate } from '../emailTemplates';
import { render } from '@react-email/render';

export async function processDeadlineExtended(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: {
      id,
    },
  });

  const subscribers = await prisma.subscribeBounty.findMany({
    where: {
      bountyId: id,
    },
    include: {
      User: true,
    },
  });

  if (listing) {
    const emails: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }[] = subscribers.map((subscriber) => {
      const emailHtml = render(
        DeadlineExtendedTemplate({
          listingName: listing.title,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/`,
        }),
      );
      return {
        from: kashEmail,
        to: subscriber.User.email,
        subject: 'Listing Deadline Extended!',
        html: emailHtml,
      };
    });

    return emails;
  }

  return;
}
