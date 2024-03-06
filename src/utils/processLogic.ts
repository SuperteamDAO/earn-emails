import {
  processAddPayment,
  processAnnounceWinners,
  processCommentSponsor,
  processCommentSubmission,
  processCreateListing,
  processDeadlineExceededWeek,
  processDeadlineExtended,
  processDeadlineThreeDays,
  processSponsorSubmission,
  processSubmissionLike,
  processSuperteamWinners,
  processTalentSubmission,
  processWeeklyRoundup,
} from '../emailLogic';
import { processDeadlineExceeded } from '../emailLogic/deadlineExceeded';

type EmailType =
  | 'addPayment'
  | 'announceWinners'
  | 'commentSponsor'
  | 'commentSubmission'
  | 'createListing'
  | 'deadline3days'
  | 'deadlineExceeded'
  | 'deadlineExceededWeek'
  | 'deadlineExtended'
  | 'submissionLike'
  | 'submissionSponsor'
  | 'submissionTalent'
  | 'superteamWinners'
  | 'weeklyListingRoundup';

interface processLogicParams {
  type: EmailType;
  id?: string;
  userId?: string;
}

export async function processLogic({
  type,
  id = '',
  userId = '',
}: processLogicParams) {
  switch (type) {
    case 'addPayment':
      return processAddPayment(id);
    case 'announceWinners':
      return processAnnounceWinners(id);
    case 'commentSponsor':
      return processCommentSponsor(id);
    case 'commentSubmission':
      return processCommentSubmission(id, userId);
    case 'createListing':
      return processCreateListing(id);
    case 'deadline3days':
      return processDeadlineThreeDays();
    case 'deadlineExceeded':
      return processDeadlineExceeded();
    case 'deadlineExceededWeek':
      return processDeadlineExceededWeek();
    case 'deadlineExtended':
      return processDeadlineExtended(id);
    case 'submissionLike':
      return processSubmissionLike(id);
    case 'submissionSponsor':
      return processSponsorSubmission(id);
    case 'submissionTalent':
      return processTalentSubmission(id, userId);
    case 'superteamWinners':
      return processSuperteamWinners(id);
    case 'weeklyListingRoundup':
      return processWeeklyRoundup();
    default:
      throw new Error('Invalid email type');
  }
}
