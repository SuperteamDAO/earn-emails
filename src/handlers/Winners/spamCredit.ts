import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { SpamCreditTemplate } from '../../email-templates/Winners/SpamCreditTemplate';
import { prisma } from '../../prisma';

export async function processSpamCredit(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: { id },
    include: { sponsor: true },
  });

  const spammers = await prisma.submission.findMany({
    where: {
      listingId: id,
      label: 'Spam',
      isActive: true,
      isArchived: false,
    },
    include: {
      user: true,
    },
  });

  if (listing) {
    const emailPromises = spammers.map(async (spammer) => {
      const emailHtml = await render(
        SpamCreditTemplate({
          name: spammer.user.firstName,
          listingName: listing.title,
          listingSlug: listing.slug,
        }),
      );
      return {
        from: pratikEmail,
        to: spammer.user.email,
        subject: 'Your submission was flagged as spam',
        html: emailHtml,
        checkUnsubscribe: false,
      };
    });

    const emails = await Promise.all(emailPromises);
    return emails;
  }

  return;
}
