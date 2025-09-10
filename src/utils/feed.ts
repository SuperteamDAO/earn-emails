import { type CommentRefType } from '../generated/prisma/enums';

export function getFeedURLType(refType: CommentRefType) {
  switch (refType) {
    case 'GRANT_APPLICATION':
      return 'grant-application';
    case 'SUBMISSION':
      return 'submission';
    case 'POW':
      return 'pow';
  }
}
