import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { type User } from '@/prisma/client';

import { pratikEmail } from '../../constants/emails';
import { Superteams } from '../../constants/Superteam';
import { WeeklyRoundupTemplate } from '../../email-templates/Listing/weeklyRoundupTemplate';
import { prisma } from '../../prisma';
import {
  developmentSkills,
  type MainSkills,
  nonDevelopmentSubSkills,
  type Skills,
  type SubSkillsType,
} from '../../types/Skills';

const ALLOWED_USERS = 20250;

type UserSkills = {
  skills: MainSkills;
  subskills: string[];
};

function userRegionEligibility(region: string, user: any) {
  if (region === 'Global') {
    return true;
  }

  const superteam = Superteams.find((st) => st.region === region);

  return !!(user?.location && superteam?.country.includes(user?.location));
}

export async function processWeeklyRoundup() {
  const batchSize = 10000;
  type UserSelect = Pick<
    User,
    'id' | 'skills' | 'email' | 'firstName' | 'lastName' | 'location'
  >;
  const users: UserSelect[] = [];
  let cursor: string | undefined = undefined;
  let totalFetched = 0;

  while (totalFetched < ALLOWED_USERS) {
    const batch: UserSelect[] = await prisma.user.findMany({
      take: Math.min(batchSize, ALLOWED_USERS - totalFetched),
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where: {
        emailSettings: {
          some: {
            category: 'weeklyListingRoundup',
          },
        },
        isTalentFilled: true,
      },
      select: {
        id: true,
        skills: true,
        email: true,
        firstName: true,
        lastName: true,
        location: true,
      },
      orderBy: {
        Submission: {
          _count: 'desc',
        },
      },
    });

    users.push(...batch);
    totalFetched += batch.length;

    if (batch.length < batchSize || totalFetched >= ALLOWED_USERS) {
      break;
    }

    cursor = batch[batch.length - 1].id;
  }

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      isWinnersAnnounced: false,
      deadline: { gte: dayjs().add(1, 'day').toISOString() },
      isPrivate: false,
    },
    include: { sponsor: true },
  });

  const processedListings = listings.map((listing) => {
    const listingSkills = listing.skills as Skills;

    const mainSkillsSet = new Set<MainSkills>(
      listingSkills.map((skill) => skill.skills),
    );
    const subSkillsSet = new Set<SubSkillsType>(
      listingSkills.flatMap((skill) => skill.subskills),
    );

    const developmentSkillsSet = new Set<string>(
      [...mainSkillsSet].filter((skill) => developmentSkills.includes(skill)),
    );
    const nonDevelopmentSubSkillsSet = new Set<string>(
      [...subSkillsSet].filter((subskill) =>
        nonDevelopmentSubSkills.includes(subskill),
      ),
    );

    return {
      ...listing,
      developmentSkillsSet,
      nonDevelopmentSubSkillsSet,
    };
  });

  const emails = [];

  for (const user of users) {
    if (!user) continue;

    let userSkills: UserSkills[] | null = null;

    if (typeof user.skills === 'string') {
      try {
        userSkills = JSON.parse(user.skills);
      } catch (error) {
        console.error('Failed to parse user skills:', error);
        continue;
      }
    } else {
      userSkills = user.skills as UserSkills[];
    }

    if (!userSkills) continue;

    const userMainSkillsSet = new Set<string>();
    const userSubSkillsSet = new Set<string>();

    userSkills.forEach((userSkill) => {
      if (Array.isArray(userSkill.skills)) {
        userSkill.skills.forEach((skill) => userMainSkillsSet.add(skill));
      } else {
        userMainSkillsSet.add(userSkill.skills);
      }
      userSkill.subskills.forEach((subskill) => userSubSkillsSet.add(subskill));
    });

    const matchingListings = processedListings.filter((listing) => {
      const hasDevelopmentSkillMatch = [...listing.developmentSkillsSet].some(
        (skill) => userMainSkillsSet.has(skill),
      );

      const hasNonDevelopmentSubSkillMatch = [
        ...listing.nonDevelopmentSubSkillsSet,
      ].some((subskill) => userSubSkillsSet.has(subskill));

      if (!(hasDevelopmentSkillMatch || hasNonDevelopmentSubSkillMatch)) {
        return false;
      }

      return userRegionEligibility(listing.region, user);
    });

    // console.log(matchingListings);

    if (matchingListings.length === 0) continue;

    const emailHtml = await render(
      WeeklyRoundupTemplate({
        name: user.firstName!,
        listings: matchingListings.map((listing) => ({
          id: listing.id,
          title: listing.title,
          sponsor: listing.sponsor.name,
          slug: listing.slug,
          type: listing.type,
          token: listing.token,
          rewardAmount: listing.rewardAmount,
          compensationType: listing.compensationType,
          maxRewardAsk: listing.maxRewardAsk,
          minRewardAsk: listing.minRewardAsk,
          usdValue: listing.usdValue,
          skills: listing.skills,
        })),
        userSkills,
      }),
    );

    emails.push({
      from: pratikEmail,
      to: user.email,
      subject: 'Your Weekly Listing Roundup Is Here!',
      html: emailHtml,
    });
  }

  return emails;
}
