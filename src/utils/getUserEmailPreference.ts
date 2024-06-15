import { prisma } from '../prisma';

import { emailActionCategoryMapping } from '../constants';
import { EmailActionType } from '../types';

type EmailTypeActionMappingKeys = keyof typeof emailActionCategoryMapping;
type ValidEmailType = EmailActionType & EmailTypeActionMappingKeys;

export async function getUserEmailPreference(
  userId: string,
  type: ValidEmailType,
) {
  const category = emailActionCategoryMapping[type];

  return await prisma.emailSettings.findFirst({
    where: {
      userId,
      category,
    },
  });
}
