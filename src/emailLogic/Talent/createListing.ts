import { Regions } from '@prisma/client';
import { Superteams } from '../../constants/Superteam';
import { prisma } from '../../utils/prisma';
import { Skills } from '../../types';
import { kashEmail } from '../../constants/kashEmail';
import { NewListingTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';

export async function processCreateListing(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: {
      id,
    },
  });

  if (listing) {
    const superteam = Superteams.find((team) => team.region === listing.region);
    const countries = superteam ? superteam.country : [];

    const skills = listing.skills as Skills;

    const users = (
      await prisma.user.findMany({
        where: {
          isTalentFilled: true,
          ...(listing.region !== Regions.GLOBAL && {
            location: {
              in: countries,
            },
          }),
        },
      })
    ).filter((user) => {
      if (!user.notifications) return false;

      const userNotifications =
        typeof user.notifications === 'string'
          ? JSON.parse(user.notifications)
          : user.notifications;

      return userNotifications.some((notification: { label: string }) =>
        skills.some((skill) => skill.skills === notification.label),
      );
    });

    const emails: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }[] = users.map((user) => {
      const emailHtml = render(
        NewListingTemplate({
          name: user.firstName!,
          link: `https://earn.superteam.fun/listings/${listing?.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        }),
      );
      return {
        from: kashEmail,
        to: user.email,
        subject: 'Here’s a New Listing You’d Be Interested In..',
        html: emailHtml,
      };
    });

    return emails;
  }

  return;
}
