const emailTypeActionMapping: { [key: string]: string } = {
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
};

export function getCategoryFromEmailType(emailType: string) {
  return emailTypeActionMapping[emailType];
}
