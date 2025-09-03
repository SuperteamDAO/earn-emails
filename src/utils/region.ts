import { countries } from '../constants/country';
import { CombinedRegions } from '../constants/Superteam';

export const getCombinedRegion = (
  region: string,
  lookupSTCountries: boolean = false,
) => {
  let regionObject:
    | {
        name?: string;
        code: string;
        country?: string[];
        displayValue?: string;
        regions?: string[];
      }
    | undefined;
  if (lookupSTCountries) {
    regionObject = CombinedRegions.find((superteam) =>
      superteam.country
        .map((c) => c.toLowerCase())
        .includes(region?.toLowerCase()),
    );
  }
  if (!regionObject) {
    regionObject = CombinedRegions.find((superteam) =>
      superteam.region.toLowerCase().includes(region?.toLowerCase()),
    );
  }
  if (regionObject?.displayValue) {
    regionObject = {
      ...regionObject,
      name: regionObject.displayValue,
    };
  }
  if (!regionObject) {
    regionObject = countries.find(
      (country) => country.name.toLowerCase() === region?.toLowerCase(),
    );
  }

  return regionObject;
};
