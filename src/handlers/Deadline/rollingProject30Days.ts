import { prisma } from '../../prisma';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getUserEmailPreference } from '../../utils';
import { kashEmail } from '../../constants';
import { Rolling30DaysTemplate } from '../../email-templates';

export async function processRollingProject30Days() {
  dayjs.extend(utc);

  const thirtyDaysAgoStart = dayjs.utc().subtract(30, 'day').startOf('day');
  const thirtyDaysAgoEnd = dayjs.utc().subtract(30, 'day').endOf('day');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      publishedAt: {
        gte: thirtyDaysAgoStart.toISOString(),
        lt: thirtyDaysAgoEnd.toISOString(),
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
        type: 'ROLLING_30_DAYS',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'rolling30Days',
    );

    if (!pocPreference) continue;

    const submissionCount = await prisma.submission.count({
      where: {
        listingId: listing.id,
      },
    });

    if (submissionCount === 0) continue;

    const emailHtml = render(
      Rolling30DaysTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        sponsorName: listing.sponsor.name,
        applicationNumber: submissionCount,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'ROLLING_30_DAYS',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: kashEmail,
      to: listing.poc.email,
      subject: 'Good Time to Announce the Winner?',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
