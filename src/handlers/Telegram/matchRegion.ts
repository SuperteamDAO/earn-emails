import { getCombinedRegion } from '../../utils/region';

export function matchesRegion(
  listingRegion: string,
  userLocation?: string | null,
): boolean {
  if (listingRegion.toLowerCase() === 'global') {
    return true;
  }

  if (!userLocation) {
    return false;
  }

  const regionObject = getCombinedRegion(listingRegion);

  if (!regionObject?.country) {
    return false;
  }

  return regionObject.country.some((country) =>
    userLocation.toLowerCase().includes(country.toLowerCase()),
  );
}
