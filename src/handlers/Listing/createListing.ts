import { Regions } from '@prisma/client';
import { Superteams, kashEmail, listingsEmail } from '../../constants';
import { prisma } from '../../prisma';
import { Skills } from '../../types';
import { NewListingTemplate } from '../../email-templates';
import { render } from '@react-email/render';

export async function processCreateListing(id: string) {
  try {
    const listing = await prisma.bounties.findUnique({
      where: { id },
      select: {
        id: true,
        region: true,
        skills: true,
        type: true,
        slug: true,
      },
    });

    if (!listing) {
      console.error('No listing found with the provided ID:', id);
      return;
    }

    const superteam = Superteams.find((team) => team.region === listing.region);
    const countries = superteam ? superteam.country : [];
    const listingSkills = listing.skills as Skills;

    const listingSkillNames = listingSkills.map((skill) => skill.skills);

    const users = await prisma.user.findMany({
      where: {
        isTalentFilled: true,
        ...(listing.region !== Regions.GLOBAL && {
          location: { in: countries },
        }),
        skills: {
          path: '$[*].skills',
          array_contains: listingSkillNames,
        },
        emailSettings: {
          some: {
            category: 'createListing',
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        skills: true,
      },
    });

    const emailData = users
      .map((user) => {
        let userSkills: Skills[] | null = null;

        if (typeof user.skills === 'string') {
          try {
            userSkills = JSON.parse(user.skills);
          } catch (error) {
            console.error(`Failed to parse skills for user ${user.id}:`, error);
            return null;
          }
        } else {
          userSkills = user.skills as Skills[];
        }

        if (!userSkills) return null;

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
      })
      .filter((data) => data !== null);

    return emailData;
  } catch (error) {
    console.error('Error in processCreateListing:', error);
    throw error;
  }
}
