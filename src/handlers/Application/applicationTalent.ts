import { render } from '@react-email/render';
import { prisma } from '../../prisma';
import { kashEmail } from '../../constants';
import { ApplicationTemplate } from '../../email-templates';

export async function processApplicationTalent(id: string, userId: string) {
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
    const emailHtml = render(
      ApplicationTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
        sponsorName: grantApplication.grant.sponsor.name,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user.email,
      subject: 'New Grant Application Received',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
