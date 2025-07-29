import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { CommitmentTwoDaysTemplate } from '../../email-templates/Deadline/commitment2daysTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processCommitmentTwoDays() {
  dayjs.extend(utc);

  const twoDaysFromNowStart = dayjs.utc().add(2, 'day').startOf('day');
  const twoDaysFromNowEnd = dayjs.utc().add(2, 'day').endOf('day');

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      commitmentDate: {
        gte: twoDaysFromNowStart.toISOString(),
        lt: twoDaysFromNowEnd.toISOString(),
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_COMMITMENT_2DAYS',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'commitment2days',
    );

    if (!pocPreference) continue;

    // Get listing type for subject line
    const listingType = listing.type || 'bounty';

    const emailHtml = await render(
      CommitmentTwoDaysTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        telegramLink: 'https://t.me/pratikdholani/',
        link: `${basePath}/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_COMMITMENT_2DAYS',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: pratikEmail,
      to: listing.poc.email,
      bcc: ['pratikd.earnings@gmail.com'],
      subject: `Reminder: 2 Days Left to Announce ${listingType.charAt(0).toUpperCase() + listingType.slice(1)} Winners`,
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
