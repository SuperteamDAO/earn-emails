import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { kashEmail } from '../../constants/emails';
import { ApplicationCompletedTemplate } from '../../email-templates/Application/applicationCompletedTemplate';
import { prisma } from '../../prisma';

export async function processApplicationCompleted(
  entityId: string,
  userId: string,
) {
  const application = await prisma.grantApplication.findFirst({
    where: { id: entityId },
    include: {
      user: true,
      grant: {
        include: {
          sponsor: true,
        },
      },
    },
  });

  if (!application) {
    console.log(`Grant application not found with id: ${entityId}`);
    return;
  }

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (!user) {
    console.log(`User not found with id: ${userId}`);
    return;
  }

  const emailHtml = await render(
    ApplicationCompletedTemplate({
      name: application.user.firstName!,
      sponsorName: application.grant.sponsor.name,
      applicationTitle: application.projectTitle,
      grantName: application.grant.title,
      grantLink: `${basePath}/grants/${application.grant.slug}`,
      otherGrantsLink: `${basePath}/grants/`,
    }),
  );
  const emailData = {
    from: kashEmail,
    to: application?.user.email,
    subject: 'You can now apply for this grant again',
    html: emailHtml,
  };
  return emailData;
}
