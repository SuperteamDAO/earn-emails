import { CommentRefType } from '@prisma/client';
import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { kashEmail } from '../../constants/emails';
import { CommentReplyTemplate } from '../../email-templates/Comment/commentReplyTemplate';
import { prisma } from '../../prisma';
import { getCommentSourceURL } from '../../utils/comment';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processCommentReply(
  entityId: string,
  userId: string,
  otherInfo: any,
) {
  const userPreference = await getUserEmailPreference(userId, 'commentReply');
  const type = otherInfo.type as CommentRefType;
  if (!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return;
  }

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const listing = await prisma.bounties.findFirst({
    where: { id: entityId },
    include: {
      poc: true,
    },
  });

  const link = getCommentSourceURL(
    basePath,
    type,
    listing,
    entityId,
  ).toString();

  if (user) {
    const emailHtml = await render(
      CommentReplyTemplate({
        name: user?.firstName!,
        link,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user?.email,
      subject: 'You have received a reply to your comment on Earn',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
