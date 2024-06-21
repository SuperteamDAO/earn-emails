import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MainSkills, Skills } from '../../types';
import { prisma } from '../../prisma';
import { WeeklyRoundupTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import { Regions } from '@prisma/client';
import { Superteams, listingsEmail } from '../../constants';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(utc);
dayjs.extend(isoWeek);

type UserSkills = {
  skills: MainSkills;
  subskills: string[];
};

const currentWeekNumber = dayjs().isoWeek();
const currentYear = dayjs().year();

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
  const usersWithEmailSettings = await prisma.emailSettings.findMany({
    where: {
      category: 'weeklyListingRoundup',
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
      from: listingsEmail,
      to: user.email,
      subject: `Listings of Week, Handpicked for You (Week ${currentWeekNumber}, ${currentYear})`,
      html: emailHtml,
    });
  }

  return emails;
}
