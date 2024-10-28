import { render } from '@react-email/render';

import { basePath, kashEmail } from '../../constants';
import { CommentReplyTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getCommentSourceURL, getUserEmailPreference } from '../../utils';
import { CommentRefType } from '@prisma/client';
import { getFeedURLType } from '../../utils/feed';

export async function processCommentReply(id: string, userId: string, otherInfo: any) {
  const userPreference = await getUserEmailPreference(userId, 'commentReply');
  const type = otherInfo.type as CommentRefType;
  if(!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return
  }

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: {
      poc: true,
    },
  });

  const link = getCommentSourceURL(basePath, type, listing, id).toString()

  if (user) {
    const emailHtml = render(
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
