import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { LeadWeeklyReminderTemplate } from '../../email-templates/Grants/LeadWeeklyReminderTemplate';
import { prisma } from '../../prisma';

export async function processLeadWeeklyReminder() {
  const grantsWithPendingItems = await prisma.grants.findMany({
    where: {
      isPublished: true,
      OR: [
        { GrantApplication: { some: { applicationStatus: 'Pending' } } },
        { GrantTranche: { some: { status: 'Pending' } } },
      ],
    },
    include: {
      poc: true,
      GrantApplication: {
        where: {
          applicationStatus: 'Pending',
        },
        select: { id: true },
      },
      GrantTranche: {
        where: {
          status: 'Pending',
        },
        select: { id: true },
      },
    },
  });

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
      subject = `Reminder: You have ${pendingTrancheCount} pending tranche request(s)`;
    }

    console.log({
      leadName: grant.poc.firstName || 'Team',
      pendingApplicationCount,
      pendingTrancheCount,
      grantName: grant.title,
    });

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
