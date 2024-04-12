import { prisma } from '../../utils/prisma';
import { kashEmail } from '../../constants/kashEmail';
import { WinnersAnnouncedTemplate } from '../../emailTemplates';
import { render } from '@react-email/render';
import { getListingTypeLabel } from '../../utils/getListingTypeLabel';

export async function processAnnounceWinners(id: string) {
  const listing = await prisma.bounties.findUnique({
    where: {
      id,
    },
  });

  if (listing) {
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

    const listingTypeLabel = getListingTypeLabel(listing.type);

    const emails: {
      from: string;
      to: string;
      subject: string;
      html: string;
    }[] = allUsers.map((user) => {
      const emailHtml = render(
        WinnersAnnouncedTemplate({
          name: user.name,
          listingName: listing?.title || '',
          link: `https://earn.superteam.fun/listings/${listing?.type}/${
            listing?.slug || ''
          }/?utm_source=superteamearn&utm_medium=email&utm_campaign=winnerannouncement`,
        }),
      );
      return {
        from: kashEmail,
        to: user.email,
        subject: `${listingTypeLabel} Winners Announced!`,
        html: emailHtml,
      };
    });

    return emails;
  }

  return;
}
