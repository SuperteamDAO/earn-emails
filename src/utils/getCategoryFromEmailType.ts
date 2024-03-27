const emailTypeActionMapping: { [key: string]: string } = {
  // talent emails
  createListing: 'createListing',
  deadline3days: 'updateListing',
  deadlineExtended: 'updateListing',
  announceWinners: 'updateListing',
  submissionTalent: 'updateListing',
  commentSubmission: 'commentOrLikeSubmission',
  submissionLike: 'commentOrLikeSubmission',
  weeklyListingRoundup: 'weeklyListingRoundup',

  // sponsor emails
  commentSponsor: 'commentSponsor',
  submissionSponsor: 'submissionSponsor',
  deadlineExceeded: 'deadlineSponsor',
  deadlineExceededWeek: 'deadlineSponsor',
};

export function getCategoryFromEmailType(emailType: string): string {
  return emailTypeActionMapping[emailType];
}
