import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { SpamCreditTemplate } from '../../email-templates/Submission/SpamCreditTemplate';
import { prisma } from '../../prisma';

export async function processSpamCredit(id: string) {
  const spammer = await prisma.submission.findUnique({
    where: { id, label: 'Spam', isActive: true, isArchived: false },
    include: { user: true, listing: true },
  });

  if (spammer) {
    const emailHtml = await render(
      SpamCreditTemplate({
        name: spammer.user.firstName,
        listingName: spammer.listing.title,
        listingSlug: spammer.listing.slug,
      }),
    );
    return {
      from: pratikEmail,
      to: spammer.user.email,
      subject: 'Your submission was flagged as spam',
      html: emailHtml,
      checkUnsubscribe: false,
    };
  }

  return;
}
