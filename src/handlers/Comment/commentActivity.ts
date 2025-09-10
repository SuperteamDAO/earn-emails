import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { CommentActivityTemplate } from '../../email-templates/Comment/commentActivityTemplate';
import { CommentRefType } from '../../generated/prisma/enums';
import { prisma } from '../../prisma';
import { capitalizeWords } from '../../utils/capitalizeWords';
import { getCommentSourceURL } from '../../utils/comment';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

function typeToLabel(ref: CommentRefType, isProject?: boolean) {
  switch (ref) {
    case 'POW':
      return 'Personal Project';
    case 'SUBMISSION':
      return isProject ? 'Application' : 'Submission';
    case 'GRANT_APPLICATION':
      return 'Grant Application';
    default:
  }
}

export async function processCommentActivity(
  id: string,
  _: string,
  otherInfo: any,
) {
  const type = otherInfo.type as CommentRefType;
  const { personName } = otherInfo;
  if (!CommentRefType[type]) {
    console.log('Invalid comment ref type', type);
    return;
  }

  let firstName: string | null = null;
  let userEmail: string | null = null;
  let userId: string | null = null;
  let isProject = false;
  if (type === 'SUBMISSION') {
    const submission = await prisma.submission.findUnique({
      where: { id },
      select: {
        userId: true,
        listing: {
          select: {
            type: true,
          },
        },
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
    });
    if (submission) {
      firstName = submission.user.firstName;
      userEmail = submission.user.email;
      userId = submission.userId;
      isProject = submission.listing.type === 'project';
    }
  }
  if (type === 'POW') {
    const pow = await prisma.poW.findUnique({
      where: { id },
      select: {
        userId: true,
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
    });
    if (pow) {
      firstName = pow.user.firstName;
      userEmail = pow.user.email;
      userId = pow.userId;
    }
  }
  if (type === 'GRANT_APPLICATION') {
    const grantApplication = await prisma.grantApplication.findUnique({
      where: { id },
      select: {
        userId: true,
        user: {
          select: {
            email: true,
            firstName: true,
          },
        },
      },
    });
    if (grantApplication) {
      firstName = grantApplication.user.firstName;
      userEmail = grantApplication.user.email;
      userId = grantApplication.userId;
    }
  }

  if (userEmail && userId) {
    const userPreference = await getUserEmailPreference(
      userId,
      'commentActivity',
    );

    const link = getCommentSourceURL(basePath, type, null, id).toString();
    if (userPreference) {
      const emailHtml = await render(
        CommentActivityTemplate({
          name: firstName || 'Someone',
          personName: capitalizeWords(personName),
          link,
          type,
        }),
      );

      const emailData = {
        from: pratikEmail,
        to: userEmail,
        subject: `Comment Received on Your Superteam Earn ${typeToLabel(type, isProject)}`,
        html: emailHtml,
      };
      return emailData;
    }
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }
}
