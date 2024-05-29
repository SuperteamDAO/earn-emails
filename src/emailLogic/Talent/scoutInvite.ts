import { render } from '@react-email/render';
import { kashEmail } from '../../constants/kashEmail';
import { prisma } from '../../utils/prisma';
import { ScoutInviteTemplate } from '../../emailTemplates/Listing/scoutInviteTemplate';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processScoutInvite(id: string, userId: string) {
  const category = getCategoryFromEmailType('scoutInvitation');

  const userPreference = await prisma.emailSettings.findFirst({
    where: {
      userId: userId,
      category,
    },
  });

  if (userPreference) {
    const listing = await prisma.bounties.findFirst({
      where: { id },
      include: { sponsor: true, poc: true },
    });

    const user = await prisma.user.findFirst({
      where: { id: userId as string },
    });

    if (listing && user) {
      const emailHtml = render(
        ScoutInviteTemplate({
          name: user.firstName!,
          listingName: listing.title,
          sponsorName: listing.sponsor.name,
          link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
        }),
      );

      const emailData = {
        from: kashEmail,
        to: user.email,
        subject: `${listing.sponsor.name} Wants You to Submit to Their Latest Listing`,
        html: emailHtml,
        cc: listing.poc.email,
      };
      return emailData;
    }
  }

  return;
}
