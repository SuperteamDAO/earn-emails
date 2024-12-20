import { render } from '@react-email/render';

import { kashEmail } from '../../constants/emails';
import { GrantPaymentReceivedTemplate } from '../../email-templates/Application/grantPaymentReceivedTemplate';
import { prisma } from '../../prisma';

export async function processGrantPayment(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirst({
    where: { id },
    include: {
      grant: {
        include: {
          sponsor: true,
        },
      },
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (grantApplication && user) {
    const emailHtml = await render(
      GrantPaymentReceivedTemplate({
        applicationTitle: grantApplication.projectTitle,
        sponsorName: grantApplication.grant.sponsor.name,
        walletAddress: grantApplication.walletAddress,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user.email,
      subject: 'Ka-ching! You have received a grant payment',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
