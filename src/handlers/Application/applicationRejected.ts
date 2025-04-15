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
    const emailHtml = await render(
      ApplicationRejectedTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
        salutation,
      }),
    );

    const emailData = {
      from: isNativeGrant
        ? grantApplication.grant.emailSender + helloEmail
        : pratikEmail,
      to: user.email,
      subject: 'About your recent grant application',
      html: emailHtml,
      replyTo: isNativeGrant
        ? grantApplication.grant.replyToEmail
        : 'support@superteamearn.com',
    };
    return emailData;
  }

  return;
}
