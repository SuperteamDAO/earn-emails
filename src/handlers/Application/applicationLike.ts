import { render } from '@react-email/render';
import { ApplicationLikeTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { basePath, kashEmail } from '../../constants';
import dayjs from 'dayjs';

export async function processApplicationLike() {
  const now = dayjs();
  // const twentyFourHoursAgo = now.subtract(24, 'hours');
  const twentyFourHoursAgo = now.subtract(2, 'minutes');
  const twentyFourHoursAgoEpoch = twentyFourHoursAgo.valueOf();

  const applications = await prisma.grantApplication.findMany({
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
      grant: {
        select: {
          title: true,
          slug: true
        }
      }
    },
  });

  const emailPromises = applications.map(async (application) => {
    const userPreference = await getUserEmailPreference(application.userId, 'applicationLike');
    if (!userPreference) {
      console.log(`User ${application.userId} has opted out of this type of email.`);
      return null;
    }

    const likes = (application.like as Array<{ date: number }> | null) || []
    const newLikesCount = likes.filter((like: { date: number }) =>
      like.date >= twentyFourHoursAgoEpoch
    ).length;

    if (newLikesCount === 0) return null;

    const emailHtml = render(
      ApplicationLikeTemplate({
        name: application.user.firstName!,
        grantName: application.grant.title,
        newLikesCount,
        grantLink: `${basePath}/grants/${application.grant.slug}?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        feedLink: `${basePath}/feed?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      })
    );

    return {
      from: kashEmail,
      to: application.user.email,
      subject: `${newLikesCount} New ${newLikesCount === 1 ? 'Like' : 'Likes'} on Your Grant Win!`,
      html: emailHtml,
    };
  });

  const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);
  return emailsToSend;
}
