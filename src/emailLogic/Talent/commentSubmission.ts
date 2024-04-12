import { render } from '@react-email/render';
import { kashEmail } from '../../constants/kashEmail';
import { CommentSubmissionTemplate } from '../../emailTemplates';
import { prisma } from '../../utils/prisma';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processCommentSubmission(id: string, otherInfo: any) {
  const category = getCategoryFromEmailType('commentSubmission');

  const { personName } = otherInfo;

  const submission = await prisma.submission.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      listing: true,
    },
  });

  if (submission) {
    const userPreference = await prisma.emailSettings.findFirst({
      where: {
        userId: submission.userId,
        category,
      },
    });
    if (userPreference) {
      const emailHtml = render(
        CommentSubmissionTemplate({
          name: submission?.user.firstName as string,
          listingName: submission?.listing.title as string,
          personName,
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
    console.log(
      `User ${submission?.userId} has opted out of this type of email.`,
    );
    return;
  }
}
