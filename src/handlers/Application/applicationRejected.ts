import { render } from '@react-email/render';
import { prisma } from '../../prisma';
import { kashEmail } from '../../constants';
import { ApplicationRejectedTemplate } from '../../email-templates';

export async function processApplicationRejection(id: string, userId: string) {
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
      ApplicationRejectedTemplate({
        name: user.firstName!,
        applicationTitle: grantApplication.projectTitle,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user.email,
      subject: 'About your recent grant application',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
