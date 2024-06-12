import {
  processAddPayment,
  processAnnounceWinners,
  processCommentReply,
  processCommentSponsor,
  processCommentSubmission,
  processCommentTag,
  processCreateListing,
  processDeadlineExceeded,
  processDeadlineExceededWeek,
  processDeadlineExtended,
  processDeadlineThreeDays,
  processScoutInvite,
  processSponsorSubmission,
  processSubmissionLike,
  processSuperteamWinners,
  processTalentSubmission,
  processWeeklyRoundup,
} from '../emailLogic';
import { EmailType } from '../types';

interface processLogicParams {
  type: EmailType;
  id?: string;
  userId?: string;
  otherInfo?: any;
}

export async function processLogic({
  type,
  id = '',
  userId = '',
  otherInfo,
}: processLogicParams) {
  let result;
  switch (type) {
    case 'addPayment':
      result = await processAddPayment(id);
      break;
    case 'announceWinners':
      result = await processAnnounceWinners(id);
      break;
    case 'commentReply':
      result = await processCommentReply(id, userId);
      break;
    case 'commentTag':
      result = await processCommentTag(id, userId, otherInfo);
      break;
    case 'commentSponsor':
      result = await processCommentSponsor(id, userId);
      break;
    case 'commentSubmission':
      result = await processCommentSubmission(id, otherInfo);
      break;
    case 'createListing':
      result = await processCreateListing(id);
      break;
    case 'deadline3days':
      result = await processDeadlineThreeDays();
      break;
    case 'deadlineExceeded':
      result = await processDeadlineExceeded();
      break;
    case 'deadlineExceededWeek':
      result = await processDeadlineExceededWeek();
      break;
    case 'deadlineExtended':
      result = await processDeadlineExtended(id);
      break;
    case 'scoutInvite':
      result = await processScoutInvite(id, userId);
      break;
    case 'submissionLike':
      result = await processSubmissionLike(id, userId);
      break;
    case 'submissionSponsor':
      result = await processSponsorSubmission(id, userId);
      break;
    case 'submissionTalent':
      result = await processTalentSubmission(id, userId);
      break;
    case 'superteamWinners':
      result = await processSuperteamWinners(id);
      break;
    case 'weeklyListingRoundup':
      result = await processWeeklyRoundup();
      break;
    default:
      throw new Error('Invalid email type');
  }

  if (Array.isArray(result)) {
    return result.map((emailData) => ({
      ...emailData,
      type,
      id,
      userId,
      otherInfo,
    }));
  } else {
    return {
      ...result,
      type,
      id,
      userId,
      otherInfo,
    };
  }
}
