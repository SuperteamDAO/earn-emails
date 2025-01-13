export type EmailActionTypeCron =
  | 'deadline3days'
  | 'deadlineExceeded'
  | 'deadlineExceededWeek'
  | 'submissionSponsor'
  | 'submissionLike'
  | 'applicationLike'
  | 'powLike'
  | 'scoutReminder'
  | 'createListing'
  | 'weeklyListingRoundup'
  | 'talentReminder';

export type EmailActionTypeServer =
  | 'addPayment'
  | 'announceWinners' //many
  | 'application' //2
  | 'commentReply'
  | 'commentSponsor'
  | 'commentActivity'
  | 'commentTag'
  | 'deadlineExtended' //many
  | 'grantApproved'
  | 'grantCompleted'
  | 'grantPaymentReceived'
  | 'grantRejected'
  | 'scoutInvite'
  | 'submissionRejected'
  | 'submissionTalent'
  | 'STWinners' //many
  | 'nonSTWinners' //many
  | 'verifiedListingStatus';

export type EmailActionType = EmailActionTypeCron | EmailActionTypeServer;
