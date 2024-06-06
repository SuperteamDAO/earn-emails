import { render } from '@react-email/render';
import { prisma } from '../../utils/prisma';
import { ScoutInviteTemplate } from '../../emailTemplates/Listing/scoutInviteTemplate';
import { getCategoryFromEmailType } from '../../utils/getCategoryFromEmailType';

export async function processScoutInvite(id: string, userId: string) {
  const category = getCategoryFromEmailType('scoutInvite');

  try {
    const userPreference = await prisma.emailSettings.findFirst({
      where: {
        userId,
        category,
      },
    });

    if (!userPreference) {
      console.log(`User ${userId} has opted out of this type of email.`);
      return null;
    }

    const listing = await prisma.bounties.findFirst({
      where: { id },
      include: { sponsor: true, poc: true },
    });

    if (!listing) {
      console.error(`No listing found with the provided ID: ${id}`);
      return null;
    }

    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      console.error(`No user found with the provided ID: ${userId}`);
      return null;
    }

    const emailHtml = render(
      ScoutInviteTemplate({
        name: user.firstName!,
        listingName: listing.title,
        sponsorName: listing.sponsor.name,
        link: `https://earn.superteam.fun/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      to: user.email,
      subject: `${listing.sponsor.name} Wants You to Submit to Their Latest Listing`,
      html: emailHtml,
      cc: listing.poc.email,
    };
    return emailData;
  } catch (error) {
    console.error('Error in processScoutInvite:', error);
    throw error;
  }
}