import { emailTypePriority } from '../constants/emailConfig';
import { type EmailActionType } from '../types/EmailActionType';

export const getPriority = (type: EmailActionType): number => {
  const priority = emailTypePriority[type];
  if (priority === undefined) throw new Error('Invalid email type');
  return priority;
};
