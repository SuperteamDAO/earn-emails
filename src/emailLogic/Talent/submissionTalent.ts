import { render } from '@react-email/render';
import { SubmissionTemplate } from '../../emailTemplates';
import { prisma } from '../../utils/prisma';

export async function processTalentSubmission(id: string, userId: string) {
  const listing = await prisma.bounties.findFirst({
    where: { id },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (listing && user) {
    const subject =
      listing.type !== 'project'
        ? 'Submission Received!'
        : 'Application Received';

    const emailHtml = render(
      SubmissionTemplate({
        name: user.firstName!,
        listingName: listing.title,
        type: listing?.type as 'bounty' | 'project' | 'hackathon',
      }),
    );

    const emailData = {
      to: user.email,
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
