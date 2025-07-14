import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { SpamCreditTemplate } from '../../email-templates/Submission/SpamCreditTemplate';
import { prisma } from '../../prisma';

export async function processSpamCredit(id: string) {
  const spamSubmission = await prisma.submission.findUnique({
    where: { id, label: 'Spam', isActive: true, isArchived: false },
    include: { user: true, listing: true },
  });

  if (spamSubmission) {
    const emailHtml = await render(
      SpamCreditTemplate({
        name: spamSubmission.user.firstName,
        listingName: spamSubmission.listing.title,
        listingSlug: spamSubmission.listing.slug,
        disputeUrl: `${basePath}/#dispute-submission-${spamSubmission.id}`,
      }),
    );
    return {
      from: pratikEmail,
      to: spamSubmission.user.email,
      subject: 'Your submission was flagged as spam',
      html: emailHtml,
      checkUnsubscribe: false,
    };
  }

  return;
}
