import { render } from '@react-email/render';
import { SubmissionSponsorTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { kashEmail } from '../../constants';

export async function processSponsorSubmission(id: string, userId: string) {
  const userPreference = await getUserEmailPreference(
    userId,
    'submissionSponsor',
  );

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: {
      poc: true,
    },
  });

  if (listing && listing?.type !== 'hackathon') {
    const subject =
      listing.type !== 'project'
        ? 'New Bounty Submission Received'
        : 'Project Application Received';
    const pocUser = listing?.poc;

    const emailHtml = render(
      SubmissionSponsorTemplate({
        name: pocUser.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: pocUser.email,
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
