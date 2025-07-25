import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { SubmissionRejectedTemplate } from '../../email-templates/Submission/submissionRejectedTemplate';
import { prisma } from '../../prisma';

export async function processSubmissionRejected(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      listing: {
        include: {
          sponsor: true,
        },
      },
    },
  });

  if (submission) {
    const emailHtml = await render(
      SubmissionRejectedTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        link: `${basePath}/listing/${submission.listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );
    const emailData = {
      from: pratikEmail,
      to: submission?.user.email,
      subject: `About your recent application to ${submission.listing.sponsor.name}'s gig`,
      html: emailHtml,
      checkUnsubscribe: false,
    };
    return emailData;
  }

  return;
}
