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
    const language = tranche.Grant.title.toLowerCase().includes('france')
      ? 'fr'
      : tranche.Grant.title.toLowerCase().includes('vietnam')
        ? 'vi'
        : 'en';

    const emailHtml = await render(
      TrancheApprovedTemplate({
        name: user.firstName!,
        projectTitle: tranche.GrantApplication.projectTitle,
        sponsorName,
        approvedTrancheAmount: tranche.approvedAmount ?? 0,
        token: tranche.Grant.token ?? '',
        salutation: tranche.Grant.emailSalutation,
        language,
      }),
    );

    const subject =
      language === 'fr'
        ? 'Demande de tranche acceptée'
        : language === 'vi'
          ? 'Yêu cầu giải ngân đã được chấp thuận'
          : 'Tranche Request Accepted';

    const emailData = {
      from: tranche.Grant.emailSender + helloEmail,
      to: user.email,
      subject,
      html: emailHtml,
      checkUnsubscribe: false,
    };

    return emailData;
  }

  return;
}
