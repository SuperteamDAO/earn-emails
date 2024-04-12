import { prisma } from '../../utils/prisma';
import { kashEmail } from '../../constants/kashEmail';
import { DeadlineExtendedTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';

export async function processDeadlineExtended(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: {
      id,
    },
  });

  const submissions = await prisma.submission.findMany({
    where: {
      listingId: id,
      isActive: true,
      isArchived: false,
    },
    take: 500,
    include: {
      user: true,
    },
  });

  const allSubmissionUsers = submissions?.map((submission) => ({
    email: submission?.user?.email || '',
    name: submission?.user?.firstName || '',
  }));

  const subscribers = await prisma.subscribeBounty.findMany({
    where: {
      bountyId: id,
    },
    include: {
      User: true,
    },
  });

  const allSubscribedUsers = subscribers?.map((subscriber) => ({
    email: subscriber?.User?.email || '',
    name: subscriber?.User?.firstName || '',
  }));

  const allUsers = [...allSubmissionUsers, ...allSubscribedUsers];

  if (listing) {
    const emails: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }[] = allUsers.map((user) => {
      const emailHtml = render(
        DeadlineExtendedTemplate({
          listingName: listing.title,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/`,
        }),
      );
      return {
        from: kashEmail,
        to: user.email,
        subject: 'Listing Deadline Extended!',
        html: emailHtml,
      };
    });

    return emails;
  }

  return;
}
