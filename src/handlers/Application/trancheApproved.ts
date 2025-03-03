import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { TrancheApprovedTemplate } from '../../email-templates/Application/trancheApprovedTemplate';
import { prisma } from '../../prisma';

export async function processTrancheApproved(id: string, userId: string) {
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
    where: { id: userId as string },
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
      }),
    );

    const emailData = {
      from: pratikEmail,
      to: user.email,
      subject: 'Tranche Request Accepted',
      html: emailHtml,
    };

    return emailData;
  }

  return;
}
