import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { TrancheRejectedTemplate } from '../../email-templates/Application/trancheRejectedTemplate';
import { prisma } from '../../prisma';

export async function processTrancheRejection(id: string) {
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
      TrancheRejectedTemplate({
        name: user.firstName!,
        projectTitle: tranche.GrantApplication.projectTitle,
        sponsorName,
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
