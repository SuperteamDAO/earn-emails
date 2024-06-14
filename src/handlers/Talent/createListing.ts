import { Regions } from '@prisma/client';
import { Superteams } from '../../constants';
import { prisma } from '../../prisma';
import { Skills } from '../../types';
import { NewListingTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { getUserEmailPreference } from '../../utils';

export async function processCreateListing(id: string) {
  try {
    const listing = await prisma.bounties.findUnique({
      where: { id },
    });

    if (!listing) {
      console.error('No listing found with the provided ID:', id);
      return;
    }

    const superteam = Superteams.find((team) => team.region === listing.region);
    const countries = superteam ? superteam.country : [];
    const listingSkills = listing.skills as Skills;

    const users = await prisma.user.findMany({
      where: {
        isTalentFilled: true,
        ...(listing.region !== Regions.GLOBAL && {
          location: { in: countries },
        }),
        skills: {
          path: '$[*].skills',
          array_contains: listingSkills.map((skill) => skill.skills),
        },
      },
    });

    const emailData = [];

    for (const user of users) {
      if (!user.skills) {
        console.log(`User ${user.id} has no skills information.`);
        continue;
      }

      let userSkills: Skills[] | null = null;

      if (typeof user.skills === 'string') {
        try {
          userSkills = JSON.parse(user.skills);
        } catch (error) {
          console.error(`Failed to parse skills for user ${user.id}:`, error);
          continue;
        }
      } else {
        userSkills = user.skills as Skills[];
      }

      if (!userSkills) continue;

      const userPreference = await getUserEmailPreference(
        user.id,
        'createListing',
      );

      if (!userPreference) {
        console.log(`User ${user.id} has opted out of this type of email.`);
        continue;
      }

      const emailHtml = render(
        NewListingTemplate({
          name: user.firstName!,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        }),
      );

      emailData.push({
        to: user.email,
        subject: 'Here’s a New Listing You’d Be Interested In..',
        html: emailHtml,
      });
    }

    return emailData;
  } catch (error) {
    console.error('Error in processCreateListing:', error);
    throw error;
  }
}
