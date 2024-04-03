import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MainSkills, Skills } from '../../types';
import { prisma } from '../../utils/prisma';
import { kashEmail } from '../../constants/kashEmail';
import { WeeklyRoundupTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import { Regions } from '@prisma/client';
import { Superteams } from '../../constants/Superteam';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

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
  const users = await prisma.user.findMany({
    where: { isTalentFilled: true },
  });

  const category = getCategoryFromEmailType('weeklyListingRoundup');

  const bounties = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      isWinnersAnnounced: false,
      deadline: { gte: dayjs().add(1, 'day').toISOString() },
    },
    include: { sponsor: true },
  });

  const emails = await Promise.all(
    users.map(async (user) => {
      const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
        where: {
          id: user.id,
        },
      });

      if (isUnsubscribed) return null;

      const userPreference = await prisma.emailSettings.findFirst({
        where: {
          userId: user.id,
          category,
        },
      });

      if (!userPreference) return null;

      const userSkills =
        typeof user.skills === 'string'
          ? JSON.parse(user.skills)
          : (user.skills as UserSkills[]);

      const matchingBounties = bounties.filter((bounty) => {
        const bountySkills = bounty.skills as Skills;
        const skillsMatch = userSkills.some((userSkill: UserSkills) =>
          bountySkills.some(
            (bountySkill) => bountySkill.skills === userSkill.skills,
          ),
        );

        if (!skillsMatch) return false;

        return userRegionEligibility(bounty.region, user);
      });

      if (matchingBounties.length === 0) return null;

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

      return {
        from: kashEmail,
        to: [user.email],
        subject: 'Your Weekly Bounty Roundup Is Here!',
        html: emailHtml,
      };
    }),
  ).then((results) => results.filter(Boolean));

  return emails;
}
