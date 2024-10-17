import { Regions } from '@prisma/client';
import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath, kashEmail, Superteams } from '@/constants';
import { NewListingTemplate } from '@/email-templates';
import { prisma } from '@/prisma';
import {
  developmentSkills,
  nonDevelopmentSubSkills,
  type Skills,
} from '@/types';
import { getListingTypeLabel } from '@/utils';

export async function processCreateListing() {
  try {
    const eighteenHoursAgo = dayjs().subtract(18, 'hours').toISOString();
    const lastWeek = dayjs().subtract(7, 'days').toISOString();
    const now = dayjs().toISOString();

    console.log(eighteenHoursAgo);

    const listings = await prisma.bounties.findMany({
      where: {
        isPublished: true,
        isPrivate: false,
        isWinnersAnnounced: false,
        deadline: {
          gt: now,
        },
        type: {
          not: 'hackathon',
        },
        publishedAt: {
          gte: lastWeek,
          lt: eighteenHoursAgo,
        },
        shouldSendEmail: true,
        OR: [
          {
            compensationType: 'variable',
          },
          {
            usdValue: {
              gte: 1000,
            },
          },
        ],
      },
      select: {
        id: true,
        title: true,
        region: true,
        skills: true,
        type: true,
        slug: true,
        sponsor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'asc',
      },
    });

    if (listings.length === 0) {
      console.error('No listing found');
      return;
    }

    let selectedListing = null;

    for (const listing of listings) {
      const emailLogExists = await prisma.emailLogs.findFirst({
        where: {
          bountyId: listing.id,
          type: 'NEW_LISTING',
        },
      });

      if (!emailLogExists) {
        selectedListing = listing;
        break;
      }
    }

    if (!selectedListing) {
      console.error('All listings already have email logs');
      return;
    }

    const superteam = Superteams.find(
      (team) => team.region === selectedListing.region,
    );
    const countries = superteam ? superteam.country : [];

    const listingSkills = selectedListing.skills as Skills;
    const listingMainSkills = listingSkills.map((skill) => skill.skills);
    const listingSubSkills = listingSkills.flatMap((skill) => skill.subskills);

    const listingDevelopmentSkills = listingMainSkills.filter((skill) =>
      developmentSkills.includes(skill),
    );
    const listingNonDevelopmentSubSkills = listingSubSkills.filter((subskill) =>
      nonDevelopmentSubSkills.includes(subskill),
    );

    const developmentSkillConditions = listingDevelopmentSkills.map(
      (skill) => ({
        skills: {
          path: '$[*].skills',
          array_contains: skill,
        },
      }),
    );

    const nonDevelopmentSubSkillConditions = listingNonDevelopmentSubSkills.map(
      (subskill) => ({
        skills: {
          path: '$[*].subskills',
          array_contains: subskill,
        },
      }),
    );

    const users = await prisma.user.findMany({
      where: {
        isTalentFilled: true,
        ...(selectedListing.region !== Regions.GLOBAL && {
          location: { in: countries },
        }),
        OR: [
          ...developmentSkillConditions,
          ...nonDevelopmentSubSkillConditions,
        ],
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

    const emailData = await Promise.all(
      users.map(async (user) => {
        let userSkills: Skills | null = null;

        if (typeof user.skills === 'string') {
          try {
            userSkills = JSON.parse(user.skills);
          } catch (error) {
            console.error(`Failed to parse skills for user ${user.id}:`, error);
            return null;
          }
        } else {
          userSkills = user.skills as Skills;
        }

        if (!userSkills) return null;

        const listingTypeLabel = getListingTypeLabel(selectedListing.type);

        const emailHtml = render(
          NewListingTemplate({
            name: user.firstName!,
            link: `${basePath}/listings/${selectedListing.type}/${selectedListing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
            listingTitle: selectedListing.title,
            listingType: selectedListing.type,
          }),
        );

        let subject = '';
        if (listingMainSkills.length === 1) {
          subject = `Check out ${selectedListing.sponsor.name}'s Latest ${listingMainSkills[0]} ${listingTypeLabel}!`;
        } else {
          subject = `${selectedListing.sponsor.name} Has a New ${listingTypeLabel} Just for You!`;
        }

        return {
          from: kashEmail,
          to: user.email,
          subject,
          html: emailHtml,
        };
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'NEW_LISTING',
        bountyId: selectedListing.id,
      },
    });

    return emailData.filter((data) => data !== null);
  } catch (error) {
    console.error('Error in processCreateListing:', error);
    throw error;
  }
}
