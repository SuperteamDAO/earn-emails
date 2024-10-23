import { render } from '@react-email/render';

import { basePath, kashEmail } from '../../constants';
import { CommentTagTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { capitalizeWords, getCommentSourceURL, getUserEmailPreference } from '../../utils';
import { CommentRefType } from '@prisma/client';

export async function processCommentTag(
  id: string,
  userId: string,
  otherInfo: any,
) {
  const userPreference = await getUserEmailPreference(userId, 'commentTag');
  const type = otherInfo.type as CommentRefType;
  if(!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return
  }

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const { personName } = otherInfo;

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
      CommentTagTemplate({
        name: user?.firstName!,
        personName: capitalizeWords(personName),
        link,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user?.email,
      subject: 'You have been mentioned in a comment on Earn',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
