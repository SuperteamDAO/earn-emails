import { type BountyType } from '@prisma/client';
import { render } from '@react-email/render';
import dayjs from 'dayjs';

import { basePath } from '../../constants';
import { kashEmail } from '../../constants/emails';
import { SubmissionLikeTemplate } from '../../email-templates/Submission/submissionLikeTemplate';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils/getUserEmailPreference';

function createFeedCardCopy(type: BountyType, isWinnersAnnounced: boolean) {
  const status = isWinnersAnnounced
    ? 'Win'
    : type === 'project'
      ? 'Application'
      : 'Submission';
  const prefix =
    type === 'project' ? 'Project' : type === 'bounty' ? 'Bounty' : 'Hackathon';
  return `${prefix} ${status}`;
}

export async function processSubmissionLike() {
  const now = dayjs();
  const twentyFourHoursAgo = now.subtract(24, 'hours');
  const twentyFourHoursAgoEpoch = twentyFourHoursAgo.valueOf();

  const submissions = await prisma.submission.findMany({
    where: {
      likeCount: {
        gt: 0,
      },
      updatedAt: {
        gte: twentyFourHoursAgo.toDate(),
      },
    },
    select: {
      userId: true,
      like: true,
      likeCount: true,
      isWinner: true,
      user: {
        select: {
          firstName: true,
          email: true,
        },
      },
      listing: {
        select: {
          title: true,
          isWinnersAnnounced: true,
          type: true,
          slug: true,
        },
      },
    },
  });

  const emailPromises = submissions.map(async (submission) => {
    const userPreference = await getUserEmailPreference(
      submission.userId,
      'submissionLike',
    );
    if (!userPreference) {
      console.log(
        `User ${submission.userId} has opted out of this type of email.`,
      );
      return null;
    }

    const likes = (submission.like as Array<{ date: number }> | null) || [];
    const newLikesCount = likes.filter(
      (like: { date: number }) => like.date >= twentyFourHoursAgoEpoch,
    ).length;

    if (newLikesCount === 0) return null;

    const type = createFeedCardCopy(
      submission.listing.type,
      submission.listing.isWinnersAnnounced,
    );

    const emailHtml = await render(
      SubmissionLikeTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        newLikesCount,
        type,
        listingLink: `${basePath}/listings/${submission.listing.type}/${submission.listing.slug}/submission/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        feedLink: `${basePath}/feed?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    return {
      from: kashEmail,
      to: submission.user.email,
      subject: `${newLikesCount} New ${newLikesCount === 1 ? 'Like' : 'Likes'} on Your ${type}`,
      html: emailHtml,
    };
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
  return emailsToSend;
}
