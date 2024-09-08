import { render } from '@react-email/render';
import { ApplicationLikeTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { basePath, kashEmail } from '../../constants';

export async function processApplicationLike(id: string, userId: string) {
  const userPreference = await getUserEmailPreference(userId, 'submissionLike');

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const application = await prisma.grantApplication.findUnique({
    where: { id },
    include: {
      user: true,
      grant: {
        include: {
          sponsor: true
        }
      }
    },
  });

  if (application) {
    const emailHtml = render(
      ApplicationLikeTemplate({
        name: application.user.firstName!,
        sponsorName: application.grant.sponsor.name,
        link: `${basePath}/feed/`,
      }),
    );
    const emailData = {
      from: kashEmail,
      to: application?.user.email,
      subject: 'People are loving your grant win!',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
