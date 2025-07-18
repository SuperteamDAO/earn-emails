import { processApplication } from '../handlers/Application/application';
import { processApplicationApproval } from '../handlers/Application/applicationApproved';
import { processApplicationCompleted } from '../handlers/Application/applicationCompleted';
import { processApplicationLike } from '../handlers/Application/applicationLike';
import { processApplicationRejection } from '../handlers/Application/applicationRejected';
import { processGrantPayment } from '../handlers/Application/grantPaymentReceived';
import { processTrancheApproved } from '../handlers/Application/trancheApproved';
import { processTrancheRejection } from '../handlers/Application/trancheRejected';
import { processCommentActivity } from '../handlers/Comment/commentActivity';
import { processCommentReply } from '../handlers/Comment/commentReply';
import { processCommentSponsor } from '../handlers/Comment/commentSponsor';
import { processCommentTag } from '../handlers/Comment/commentTag';
import { processDeadlineThreeDays } from '../handlers/Deadline/deadline3days';
import { processDeadlineExceeded } from '../handlers/Deadline/deadlineExceeded';
import { processDeadlineExceededWeek } from '../handlers/Deadline/deadlineExceededWeek';
import { processDeadlineExtended } from '../handlers/Deadline/deadlineExtended';
import { processFeatureAnnouncement } from '../handlers/featureAnnouncement';
import { processLeadWeeklyReminder } from '../handlers/Grants/leadWeeklyReminder';
import { processCreateHackathon } from '../handlers/Listing/createHackathon';
import { processCreateListing } from '../handlers/Listing/createListing';
import { processScoutInvite } from '../handlers/Listing/scoutInvite';
import { processScoutReminder } from '../handlers/Listing/scoutReminder';
import { processTalentReminder } from '../handlers/Listing/talentReminder';
import { processVerifiedStatus } from '../handlers/Listing/verfiedStatus';
import { processWeeklyRoundup } from '../handlers/Listing/weeklyListingRoundup';
import { processPoWLike } from '../handlers/PoW/powLike';
import { processSpamDecision } from '../handlers/Submission/spamDecision';
import { processSubmissionLike } from '../handlers/Submission/submissionLike';
import { processSubmissionRejected } from '../handlers/Submission/submissionRejected';
import { processSponsorSubmissions } from '../handlers/Submission/submissionSponsor';
import { processTalentSubmission } from '../handlers/Submission/submissionTalent';
import { processAddPayment } from '../handlers/Winners/addPayment';
import { processAnnounceWinners } from '../handlers/Winners/announceWinners';
import { processNonSTWinners } from '../handlers/Winners/nonSTWinners';
import { processSpamCredit } from '../handlers/Winners/spamCredit';
import { processSTWinners } from '../handlers/Winners/STWinners';
import { type EmailActionType } from '../types/EmailActionType';

export const emailActionCategoryMapping = {
  // talent emails
  createListing: 'createListing',
  commentActivity: 'commentOrLikeSubmission',
  commentReply: 'replyOrTagComment',
  commentTag: 'replyOrTagComment',
  submissionLike: 'commentOrLikeSubmission',
  applicationLike: 'commentOrLikeSubmission',
  powLike: 'commentOrLikeSubmission',
  weeklyListingRoundup: 'weeklyListingRoundup',
  scoutInvite: 'scoutInvite',
  featureAnnouncement: 'productAndNewsletter',

  // sponsor emails
  commentSponsor: 'commentSponsor',
  submissionSponsor: 'submissionSponsor',
  application: 'submissionSponsor',
  deadlineExceeded: 'deadlineSponsor',
  deadlineExceededWeek: 'deadlineSponsor',
} as const;

export const emailTypePriority: Record<EmailActionType, number> = {
  submissionTalent: 1,
  application: 1,
  commentReply: 1,
  commentSponsor: 1,
  commentTag: 1,
  scoutInvite: 1,
  verifiedListingStatus: 1,
  scoutReminder: 2,
  submissionSponsor: 2,
  announceWinners: 2,
  STWinners: 2,
  nonSTWinners: 2,
  addPayment: 2,
  grantPaymentReceived: 2,
  commentActivity: 2,
  submissionLike: 2,
  submissionRejected: 2,
  applicationLike: 2,
  deadlineExceededWeek: 2,
  deadlineExceeded: 2,
  deadlineExtended: 2,
  grantCompleted: 2,
  grantApproved: 2,
  trancheApproved: 2,
  trancheRejected: 2,
  grantRejected: 2,
  deadline3days: 3,
  createListing: 4,
  createHackathon: 1,
  weeklyListingRoundup: 5,
  talentReminder: 6,
  leadWeeklyReminder: 3,
  powLike: 2,
  spamCredit: 2,
  featureAnnouncement: 3,
  spamDecision: 2,
  // dupe: 1,
};

export const emailProcessors: Record<EmailActionType, any> = {
  addPayment: processAddPayment,
  announceWinners: processAnnounceWinners,
  application: processApplication,
  commentReply: processCommentReply,
  commentSponsor: processCommentSponsor,
  commentActivity: processCommentActivity,
  commentTag: processCommentTag,
  createListing: processCreateListing,
  createHackathon: processCreateHackathon,
  deadline3days: processDeadlineThreeDays,
  deadlineExceeded: processDeadlineExceeded,
  deadlineExceededWeek: processDeadlineExceededWeek,
  deadlineExtended: processDeadlineExtended,
  grantApproved: processApplicationApproval,
  grantCompleted: processApplicationCompleted,
  grantPaymentReceived: processGrantPayment,
  grantRejected: processApplicationRejection,
  leadWeeklyReminder: processLeadWeeklyReminder,
  trancheApproved: processTrancheApproved,
  trancheRejected: processTrancheRejection,
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
  talentReminder: processTalentReminder,
  verifiedListingStatus: processVerifiedStatus,
  powLike: processPoWLike,
  spamCredit: processSpamCredit,
  featureAnnouncement: processFeatureAnnouncement,
  spamDecision: processSpamDecision,
  // dupe: processDupe,
};
