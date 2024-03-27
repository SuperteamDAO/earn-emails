import { render } from '@react-email/render';
import { kashEmail } from '../../constants/kashEmail';
import { SubmissionTemplate } from '../../emailTemplates';
import { prisma } from '../../utils/prisma';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processTalentSubmission(id: string, userId: string) {
  const category = getCategoryFromEmailType('submissionTalent');

  const userPreference = await prisma.emailSettings.findFirst({
    where: {
      userId: userId,
      isSubscribed: true,
      category,
    },
  });

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const listing = await prisma.bounties.findFirst({
    where: {
      id,
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      id: userId as string,
    },
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
      from: kashEmail,
      to: [user.email],
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
