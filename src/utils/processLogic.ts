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
  processSponsorSubmission,
  processSubmissionLike,
  processSuperteamWinners,
  processTalentSubmission,
  processWeeklyRoundup,
} from '../emailLogic';
import { prisma } from './prisma';

type EmailType =
  | 'addPayment'
  | 'announceWinners'
  | 'commentReply'
  | 'commentTag'
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
  otherInfo?: any;
}

export async function processLogic({
  type,
  id = '',
  userId = '',
  otherInfo,
}: processLogicParams) {
  if (userId) {
    const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
      where: {
        id: userId,
      },
    });

    if (isUnsubscribed) {
      return;
    }
  }
  switch (type) {
    case 'addPayment':
      return processAddPayment(id);
    case 'announceWinners':
      return processAnnounceWinners(id, userId);
    case 'commentReply':
      return processCommentReply(id, userId);
    case 'commentTag':
      return processCommentTag(id, userId, otherInfo);
    case 'commentSponsor':
      return processCommentSponsor(id, userId);
    case 'commentSubmission':
      return processCommentSubmission(id, userId);
    case 'createListing':
      return processCreateListing(id, userId);
    case 'deadline3days':
      return processDeadlineThreeDays();
    case 'deadlineExceeded':
      return processDeadlineExceeded();
    case 'deadlineExceededWeek':
      return processDeadlineExceededWeek();
    case 'deadlineExtended':
      return processDeadlineExtended(id, userId);
    case 'submissionLike':
      return processSubmissionLike(id, userId);
    case 'submissionSponsor':
      return processSponsorSubmission(id, userId);
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
