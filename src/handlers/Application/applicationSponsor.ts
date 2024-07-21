import { render } from '@react-email/render';
import { prisma } from '../../prisma';
import { kashEmail } from '../../constants';
import { ApplicationSponsorTemplate } from '../../email-templates';

export async function processApplicationSponsor(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirst({
    where: { id },
    include: {
      grant: true,
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (grantApplication && user) {
    const emailHtml = render(
      ApplicationSponsorTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
        grantName: grantApplication.grant.title,
        link: `https://earn.superteam.fun/dashboard/grants/${grantApplication?.grant.slug}/applications/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
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
