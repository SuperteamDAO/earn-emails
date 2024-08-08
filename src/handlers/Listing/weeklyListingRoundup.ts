import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import {
  developmentSkills,
  nonDevelopmentSubSkills,
  MainSkills,
  Skills,
} from '../../types';
import { prisma } from '../../prisma';
import { WeeklyRoundupTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { Regions } from '@prisma/client';
import { Superteams, kashEmail } from '../../constants';

dayjs.extend(utc);

type UserSkills = {
  skills: MainSkills;
  subskills: string[];
};

const ALLOWED_USERS = 4000;

function userRegionEligibility(region: Regions, userInfo: any) {
  if (region === Regions.GLOBAL) {
    return true;
  }

  const superteam = Superteams.find((st) => st.region === region);

  const isEligible =
    !!(userInfo?.location && superteam?.country.includes(userInfo?.location)) ||
    false;

  return isEligible;
}

export async function processWeeklyRoundup() {
  const query = await prisma.user.findMany({
    where: {
      emailSettings: {
        some: {
          category: 'weeklyListingRoundup',
        },
      },
      isTalentFilled: true,
    },
    select: {
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
  });

  const users = query
    .map((user) => ({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      skills: user.skills,
      totalSubmissions: user.Submission.length,
    }))
    .sort((a, b) => b.totalSubmissions - a.totalSubmissions)
    .slice(0, ALLOWED_USERS);

  const bounties = await prisma.bounties.findMany({
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

    const matchingBounties = bounties.filter((bounty) => {
      const bountySkills = bounty.skills as Skills;
      const bountyMainSkills = bountySkills.map((skill) => skill.skills);
      const bountySubSkills = bountySkills.flatMap((skill) => skill.subskills);

      const bountyDevelopmentSkills = bountyMainSkills.filter((skill) =>
        developmentSkills.includes(skill),
      );
      const bountyNonDevelopmentSubSkills = bountySubSkills.filter((subskill) =>
        nonDevelopmentSubSkills.includes(subskill),
      );

      const skillsMatch = userSkills!.some((userSkill: UserSkills) => {
        const userMainSkills = userSkill.skills;
        const userSubSkills = userSkill.subskills;

        const developmentSkillMatch = bountyDevelopmentSkills.some((skill) =>
          userMainSkills.includes(skill),
        );
        const nonDevelopmentSubSkillMatch = bountyNonDevelopmentSubSkills.some(
          (subskill) => userSubSkills.includes(subskill),
        );

        return developmentSkillMatch || nonDevelopmentSubSkillMatch;
      });

      if (!skillsMatch) return false;

      return userRegionEligibility(bounty.region, user);
    });

    if (matchingBounties.length === 0) continue;

    const emailHtml = render(
      WeeklyRoundupTemplate({
        name: user.firstName!,
        bounties: matchingBounties.map((bounty) => ({
          id: bounty.id,
          title: bounty.title,
          sponsor: bounty.sponsor.name,
          slug: bounty.slug,
          type: bounty.type,
          token: bounty.token,
          rewardAmount: bounty.rewardAmount,
          compensationType: bounty.compensationType,
          maxRewardAsk: bounty.maxRewardAsk,
          minRewardAsk: bounty.minRewardAsk,
          usdValue: bounty.usdValue,
          skills: bounty.skills,
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
