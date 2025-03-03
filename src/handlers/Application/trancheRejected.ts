import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { TrancheRejectedTemplate } from '../../email-templates/Application/trancheRejectedTemplate';
import { prisma } from '../../prisma';

export async function processTrancheRejection(id: string, userId: string) {
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
      TrancheRejectedTemplate({
        name: user.firstName!,
        projectTitle: grantApplication.projectTitle,
        sponsorName: grantApplication.grant.sponsor.name,
      }),
    );

    const emailData = {
      from: pratikEmail,
      to: user.email,
      subject: 'Tranche Request Rejected',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
