import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { SpamAppealApprovedTemplate } from '../../email-templates/Submission/SpamAppealApprovedTemplate';
import { SpamAppealRejectedTemplate } from '../../email-templates/Submission/SpamAppealRejectedTemplate';
import { prisma } from '../../prisma';

export async function processSpamDecision(
  id: string,
  otherInfo?: {
    listingType: 'listing' | 'grant';
    decision: 'Approved' | 'Rejected';
  },
) {
  let submission;
  let listingLink;
  let listingName;
  let submissionType;

  console.log('id', id);
  console.log('otherInfo', otherInfo);

  if (otherInfo?.listingType === 'listing') {
    submission = await prisma.submission.findUnique({
      where: { id },
      include: { user: true, listing: true },
    });

    console.log('submission', submission);

    if (!submission) {
      console.log('no submission');
      return;
    }

    listingLink = `${basePath}/listing/${submission.listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;
    listingName = submission.listing.title;

    console.log('listingLink', listingLink);
    console.log('listingName', listingName);

    if (submission?.listing.type === 'project') {
      submissionType = 'application';
    } else {
      submissionType = 'submission';
    }
  } else if (otherInfo?.listingType === 'grant') {
    submission = await prisma.grantApplication.findUnique({
      where: { id },
      include: { user: true, grant: true },
    });

    if (!submission) {
      return;
    }

    listingLink = `${basePath}/listings/grants/${submission.grant.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;
    listingName = submission.grant.title;

    submissionType = 'application';
  }

  if (!submission) {
    return;
  }

  if (otherInfo?.decision === 'Approved') {
    const emailHtml = await render(
      SpamAppealApprovedTemplate({
        name: submission.user.firstName || 'there',
        submissionType: submissionType as 'submission' | 'application',
        listingName: listingName || '',
        listingLink: listingLink || '',
      }),
    );

    return {
      from: pratikEmail,
      to: submission.user.email,
      subject: 'Spam Dispute: Your credit has been refunded',
      html: emailHtml,
      checkUnsubscribe: false,
    };
  } else if (otherInfo?.decision === 'Rejected') {
    const emailHtml = await render(
      SpamAppealRejectedTemplate({
        name: submission.user.firstName || 'there',
        submissionType: submissionType as 'submission' | 'application',
        listingName: listingName || '',
        listingLink: listingLink || '',
      }),
    );

    return {
      from: pratikEmail,
      to: submission.user.email,
      subject: 'About your recentSpam Dispute',
      html: emailHtml,
      checkUnsubscribe: false,
    };
  }
}
