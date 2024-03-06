import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { MainSkills, Skills } from '../types';
import { prisma } from '../utils/prisma';
import { kashEmail } from '../constants/kashEmail';
import { WeeklyRoundupTemplate } from '../emailTemplates';
import { render } from '@react-email/render';

dayjs.extend(utc);

type Notifications = {
  label: MainSkills;
  timestamp: string;
}[];

export async function processWeeklyRoundup() {
  const users = await prisma.user.findMany({
    where: { isTalentFilled: true },
  });

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

  const emails = users
    .filter((user) => user.notifications !== null)
    .map((user) => {
      const userNotifications = user.notifications as Notifications;
      const matchingBounties = bounties.filter((bounty) => {
        const bountySkills = bounty.skills as Skills;
        return userNotifications.some((notification) =>
          bountySkills.some((bountySkill) =>
            bountySkill.skills.includes(notification.label),
          ),
        );
      });

      if (matchingBounties.length === 0) return null;

      const emailHtml = render(
        WeeklyRoundupTemplate({
          name: user.firstName!,
          bounties: matchingBounties.map((bounty) => ({
            title: bounty.title,
            rewardAmount: bounty.rewardAmount,
            sponsor: bounty.sponsor.name,
            slug: bounty.slug,
            type: bounty.type,
          })),
        }),
      );

      return {
        from: kashEmail,
        to: [user.email],
        subject: 'Your Weekly Bounty Roundup Is Here!',
        html: emailHtml,
      };
    })
    .filter(Boolean);

  return emails;
}
