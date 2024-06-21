import { render } from '@react-email/render';
import { SubmissionTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { alertsEmail } from '../../constants';

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
      from: alertsEmail,
      to: user.email,
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
