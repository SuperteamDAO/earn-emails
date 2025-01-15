import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { SubmissionSponsorTemplate } from '../../email-templates/Submission/submissionSponsorTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

export async function processSponsorSubmissions() {
  console.log('subspo');
  const now = dayjs();
  const twentyFourHoursAgo = now.subtract(24, 'hours');

  const listings = await prisma.bounties.findMany({
    where: {
      type: { not: 'hackathon' },
      isPublished: true,
      isArchived: false,
      isActive: true,
      status: 'OPEN',
      isPrivate: false,
      isWinnersAnnounced: false,
      Submission: {
        some: {
          createdAt: {
            gte: twentyFourHoursAgo.toDate(),
          },
        },
      },
    },
    include: {
      poc: true,
      Submission: {
        where: {
          createdAt: {
            gte: twentyFourHoursAgo.toDate(),
          },
        },
      },
    },
  });

  console.log(listings);

  const emailPromises = listings.map(async (listing) => {
    const userPreference = await getUserEmailPreference(
      listing.pocId,
      'submissionSponsor',
    );

    if (!userPreference) {
      console.log(`User ${listing.pocId} has opted out of this type of email.`);
      return null;
    }

    const submissionCount = listing.Submission.length;

    if (submissionCount > 0) {
      const subject =
        listing.type !== 'project'
          ? `Your Bounty Received ${submissionCount} submissions in the last 24H`
          : `Your Project received ${submissionCount} applications in the last 24H`;
      const pocUser = listing.poc;

      const emailHtml = await render(
        SubmissionSponsorTemplate({
          name: pocUser.firstName!,
          listingName: listing.title,
          link: `${basePath}/dashboard/listings/${listing.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
          submissionCount: submissionCount,
          listingLink: `${basePath}/listing/${listing.slug}`,
          listingType: listing.type,
        }),
      );

      const emailData = {
        from: pratikEmail,
        to: pocUser.email,
        subject,
        html: emailHtml,
      };

      return emailData;
    }

    return null;
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(
    (email) => email !== null,
  );

  return emailsToSend;
}
