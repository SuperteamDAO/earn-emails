import { Regions } from '@prisma/client';
import { Superteams } from '../../constants/Superteam';
import { prisma } from '../../utils/prisma';
import { Skills } from '../../types';
import { kashEmail } from '../../constants/kashEmail';
import { NewListingTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processCreateListing(id: string) {
  const category = getCategoryFromEmailType('createListing');

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

    const emails = users.map(async (user) => {
      const userPreference = await prisma.emailSettings.findFirst({
        where: {
          userId: user.id,
          category,
        },
      });

      if (!userPreference) {
        console.log(`User ${user.id} has opted out of this type of email.`);
        return null;
      }

      const emailHtml = render(
        NewListingTemplate({
          name: user.firstName!,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        }),
      );

      return {
        from: kashEmail,
        to: user.email,
        subject: 'Here’s a New Listing You’d Be Interested In..',
        html: emailHtml,
      };
    });

    return Promise.all(emails);
  } catch (error) {
    console.error('Error in processCreateListing:', error);
    throw error;
  }
}
