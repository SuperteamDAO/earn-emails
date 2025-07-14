import { render } from '@react-email/render';

import { helloEmail, pratikEmail } from '../../constants/emails';
import { ApplicationApprovedTemplate } from '../../email-templates/Application/applicationApprovedTemplate';
import { NativeApplicationApprovedTemplate } from '../../email-templates/Application/nativeApplicationApprovedTemplate';
import { prisma } from '../../prisma';

export async function processApplicationApproval(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirstOrThrow({
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

  const isNativeGrant =
    grantApplication.grant.isNative &&
    !!grantApplication.grant.airtableId &&
    !grantApplication.grant.title?.toLowerCase().includes('coindcx');

  const sponsorName = grantApplication.grant.sponsor.name;

  if (grantApplication && user) {
    let emailData;
    if (isNativeGrant) {
      const language = grantApplication.grant.title
        .toLowerCase()
        .includes('france')
        ? 'fr'
        : grantApplication.grant.title.toLowerCase().includes('vietnam')
          ? 'vi'
          : 'en';

      const emailHtml = await render(
        NativeApplicationApprovedTemplate({
          name: user.firstName!,
          application: grantApplication,
          grant: grantApplication.grant,
          salutation: grantApplication.grant.emailSalutation,
          language,
        }),
      );

      const subject =
        language === 'fr'
          ? `[KYC requis] ${sponsorName} a approuvé votre subvention !`
          : language === 'vi'
            ? `[Cần KYC] ${sponsorName} đã phê duyệt khoản tài trợ của bạn!`
            : `[KYC needed] ${sponsorName} has approved your grant!`;

      emailData = {
        from: grantApplication.grant.emailSender + helloEmail,
        to: user.email,
        subject,
        html: emailHtml,
        replyTo: grantApplication.grant.replyToEmail,
      };
    } else {
      const emailHtml = await render(
        ApplicationApprovedTemplate({
          name: user.firstName!,
          applicationTitle: grantApplication.projectTitle,
          sponsorName,
        }),
      );

      emailData = {
        from: pratikEmail,
        to: user.email,
        subject: 'Your grant application has been approved!',
        html: emailHtml,
        checkUnsubscribe: false,
      };
    }

    return emailData;
  }

  return;
}
