import { render } from '@react-email/render';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { SpamAppealApprovedTemplate } from '../../email-templates/Submission/SpamAppealApprovedTemplate';
import { SpamAppealRejectedTemplate } from '../../email-templates/Submission/SpamAppealRejectedTemplate';
import { prisma } from '../../prisma';
import { logError, logInfo } from '../../utils/logger';

export async function processSpamDecision(
  id: string,
  otherInfo?: {
    listingType: 'listing' | 'grant';
    decision: 'Approved' | 'Rejected';
  },
) {
  await logInfo('processSpamDecision: Function started', {
    id,
    otherInfo,
    function: 'processSpamDecision',
  });

  let submission;
  let listingLink;
  let listingName;
  let submissionType;

  await logInfo('processSpamDecision: Checking listing type', {
    listingType: otherInfo?.listingType,
    function: 'processSpamDecision',
  });

  if (otherInfo?.listingType === 'listing') {
    await logInfo('processSpamDecision: Processing listing type submission', {
      id,
      function: 'processSpamDecision',
    });

    try {
      submission = await prisma.submission.findUnique({
        where: { id },
        include: { user: true, listing: true },
      });

      await logInfo('processSpamDecision: Submission query completed', {
        submissionFound: !!submission,
        submissionId: submission?.id,
        userId: submission?.user?.id,
        listingId: submission?.listing?.id,
        function: 'processSpamDecision',
      });
    } catch (error) {
      await logError(error as Error, {
        context: 'Failed to fetch submission',
        id,
        function: 'processSpamDecision',
      });
      throw error;
    }

    if (!submission) {
      await logInfo(
        'processSpamDecision: No submission found, returning early',
        {
          id,
          function: 'processSpamDecision',
        },
      );
      return;
    }

    listingLink = `${basePath}/listing/${submission.listing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;
    listingName = submission.listing.title;

    await logInfo('processSpamDecision: Determining submission type', {
      listingType: submission?.listing.type,
      function: 'processSpamDecision',
    });

    if (submission?.listing.type === 'project') {
      submissionType = 'application';
      await logInfo('processSpamDecision: Set submission type to application', {
        function: 'processSpamDecision',
      });
    } else {
      submissionType = 'submission';
      await logInfo('processSpamDecision: Set submission type to submission', {
        function: 'processSpamDecision',
      });
    }

    await logInfo('processSpamDecision: Listing processing completed', {
      listingLink,
      listingName,
      submissionType,
      function: 'processSpamDecision',
    });
  } else if (otherInfo?.listingType === 'grant') {
    await logInfo('processSpamDecision: Processing grant type submission', {
      id,
      function: 'processSpamDecision',
    });

    try {
      submission = await prisma.grantApplication.findUnique({
        where: { id },
        include: { user: true, grant: true },
      });

      await logInfo('processSpamDecision: Grant application query completed', {
        submissionFound: !!submission,
        submissionId: submission?.id,
        userId: submission?.user?.id,
        grantId: submission?.grant?.id,
        function: 'processSpamDecision',
      });
    } catch (error) {
      await logError(error as Error, {
        context: 'Failed to fetch grant application',
        id,
        function: 'processSpamDecision',
      });
      throw error;
    }

    if (!submission) {
      await logInfo(
        'processSpamDecision: No grant application found, returning early',
        {
          id,
          function: 'processSpamDecision',
        },
      );
      return;
    }

    listingLink = `${basePath}/listings/grants/${submission.grant.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;
    listingName = submission.grant.title;
    submissionType = 'application';

    await logInfo('processSpamDecision: Grant processing completed', {
      listingLink,
      listingName,
      submissionType,
      function: 'processSpamDecision',
    });
  }

  if (!submission) {
    await logInfo(
      'processSpamDecision: No submission found after processing, returning early',
      {
        id,
        otherInfo,
        function: 'processSpamDecision',
      },
    );
    return;
  }

  await logInfo('processSpamDecision: Processing decision', {
    decision: otherInfo?.decision,
    submissionType,
    userEmail: submission.user.email,
    userName: submission.user.firstName,
    function: 'processSpamDecision',
  });

  if (otherInfo?.decision === 'Approved') {
    await logInfo('processSpamDecision: Processing approved spam appeal', {
      submissionType,
      listingName,
      function: 'processSpamDecision',
    });

    try {
      const emailHtml = await render(
        SpamAppealApprovedTemplate({
          name: submission.user.firstName || 'there',
          submissionType: submissionType as 'submission' | 'application',
          listingName: listingName || '',
          listingLink: listingLink || '',
        }),
      );

      await logInfo(
        'processSpamDecision: Approved email template rendered successfully',
        {
          templateParams: {
            name: submission.user.firstName || 'there',
            submissionType,
            listingName: listingName || '',
            listingLink: listingLink || '',
          },
          function: 'processSpamDecision',
        },
      );

      const emailData = {
        from: pratikEmail,
        to: submission.user.email,
        subject: 'Spam Dispute: Your credit has been refunded',
        html: emailHtml,
        checkUnsubscribe: false,
      };

      await logInfo('processSpamDecision: Returning approved email data', {
        emailData: {
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          checkUnsubscribe: emailData.checkUnsubscribe,
        },
        function: 'processSpamDecision',
      });

      return emailData;
    } catch (error) {
      await logError(error as Error, {
        context: 'Failed to render approved email template',
        submissionType,
        listingName,
        function: 'processSpamDecision',
      });
      throw error;
    }
  } else if (otherInfo?.decision === 'Rejected') {
    await logInfo('processSpamDecision: Processing rejected spam appeal', {
      submissionType,
      listingName,
      function: 'processSpamDecision',
    });

    try {
      const emailHtml = await render(
        SpamAppealRejectedTemplate({
          name: submission.user.firstName || 'there',
          submissionType: submissionType as 'submission' | 'application',
          listingName: listingName || '',
          listingLink: listingLink || '',
        }),
      );

      await logInfo(
        'processSpamDecision: Rejected email template rendered successfully',
        {
          templateParams: {
            name: submission.user.firstName || 'there',
            submissionType,
            listingName: listingName || '',
            listingLink: listingLink || '',
          },
          function: 'processSpamDecision',
        },
      );

      const emailData = {
        from: pratikEmail,
        to: submission.user.email,
        subject: 'About your recentSpam Dispute',
        html: emailHtml,
        checkUnsubscribe: false,
      };

      await logInfo('processSpamDecision: Returning rejected email data', {
        emailData: {
          from: emailData.from,
          to: emailData.to,
          subject: emailData.subject,
          checkUnsubscribe: emailData.checkUnsubscribe,
        },
        function: 'processSpamDecision',
      });

      return emailData;
    } catch (error) {
      await logError(error as Error, {
        context: 'Failed to render rejected email template',
        submissionType,
        listingName,
        function: 'processSpamDecision',
      });
      throw error;
    }
  }

  await logInfo(
    'processSpamDecision: No decision processed, function ending without return',
    {
      decision: otherInfo?.decision,
      function: 'processSpamDecision',
    },
  );
}
