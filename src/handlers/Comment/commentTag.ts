import { render } from '@react-email/render';
import { CommentTagTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { alertsEmail } from '../../constants';

export async function processCommentTag(
  id: string,
  userId: string,
  otherInfo: any,
) {
  const userPreference = await getUserEmailPreference(userId, 'commentTag');

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

  if (listing) {
    const emailHtml = render(
      CommentTagTemplate({
        name: user?.firstName!,
        personName: `@${personName}`,
        link: `https://earn.superteam.fun/listings/${listing?.type}/${listing?.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      from: alertsEmail,
      to: user?.email,
      subject: 'You have been mentioned in a comment on Earn',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
