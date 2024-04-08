import { render } from '@react-email/render';
import { kashEmail } from '../../constants/kashEmail';
import { CommentReplyTemplate } from '../../emailTemplates';
import { prisma } from '../../utils/prisma';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processCommentReply(id: string, userId: string) {
  const category = getCategoryFromEmailType('commentReply');

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

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  const listing = await prisma.bounties.findFirst({
    where: {
      id,
    },
    include: {
      poc: true,
    },
  });

  if (listing) {
    const emailHtml = render(
      CommentReplyTemplate({
        name: user?.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/listings/${listing?.type}/${listing?.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: [user?.email],
      subject: 'You have received a reply to your comment on Earn',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
