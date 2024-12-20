import { emailActionCategoryMapping } from '../constants/emailConfig';
import { prisma } from '../prisma';
import { type EmailActionType } from '../types/EmailActionType';

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
