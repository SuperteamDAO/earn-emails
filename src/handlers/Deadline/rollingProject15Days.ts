import { prisma } from '../../prisma';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getUserEmailPreference } from '../../utils';
import { kashEmail } from '../../constants';
import { Rolling15DaysTemplate } from '../../email-templates';

export async function processRollingProject15Days() {
  dayjs.extend(utc);

  const fifteenDaysFromNowStart = dayjs.utc().add(15, 'day').startOf('day');
  const fifteenDaysFromNowEnd = dayjs.utc().add(15, 'day').endOf('day');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      publishedAt: {
        lt: fifteenDaysFromNowStart.toISOString(),
        gte: fifteenDaysFromNowEnd.toISOString(),
      },
      isWinnersAnnounced: false,
      type: 'project',
      applicationType: 'rolling',
    },
    include: {
      poc: true,
      sponsor: true,
    },
  });

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'ROLLING_15_DAYS',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'rolling15Days',
    );

    if (!pocPreference) continue;

    const submissionCount = await prisma.submission.count({
      where: {
        listingId: listing.id,
      },
    });

    const emailHtml = render(
      Rolling15DaysTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        sponsorName: listing.sponsor.name,
        applicationNumber: submissionCount,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'ROLLING_15_DAYS',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: kashEmail,
      to: listing.poc.email,
      subject: '15 days since adding the listing',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}