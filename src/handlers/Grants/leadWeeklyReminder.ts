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

  const grantsWithPendingItems = await prisma.grants.findMany({
    where: {
      isPublished: true,
      OR: [
        {
          GrantApplication: {
            some: {
              applicationStatus: 'Pending',
              createdAt: { gte: sevenDaysAgo.toDate(), lte: now.toDate() },
            },
          },
        },
        {
          GrantTranche: {
            some: {
              status: 'Pending',
              createdAt: { gte: sevenDaysAgo.toDate(), lte: now.toDate() },
            },
          },
        },
      ],
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
      GrantTranche: {
        where: {
          status: 'Pending',
          createdAt: { gte: sevenDaysAgo.toDate(), lte: now.toDate() },
        },
        select: { id: true },
      },
    },
  });

  console.log(grantsWithPendingItems);

  const emailsToSend = [];

  for (const grant of grantsWithPendingItems) {
    if (!grant.poc || !grant.poc.email) {
      console.warn(`Grant ID ${grant.id} is missing POC`);
      continue;
    }

    const pendingApplicationCount = grant.GrantApplication.length;
    const pendingTrancheCount = grant.GrantTranche.length;

    let subject: string;
    if (pendingApplicationCount > 0 && pendingTrancheCount > 0) {
      subject = `Reminder: You have ${pendingApplicationCount} pending grant application(s)`;
    } else if (pendingApplicationCount > 0) {
      subject = `Reminder: You have ${pendingApplicationCount} pending grant application(s)`;
    } else {
      subject = `Reminder: You have ${pendingTrancheCount} pending tranche requests`;
    }

    const emailHtml = await render(
      LeadWeeklyReminderTemplate({
        leadName: grant.poc.firstName || 'Team',
        pendingApplicationCount,
        pendingTrancheCount,
        grantName: grant.title,
      }),
    );

    emailsToSend.push({
      from: pratikEmail,
      to: grant.poc.email,
      subject,
      html: emailHtml,
    });
  }

  return emailsToSend;
}
