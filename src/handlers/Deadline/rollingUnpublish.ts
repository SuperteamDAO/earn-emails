import { prisma } from '../../prisma';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getUserEmailPreference } from '../../utils';
import { basePath, kashEmail } from '../../constants';
import { RollingUnpublishTemplate } from '../../email-templates';

export async function processRollingProjectUnpublish() {
  dayjs.extend(utc);

  const twoMonthsAgoStart = dayjs.utc().subtract(2, 'month').startOf('day');
  const twoMonthsAgoEnd = dayjs.utc().subtract(2, 'month').endOf('day');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      publishedAt: {
        gte: twoMonthsAgoStart.toISOString(),
        lt: twoMonthsAgoEnd.toISOString(),
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
  // console.log('listing IDs', listings.map((l) => l.id))
  await prisma.bounties.updateMany({
    where: {
      id: {
        in: listings.map((l) => l.id),
      }
    },
    data: {
      isPublished: false
    }
  })

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'ROLLING_UNPUBLISH',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'rollingUnpublish',
    );

    if (!pocPreference) continue;

    const emailHtml = render(
      RollingUnpublishTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `${basePath}/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'ROLLING_UNPUBLISH',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: kashEmail,
      to: listing.poc.email,
      subject: 'Unpublishing Your Listing on Earn',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
