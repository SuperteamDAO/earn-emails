import { render } from '@react-email/render';
import { SubmissionRejectedTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { basePath, kashEmail } from '../../constants';

export async function processSubmissionRejected(id: string) {

  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      user: true,
      listing: {
        include: {
          sponsor: true,
        }
      },
    },
  });

  if (submission) {
    const emailHtml = render(
      SubmissionRejectedTemplate({
        name: submission.user.firstName!,
        listingName: submission.listing.title,
        link: `${basePath}/listings/${submission.listing.type}/${submission.listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );
    const emailData = {
      from: kashEmail,
      to: submission?.user.email,
      subject: `About your recent application to ${submission.listing.sponsor.name}'s gig`,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
