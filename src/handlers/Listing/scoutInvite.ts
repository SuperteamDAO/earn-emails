import { render } from '@react-email/render';

import { basePath, kashEmail } from '../../constants';
import { ScoutInviteTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';

export async function processScoutInvite(id: string, userId: string) {
  try {
    console.log('scout');
    const userPreference = await getUserEmailPreference(userId, 'scoutInvite');

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

    const emailHtml = await render(
      ScoutInviteTemplate({
        name: user.firstName!,
        listingName: listing.title,
        sponsorName: listing.sponsor.name,
        link: `${basePath}/listings/${listing.type}/${listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
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
  } catch (error) {
    console.error('Error in processScoutInvite:', error);
    throw error;
  }
}
