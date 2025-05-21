import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { pratikEmail } from '../../constants/emails';
import { LeadWeeklyReminderTemplate } from '../../email-templates/Grants/LeadWeeklyReminderTemplate';
import { prisma } from '../../prisma';

export async function processLeadWeeklyReminder() {
  dayjs.extend(utc);

  const sevenDaysAgo = dayjs.utc().subtract(7, 'day');
  const now = dayjs.utc();

  const grantsWithFilteredApplications = await prisma.grants.findMany({
    where: {
      isPublished: true,
      GrantApplication: {
        some: {
          applicationStatus: 'Pending',
          createdAt: { gte: sevenDaysAgo.toDate(), lte: now.toDate() },
        },
      },
    },
    include: {
      poc: true,
      GrantApplication: {
        where: {
          applicationStatus: 'Pending',
          createdAt: { gte: sevenDaysAgo.toDate(), lte: now.toDate() },
        },
        select: { id: true },
      },
    },
  });

  console.log(grantsWithFilteredApplications);

  const emailsToSend = [];

  for (const grant of grantsWithFilteredApplications) {
    if (!grant.poc || !grant.poc.email) {
      console.warn(`Grant ID ${grant.id} is missing POC`);
      continue;
    }

    const pendingApplicationCount = grant.GrantApplication.length;

    const emailHtml = await render(
      LeadWeeklyReminderTemplate({
        leadName: grant.poc.firstName || 'Team',
        pendingApplicationCount,
        grantName: grant.title,
      }),
    );

    emailsToSend.push({
      from: pratikEmail,
      to: grant.poc.email,
      subject: `Reminder: You have ${pendingApplicationCount} pending applications`,
      html: emailHtml,
    });
  }

  return emailsToSend;
}
