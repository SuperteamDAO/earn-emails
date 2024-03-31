import { Regions } from '@prisma/client';
import { Superteams } from '../../constants/Superteam';
import { prisma } from '../../utils/prisma';
import { Skills } from '../../types';
import { kashEmail } from '../../constants/kashEmail';
import { NewListingTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processCreateListing(id: string, userId: string) {
  const category = getCategoryFromEmailType('createListing');

  const userPreference = await prisma.emailSettings.findFirst({
    where: {
      userId: userId,
      category,
    },
  });

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const listing = await prisma.bounties.findUnique({
    where: {
      id,
    },
  });

  if (listing) {
    const superteam = Superteams.find((team) => team.region === listing.region);
    const countries = superteam ? superteam.country : [];

    const listingSkills = listing.skills as Skills;

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
      const userSkills =
        typeof user.skills === 'string' ? JSON.parse(user.skills) : user.skills;

      return userSkills.some((userSkill: { skills: string }) =>
        listingSkills.some(
          (listingSkill) => listingSkill.skills === userSkill.skills,
        ),
      );
    });

    const emails = users.map((user) => {
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
