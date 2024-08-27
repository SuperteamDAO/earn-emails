import { prisma } from '../../prisma';
import { Prisma, Regions } from '@prisma/client';
import { kashEmail, Superteams } from '../../constants';
import {
  developmentSkills,
  MainSkills,
  nonDevelopmentSubSkills,
  Skills,
} from '../../types';
import { render } from '@react-email/render';
import { WeeklyRoundupTemplate } from '../../email-templates';
import dayjs from 'dayjs';

const ALLOWED_USERS = 13500;

type UserSkills = {
  skills: MainSkills;
  subskills: string[];
};

type UserWithSubmissions = {
  id: string;
  skills: string | Prisma.JsonValue;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  Submission: {
    id: string;
    rewardInUSD: number | null;
    isWinner: boolean;
    listing: {
      isWinnersAnnounced: boolean;
    } | null;
  }[];
};

function userRegionEligibility(region: Regions, userInfo: any) {
  if (region === Regions.GLOBAL) {
    return true;
  }

  const superteam = Superteams.find((st) => st.region === region);

  return (
    !!(userInfo?.location && superteam?.country.includes(userInfo?.location)) ||
    false
  );
}

export async function processWeeklyRoundup() {
  async function getAllUsers() {
    let allUsers: UserWithSubmissions[] = [];
    let cursor = null;
    const batchSize = 1000;

    while (true) {
      const batch: UserWithSubmissions[] = await prisma.user.findMany({
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
          Submission: {
            select: {
              id: true,
              rewardInUSD: true,
              isWinner: true,
              listing: {
                select: {
                  isWinnersAnnounced: true,
                },
              },
            },
          },
        },
        take: batchSize,
        skip: cursor ? 1 : 0,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
      });

      allUsers = allUsers.concat(batch);

      if (batch.length < batchSize) {
        break;
      }

      cursor = batch[batch.length - 1].id;
    }

    return allUsers;
  }

  const users = await getAllUsers();

  const processedUsers = users
    .map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      skills: user.skills,
      totalSubmissions: user.Submission.length,
    }))
    .sort((a, b) => b.totalSubmissions - a.totalSubmissions)
    .slice(0, ALLOWED_USERS);

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

  const emails = [];

  for (const user of processedUsers) {
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

    const matchingListings = listings.filter((listing) => {
      const listingSkills = listing.skills as Skills;
      const listingMainSkills = listingSkills.map((skill) => skill.skills);
      const listingSubSkills = listingSkills.flatMap(
        (skill) => skill.subskills,
      );

      const listingDevelopmentSkills = listingMainSkills.filter((skill) =>
        developmentSkills.includes(skill),
      );
      const listingNonDevelopmentSubSkills = listingSubSkills.filter(
        (subskill) => nonDevelopmentSubSkills.includes(subskill),
      );

      const skillsMatch = userSkills!.some((userSkill: UserSkills) => {
        const userMainSkills = userSkill.skills;
        const userSubSkills = userSkill.subskills;

        const developmentSkillMatch = listingDevelopmentSkills.some((skill) =>
          userMainSkills.includes(skill),
        );
        const nonDevelopmentSubSkillMatch = listingNonDevelopmentSubSkills.some(
          (subskill) => userSubSkills.includes(subskill),
        );

        return developmentSkillMatch || nonDevelopmentSubSkillMatch;
      });

      if (!skillsMatch) return false;

      return userRegionEligibility(listing.region, user);
    });

    if (matchingListings.length === 0) continue;

    const emailHtml = render(
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
        userSkills: userSkills,
      }),
    );

    emails.push({
      from: kashEmail,
      to: user.email,
      subject: 'Your Weekly Listing Roundup Is Here!',
      html: emailHtml,
    });
  }

  return emails;
}
