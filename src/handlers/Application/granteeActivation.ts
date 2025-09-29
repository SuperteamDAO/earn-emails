import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { pratikEmail } from '../../constants/emails';
import { GranteeActivationTemplate } from '../../email-templates/Application/granteeActivationTemplate';
import { prisma } from '../../prisma';

export async function processGranteeActivation() {
  dayjs.extend(utc);

  const tenDaysAgoStart = dayjs.utc().subtract(10, 'day').startOf('day');
  const tenDaysAgoEnd = dayjs.utc().subtract(10, 'day').endOf('day');
  console.log('tenDaysAgoStart => ', tenDaysAgoStart.toISOString());
  console.log('tenDaysAgoEnd => ', tenDaysAgoEnd.toISOString());

  const grantApplications = await prisma.grantApplication.findMany({
    where: {
      applicationStatus: 'Approved',
      approvedAmountInUSD: {
        gt: 1000,
      },
      decidedAt: {
        gte: tenDaysAgoStart.toISOString(),
        lte: tenDaysAgoEnd.toISOString(),
      },
    },
    include: {
      user: true,
    },
  });
  console.log('grantApplications.length => ', grantApplications.length);

  const emailData = [];

  const userCount = await prisma.user.count();
  const errorCount = 289;
  const roundedUserCount = Math.ceil((userCount - errorCount) / 10) * 10;

  console.log('roundedUserCount => ', roundedUserCount);
  for (const application of grantApplications) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        userId: application.userId,
        type: 'GRANTEE_ACTIVATION',
      },
    });

    if (checkLogs) continue;
    console.log('application.user.firstName => ', application.user.firstName);

    const emailHtml = await render(
      GranteeActivationTemplate({
        name: application.user.firstName || 'there',
        projectTitle: application.projectTitle,
        userCount: roundedUserCount,
        ctaLink:
          'https://earn.superteam.fun/sponsor?utm_source=superteamearn&utm_medium=email&utm_campaign=granteesponsor',
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'GRANTEE_ACTIVATION',
        userId: application.userId,
      },
    });

    emailData.push({
      from: pratikEmail,
      to: application.user.email,
      bcc: ['pratikd.earnings@gmail.com'],
      subject: 'The grant is only the beginning..',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
