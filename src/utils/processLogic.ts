import { emailProcessors } from '../constants/emailConfig';
import { type EmailActionType } from '../types/EmailActionType';

interface ProcessLogicParams {
  type: EmailActionType;
  id?: string;
  userId?: string;
  otherInfo?: any;
}

export async function processLogic({
  type,
  id = '',
  userId = '',
  otherInfo,
}: ProcessLogicParams) {
  const processFunction = emailProcessors[type];
  if (!processFunction) throw new Error('Invalid email type');

  const result = await processFunction(id, userId, otherInfo);

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
