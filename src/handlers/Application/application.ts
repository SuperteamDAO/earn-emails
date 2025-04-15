import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { helloEmail, pratikEmail } from '../../constants/emails';
import { ApplicationSponsorTemplate } from '../../email-templates/Application/applicationSponsorTemplate';
import { ApplicationTemplate } from '../../email-templates/Application/applicationTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processApplication(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirst({
    where: { id },
    include: {
      grant: {
        include: {
          poc: {
            select: {
              email: true,
              firstName: true,
            },
          },
        },
      },
    },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (!grantApplication || !user) {
    return;
  }

  const emailData = [];

  const userPreferenceSponsor = await getUserEmailPreference(
    grantApplication?.grant?.pocId,
    'application',
  );

  const isNativeGrant =
    grantApplication.grant.isNative &&
    !!grantApplication.grant.airtableId &&
    !grantApplication.grant.title?.toLowerCase().includes('coindcx');

  if (userPreferenceSponsor) {
    const sponsorEmailHtml = await render(
      ApplicationSponsorTemplate({
        name: grantApplication?.grant?.poc?.firstName!,
        applicationTitle: grantApplication.projectTitle,
        grantName: grantApplication.grant.title,
        link: `${basePath}/dashboard/grants/${grantApplication.grant.slug}/applications/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    emailData.push({
      from: pratikEmail,
      to: grantApplication?.grant?.poc?.email,
      subject: 'New Grant Application Received',
      html: sponsorEmailHtml,
    });
  } else {
    console.log(`User ${userId} has opted out of sponsor type email.`);
  }

  const salutation = isNativeGrant
    ? grantApplication.grant.emailSalutation
    : 'Best, Superteam Earn';

  const talentEmailHtml = await render(
    ApplicationTemplate({
      name: user.firstName!,
      applicationTitle: grantApplication.projectTitle,
      grant: grantApplication.grant,
      salutation,
    }),
  );

  emailData.push({
    from: isNativeGrant
      ? grantApplication.grant.emailSender + helloEmail
      : pratikEmail,
    to: user.email,
    subject: `Grant Application Received`,
    html: talentEmailHtml,
    replyTo: isNativeGrant
      ? grantApplication.grant.replyToEmail
      : 'support@superteamearn.com',
  });

  return emailData;
}
