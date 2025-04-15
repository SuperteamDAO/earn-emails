import { render } from '@react-email/render';

import { helloEmail } from '../../constants/emails';
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

  const language = tranche.GrantApplication.projectTitle.includes('france')
    ? 'fr'
    : tranche.GrantApplication.projectTitle.includes('vietnam')
      ? 'vi'
      : 'en';

  const subject =
    language === 'fr'
      ? 'Demande de tranche rejetée'
      : language === 'vi'
        ? 'Yêu cầu giải ngân bị từ chối'
        : 'Tranche Request Rejected';

  if (tranche && user) {
    const emailHtml = await render(
      TrancheRejectedTemplate({
        name: user.firstName!,
        projectTitle: tranche.GrantApplication.projectTitle,
        sponsorName,
        salutation: tranche.Grant.emailSalutation,
        language,
      }),
    );

    const emailData = {
      from: tranche.Grant.emailSender + helloEmail,
      to: user.email,
      subject,
      html: emailHtml,
      replyTo: tranche.Grant.replyToEmail,
    };
    return emailData;
  }

  return;
}
