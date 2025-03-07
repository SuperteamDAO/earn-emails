import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { ApplicationApprovedTemplate } from '../../email-templates/Application/applicationApprovedTemplate';
import { prisma } from '../../prisma';

export async function processApplicationApproval(id: string, userId: string) {
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
      ApplicationApprovedTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
        sponsorName: grantApplication.grant.sponsor.name,
      }),
    );

    const emailData = {
      from: pratikEmail,
      to: user.email,
      subject: 'Your grant application has been approved!',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
