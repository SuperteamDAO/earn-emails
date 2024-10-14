import {
  processAddPayment,
  processAnnounceWinners,
  processApplication,
  processApplicationApproval,
  processApplicationRejection,
  processCommentReply,
  processCommentSponsor,
  processCommentSubmission,
  processCommentTag,
  processCreateListing,
  processDeadlineExceeded,
  processDeadlineExceededWeek,
  processDeadlineExtended,
  processDeadlineThreeDays,
  processRollingProject15Days,
  processRollingProject30Days,
  processGrantPayment,
  processScoutInvite,
  processSubmissionLike,
  processSubmissionRejected,
  processSTWinners,
  processNonSTWinners,
  processTalentSubmission,
  processWeeklyRoundup,
  processApplicationLike,
  processRollingProjectUnpublish,
  processSponsorSubmissions,
  processVerifiedStatus,
  processApplicationCompleted,
  processPoWLike,
  processScoutReminder,
} from '../handlers';
import { EmailActionType } from '../types';

export const emailActionCategoryMapping = {
  // talent emails
  createListing: 'createListing',
  commentSubmission: 'commentOrLikeSubmission',
  commentReply: 'replyOrTagComment',
  commentTag: 'replyOrTagComment',
  submissionLike: 'commentOrLikeSubmission',
  applicationLike: 'commentOrLikeSubmission',
  powLike: 'commentOrLikeSubmission',
  weeklyListingRoundup: 'weeklyListingRoundup',
  scoutInvite: 'scoutInvite',

  // sponsor emails
  commentSponsor: 'commentSponsor',
  submissionSponsor: 'submissionSponsor',
  application: 'submissionSponsor',
  deadlineExceeded: 'deadlineSponsor',
  deadlineExceededWeek: 'deadlineSponsor',
  rolling15Days: 'deadlineSponsor',
  rolling30Days: 'deadlineSponsor',
  rollingUnpublish: 'deadlineSponsor',
} as const;

export const emailTypePriority: Record<EmailActionType, number> = {
  submissionTalent: 1,
  application: 1,
  commentReply: 1,
  commentSponsor: 1,
  commentTag: 1,
  scoutInvite: 1,
  rollingUnpublish: 1,
  verifiedListingStatus: 1,
  scoutReminder: 2,
  submissionSponsor: 2,
  announceWinners: 2,
  STWinners: 2,
  nonSTWinners: 2,
  addPayment: 2,
  grantPaymentReceived: 2,
  commentSubmission: 2,
  submissionLike: 2,
  submissionRejected: 2,
  applicationLike: 2,
  deadlineExceededWeek: 2,
  deadlineExceeded: 2,
  deadlineExtended: 2,
  grantCompleted: 2,
  grantApproved: 2,
  grantRejected: 2,
  rolling15Days: 2,
  rolling30Days: 2,
  deadline3days: 3,
  createListing: 4,
  weeklyListingRoundup: 5,
  powLike: 2,
  // dupe: 1,
};

export const emailProcessors: Record<EmailActionType, Function> = {
  addPayment: processAddPayment,
  announceWinners: processAnnounceWinners,
  application: processApplication,
  commentReply: processCommentReply,
  commentSponsor: processCommentSponsor,
  commentSubmission: processCommentSubmission,
  commentTag: processCommentTag,
  createListing: processCreateListing,
  deadline3days: processDeadlineThreeDays,
  deadlineExceeded: processDeadlineExceeded,
  deadlineExceededWeek: processDeadlineExceededWeek,
  deadlineExtended: processDeadlineExtended,
  grantApproved: processApplicationApproval,
  grantCompleted: processApplicationCompleted,
  grantPaymentReceived: processGrantPayment,
  grantRejected: processApplicationRejection,
  rolling15Days: processRollingProject15Days,
  rolling30Days: processRollingProject30Days,
  rollingUnpublish: processRollingProjectUnpublish,
  scoutInvite: processScoutInvite,
  scoutReminder: processScoutReminder,
  submissionLike: processSubmissionLike,
  submissionRejected: processSubmissionRejected,
  applicationLike: processApplicationLike,
  submissionSponsor: processSponsorSubmissions,
  submissionTalent: processTalentSubmission,
  STWinners: processSTWinners,
  nonSTWinners: processNonSTWinners,
  weeklyListingRoundup: processWeeklyRoundup,
  verifiedListingStatus: processVerifiedStatus,
  powLike: processPoWLike,
  // dupe: processDupe,
};
