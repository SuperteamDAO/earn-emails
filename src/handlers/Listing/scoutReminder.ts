import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath } from '../../constants/basePath';
import { kashEmail } from '../../constants/emails';
import { ScoutReminderTemplate } from '../../email-templates/Listing/scoutReminderTemplate';
import { prisma } from '../../prisma';

export async function processScoutReminder() {
  const now = dayjs();
  const threeDaysAgo = now.subtract(3, 'days');
  try {
    const listings = await prisma.bounties.findMany({
      where: {
        publishedAt: {
          lte: threeDaysAgo.endOf('day').toDate(),
          gte: threeDaysAgo.startOf('day').toDate(),
        },
        isPublished: true,
        isPrivate: false,
        isActive: true,
        isArchived: false,
        status: 'OPEN',
        sponsor: {
          isVerified: true,
        },
        OR: [
          {
            usdValue: {
              gte: 500,
            },
          },
          {
            compensationType: 'variable',
          },
        ],
      },
      select: {
        id: true,
        pocId: true,
        title: true,
        type: true,
        slug: true,
        poc: {
          select: {
            email: true,
            firstName: true,
          },
        },
        Scouts: {
          select: {
            dollarsEarned: true,
          },
        },
        _count: {
          select: {
            Scouts: {
              where: {
                invited: true,
              },
            },
          },
        },
      },
    });

    const filteredListings = listings.filter((listing) => {
      return listing._count.Scouts < listing.Scouts.length;
    });

    const emailPromises = filteredListings.map(async (listing) => {
      const totalMatchedUSD = listing.Scouts.reduce(
        (total, scout) => total + scout.dollarsEarned,
        0,
      );

      const emailHtml = await render(
        ScoutReminderTemplate({
          name: listing.poc.firstName || '',
          link: `${basePath}/dashboard/listings/${listing.slug}/submissions/?scout=1&utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
          listingName: listing.title,
          type: listing.type,
          invitesLeft: listing.Scouts.length - listing._count.Scouts,
          totalMatchedUSD,
        }),
      );

      return {
        from: kashEmail,
        to: listing.poc.email,
        subject: `Do you want better ${listing.type === 'project' ? 'applications' : 'submissions'} for your ${listing.type}?`,
        html: emailHtml,
      };
    });

    const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
    return emailsToSend;
  } catch (error) {
    console.error('Error in processScoutReminder:', error);
    throw error;
  }
}
