import { render } from '@react-email/render';

import { kashEmail } from '../../constants/emails';
import { SubmissionTemplate } from '../../email-templates/Submission/submissionTemplate';
import { prisma } from '../../prisma';

export async function processTalentSubmission(
  entityId: string,
  userId: string,
) {
  const listing = await prisma.bounties.findFirst({
    where: { id: entityId },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (listing && user) {
    const subject =
      listing.type !== 'project'
        ? 'Submission Received!'
        : 'Application Received';

    const emailHtml = await render(
      SubmissionTemplate({
        name: user.firstName!,
        listingName: listing.title,
        type: listing?.type as 'bounty' | 'project' | 'hackathon',
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user.email,
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
