import { render } from '@react-email/render';
import { kashEmail } from '../../constants/kashEmail';
import { CommentSubmissionTemplate } from '../../emailTemplates';
import { prisma } from '../../utils/prisma';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processCommentSubmission(id: string, userId: string) {
  const category = getCategoryFromEmailType('commentSubmission');

  const userPreference = await prisma.emailSettings.findFirst({
    where: {
      userId: userId,
      category,
    },
  });

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const submission = await prisma.submission.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      listing: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: {
      id: userId as string,
    },
  });

  if (submission && user) {
    const emailHtml = render(
      CommentSubmissionTemplate({
        name: submission?.user.firstName as string,
        listingName: submission?.listing.title as string,
        personName: user?.firstName as string,
        link: `https://earn.superteam.fun/listings/${submission?.listing.type}/${submission?.listing.slug}/submission/${submission?.id}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );
    const emailData = {
      from: kashEmail,
      to: [submission?.user.email],
      subject: 'Comment Received on Your Superteam Earn Submission',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
