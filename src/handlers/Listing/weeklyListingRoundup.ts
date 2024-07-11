import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MainSkills, Skills } from '../../types';
import { prisma } from '../../prisma';
import { WeeklyRoundupTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { Regions } from '@prisma/client';
import { Superteams, kashEmail } from '../../constants';
import { getUserEmailPreference } from '../../utils';

dayjs.extend(utc);

type UserSkills = {
  skills: MainSkills;
  subskills: string[];
};

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
  const dateThreshold = dayjs('2024-06-21').toISOString();

  const usersWithEmailSettings = await prisma.emailSettings.findMany({
    where: {
      category: 'weeklyListingRoundup',
      OR: [
        {
          user: {
            createdAt: {
              gt: new Date(dateThreshold),
            },
          },
        },
        {
          user: {
            Submission: {
              some: {},
            },
          },
        },
      ],
    },
    include: {
      user: true,
    },
  });

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

  for (const { user } of usersWithEmailSettings) {
    if (!user) continue;

    const emailPreference = getUserEmailPreference(
      user.id,
      'weeklyListingRoundup',
    );

    if (!emailPreference) continue;

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
      const skillsMatch = userSkills!.some((userSkill: UserSkills) =>
        bountySkills.some(
          (bountySkill) => bountySkill.skills === userSkill.skills,
        ),
      );

      if (!skillsMatch) return false;

      return userRegionEligibility(bounty.region, user);
    });

    if (matchingBounties.length === 0) continue;

    const emailHtml = render(
      WeeklyRoundupTemplate({
        name: user.firstName!,
        bounties: matchingBounties.map((bounty) => ({
          title: bounty.title,
          sponsor: bounty.sponsor.name,
          slug: bounty.slug,
          type: bounty.type,
          token: bounty.token,
          rewardAmount: bounty.rewardAmount,
          compensationType: bounty.compensationType,
          maxRewardAsk: bounty.maxRewardAsk,
          minRewardAsk: bounty.minRewardAsk,
        })),
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
