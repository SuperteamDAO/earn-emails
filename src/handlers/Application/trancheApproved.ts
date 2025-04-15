import { render } from '@react-email/render';

import { helloEmail } from '../../constants/emails';
import { TrancheApprovedTemplate } from '../../email-templates/Application/trancheApprovedTemplate';
import { prisma } from '../../prisma';

export async function processTrancheApproved(id: string) {
  const tranche = await prisma.grantTranche.findFirstOrThrow({
    where: { id },
    include: {
      Grant: {
        include: {
          sponsor: true,
        },
      },
      GrantApplication: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: tranche.GrantApplication.userId },
  });

  const sponsorName = tranche.Grant.sponsor.name;

  if (tranche && user) {
    const emailHtml = await render(
      TrancheApprovedTemplate({
        name: user.firstName!,
        projectTitle: tranche.GrantApplication.projectTitle,
        sponsorName,
        approvedTrancheAmount: tranche.approvedAmount ?? 0,
        token: tranche.Grant.token ?? '',
        salutation: tranche.Grant.emailSalutation,
      }),
    );

    const emailData = {
      from: tranche.Grant.emailSender + helloEmail,
      to: user.email,
      subject: 'Tranche Request Accepted',
      html: emailHtml,
    };

    return emailData;
  }

  return;
}
