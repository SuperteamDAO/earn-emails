import { render } from '@react-email/render';

import { pratikEmail } from '../constants/emails';
import { FeatureAnnouncementTemplate } from '../email-templates/FeatureAnnouncementTemplate';
import { prisma } from '../prisma';
import { getUserEmailPreference } from '../utils/getUserEmailPreference';

export async function processFeatureAnnouncement() {
  const users = await prisma.user.findMany({
    where: {
      isTalentFilled: true,
    },
  });

  const emails = [];

  const emailType = 'CREDITS_ANNOUNCEMENT';

  for (const user of users) {
    const userPreference = await getUserEmailPreference(
      user.id,
      'featureAnnouncement',
    );

    if (!userPreference) {
      console.log(`User ${user.id} has opted out of this type of email.`);
      continue;
    }
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        userId: user.id,
        type: emailType,
      },
    });

    if (checkLogs) continue;

    const emailHtml = await render(
      FeatureAnnouncementTemplate({
        name: user.firstName,
      }),
    );

    emails.push({
      from: pratikEmail,
      to: user.email,
      subject: 'Introducing: Submission Credits',
      html: emailHtml,
    });

    console.log(emails);

    await prisma.emailLogs.create({
      data: {
        type: emailType,
        userId: user.id,
      },
    });
  }

  return emails;
}
