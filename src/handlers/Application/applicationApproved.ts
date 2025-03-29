import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
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
      const emailHtml = await render(
        NativeApplicationApprovedTemplate({
          name: user.firstName!,
          application: grantApplication,
          grant: grantApplication.grant,
        }),
      );

      emailData = {
        from: pratikEmail,
        to: user.email,
        subject: `[KYC needed] ${sponsorName} has approved your grant!`,
        html: emailHtml,
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
      };
    }

    return emailData;
  }

  return;
}
