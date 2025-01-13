import { CommentRefType } from '@prisma/client';
import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { kashEmail } from '../../constants/emails';
import { CommentTagTemplate } from '../../email-templates/Comment/commentTagTemplate';
import { prisma } from '../../prisma';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { getCommentSourceURL } from '../../utils/comment';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processCommentTag(
  entityId: string,
  userId: string,
  otherInfo: any,
) {
  const userPreference = await getUserEmailPreference(userId, 'commentTag');
  const type = otherInfo.type as CommentRefType;
  if (!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return;
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
