import { render } from '@react-email/render';

import { helloEmail, pratikEmail } from '../../constants/emails';
import { ApplicationRejectedTemplate } from '../../email-templates/Application/applicationRejectedTemplate';
import { prisma } from '../../prisma';

export async function processApplicationRejection(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirstOrThrow({
    where: { id },
    include: {
      grant: true,
    },
  });

  const isNativeGrant =
    grantApplication.grant.isNative &&
    !!grantApplication.grant.airtableId &&
    !grantApplication.grant.title?.toLowerCase().includes('coindcx');

  const salutation = isNativeGrant
    ? grantApplication.grant.emailSalutation
    : 'Best, Superteam Earn';

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (grantApplication && user) {
    const language = grantApplication.grant.title
      .toLowerCase()
      .includes('france')
      ? 'fr'
      : grantApplication.grant.title.toLowerCase().includes('vietnam')
        ? 'vi'
        : 'en';

    const emailHtml = await render(
      ApplicationRejectedTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
        grantName: grantApplication.grant.title,
        salutation,
        language,
      }),
    );

    const subject =
      language === 'fr'
        ? 'À propos de votre récente candidature de subvention'
        : language === 'vi'
          ? 'Về đơn xin tài trợ gần đây của bạn'
          : 'About your recent grant application';

    const emailData = {
      from: isNativeGrant
        ? grantApplication.grant.emailSender + helloEmail
        : pratikEmail,
      to: user.email,
      subject,
      html: emailHtml,
      replyTo: isNativeGrant
        ? grantApplication.grant.replyToEmail
        : 'support@superteamearn.com',
      checkUnsubscribe: false,
    };
    return emailData;
  }

  return;
}
