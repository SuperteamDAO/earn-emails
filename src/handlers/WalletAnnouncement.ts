import { render } from '@react-email/render';

import { pratikEmail } from '../constants/emails';
import { WalletAnnouncementTemplate } from '../email-templates/WalletAnnoucementTemplate';
import { prisma } from '../prisma';

export async function processWalletAnnouncement() {
  const users = await prisma.user.findMany({
    where: {
      isTalentFilled: true,
    },
  });

  const emails = [];

  for (const user of users) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        userId: user.id,
        type: 'WALLET_ANNOUNCEMENT',
      },
    });

    if (checkLogs) continue;

    const emailHtml = await render(
      WalletAnnouncementTemplate({
        name: user.firstName,
      }),
    );

    emails.push({
      from: pratikEmail,
      to: user.email,
      subject: 'Earning has never been simpler',
      html: emailHtml,
    });

    console.log(emails);

    await prisma.emailLogs.create({
      data: {
        type: 'WALLET_ANNOUNCEMENT',
        userId: user.id,
      },
    });
  }

  return emails;
}
