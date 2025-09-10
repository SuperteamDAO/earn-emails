import { type CommentRefType } from '@/prisma/enums';
import { type BountiesModel } from '@/prisma/models';

import { getFeedURLType } from './feed';

export function getCommentSourceURL(
  baseUrl: string | undefined,
  type: CommentRefType,
  listing: BountiesModel | null,
  id: string,
): URL {
  const url = new URL(`${baseUrl}`);
  if (type === 'BOUNTY') {
    url.pathname = `/listing/${listing?.slug}`;
  } else {
    url.pathname = '/feed';
    url.searchParams.set('type', getFeedURLType(type) || 'error');
    url.searchParams.set('id', id);
  }
  url.searchParams.set('utm_source', 'superteamearn');
  url.searchParams.set('utm_medium', 'email');
  url.searchParams.set('utm_campaign', 'notifications');
  return url;
}
