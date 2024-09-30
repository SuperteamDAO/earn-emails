import { render } from '@react-email/render';
import { SubmissionLikeTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { basePath, kashEmail } from '../../constants';
import dayjs from 'dayjs';

export async function processSubmissionLike(id: string, userId: string) {
  const now = dayjs();
  const twentyFourHoursAgo = now.subtract(24, 'hours');
  const twentyFourHoursAgoEpoch = twentyFourHoursAgo.valueOf();

  const submissions = await prisma.submission.findMany({
    where: {
      likeCount: {
        gt: 0
      },
      updatedAt: {
        gte: twentyFourHoursAgo.toDate()
      }
    },
    select: {
      userId: true,
      like: true,
      likeCount: true,
      user: {
        select: {
          firstName: true,
          email: true
        }
      },
      listing: {
        select: {
          title: true
        }
      }
    }
  });

  console.log('submissions', submissions);

  const emailPromises = submissions.map(async (submission) => {
    const userPreference = await getUserEmailPreference(submission.userId, 'submissionLike');
    if (!userPreference) {
      console.log(`User ${submission.userId} has opted out of this type of email.`);
      return null;
    }

    const likes = (submission.like as Array<{ date: number }> | null) || []
    const newLikesCount = likes.filter((like: { date: number }) =>
      like.date >= twentyFourHoursAgoEpoch
    ).length;

    console.log('new like count - ', newLikesCount)
    if (newLikesCount === 0) return null;

    const emailHtml = render(
      SubmissionLikeTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        newLikesCount,
        link: `${basePath}/feed?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      })
    );

    return {
      from: kashEmail,
      to: submission.user.email,
      subject: `${newLikesCount} New ${newLikesCount === 1 ? 'Like' : 'Likes'} on Your Superteam Earn Submission!`,
      html: emailHtml,
    };
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
  return emailsToSend;
}
