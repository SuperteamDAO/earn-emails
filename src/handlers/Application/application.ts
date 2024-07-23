import { render } from '@react-email/render';
import { prisma } from '../../prisma';
import { kashEmail } from '../../constants';
import {
  ApplicationSponsorTemplate,
  ApplicationTemplate,
} from '../../email-templates';
import { getUserEmailPreference } from '../../utils';

export async function processApplication(id: string, userId: string) {
  const grantApplication = await prisma.grantApplication.findFirst({
    where: { id },
    include: {
      grant: {
        include: {
          sponsor: {
            select: {
              name: true,
            },
          },
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

  if (userPreferenceSponsor) {
    const sponsorEmailHtml = render(
      ApplicationSponsorTemplate({
        name: grantApplication?.grant?.poc?.firstName!,
        applicationTitle: grantApplication.projectTitle,
        grantName: grantApplication.grant.title,
        link: `https://earn.superteam.fun/dashboard/grants/${grantApplication.grant.slug}/applications/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    emailData.push({
      from: kashEmail,
      to: grantApplication?.grant?.poc?.email,
      subject: 'New Grant Application Received',
      html: sponsorEmailHtml,
    });
  } else {
    console.log(`User ${userId} has opted out of sponsor type email.`);
  }

  const sponsorName = grantApplication.grant.sponsor.name;
  const talentEmailHtml = render(
    ApplicationTemplate({
      name: user.firstName!,
      applicationTitle: grantApplication.projectTitle,
      sponsorName,
    }),
  );

  emailData.push({
    from: kashEmail,
    to: user.email,
    subject: `${sponsorName} Has Received Your Grant Application`,
    html: talentEmailHtml,
  });

  return emailData;
}
