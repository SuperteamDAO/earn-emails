import { emailProcessors } from '../constants/emailConfig';
import { type EmailActionType } from '../types/EmailActionType';

interface ProcessLogicParams {
  type: EmailActionType;
  entityId?: string;
  userId?: string;
  otherInfo?: any;
  logId?: string;
  batchId?: string;
}

export async function processLogic({
  type,
  entityId = '',
  userId = '',
  otherInfo,
  logId,
  batchId,
}: ProcessLogicParams) {
  const processFunction = emailProcessors[type];
  if (!processFunction) throw new Error('Invalid email type');

  const result = await processFunction(entityId, userId, otherInfo);

  if (Array.isArray(result)) {
    return result.map((emailData) => ({
      ...emailData,
      type,
      entityId,
      userId,
      otherInfo,
      logId,
      batchId,
    }));
  } else {
    return {
      ...result,
      type,
      entityId,
      userId,
      otherInfo,
      logId,
      batchId,
    };
  }
}
