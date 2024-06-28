import { render } from '@react-email/render';
import { SubmissionLikeTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { kashEmail } from '../../constants';

export async function processSubmissionLike(id: string, userId: string) {
  const userPreference = await getUserEmailPreference(userId, 'submissionLike');

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      listing: true,
    },
  });

  if (submission) {
    const emailHtml = render(
      SubmissionLikeTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        link: `https://earn.superteam.fun/listings/${submission.listing.type}/${submission.listing.slug}/submission/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );
    const emailData = {
      from: kashEmail,
      to: submission?.user.email,
      subject: 'People Love Your Submission!',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
