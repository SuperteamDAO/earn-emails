import { emailTypePriority } from '../constants';
import { type EmailActionType } from '../types';

export const getPriority = (type: EmailActionType): number => {
  const priority = emailTypePriority[type];
  if (priority === undefined) throw new Error('Invalid email type');
  return priority;
};
