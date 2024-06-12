import { EmailType } from '../types';

const emailTypeActionMapping = {
  // talent emails
  createListing: 'createListing',
  commentSubmission: 'commentOrLikeSubmission',
  commentReply: 'replyOrTagComment',
  commentTag: 'replyOrTagComment',
  submissionLike: 'commentOrLikeSubmission',
  weeklyListingRoundup: 'weeklyListingRoundup',
  scoutInvite: 'scoutInvite',

  // sponsor emails
  commentSponsor: 'commentSponsor',
  submissionSponsor: 'submissionSponsor',
  deadlineExceeded: 'deadlineSponsor',
  deadlineExceededWeek: 'deadlineSponsor',
} as const;

type EmailTypeActionMappingKeys = keyof typeof emailTypeActionMapping;

type ValidEmailType = EmailType & EmailTypeActionMappingKeys;

export function getCategoryFromEmailType(emailType: ValidEmailType) {
  return emailTypeActionMapping[emailType];
}
