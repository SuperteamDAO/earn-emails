import { render } from '@react-email/render';
import { CommentSubmissionTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { alertsEmail } from '../../constants';

export async function processCommentSubmission(id: string, otherInfo: any) {
  const { personName } = otherInfo;

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      listing: true,
    },
  });

  if (submission) {
    const userPreference = await getUserEmailPreference(
      submission.userId,
      'commentSubmission',
    );

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
        from: alertsEmail,
        to: submission?.user.email,
        subject: 'Comment Received on Your Submission',
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
