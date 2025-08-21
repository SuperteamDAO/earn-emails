export const SKILLS = [
  'DEV',
  'DESIGN',
  'CONTENT',
  'GROWTH',
  'COMMUNITY',
] as const;

export const LISTING_TYPES = ['BOUNTIES', 'PROJECTS', 'HACKATHONS'] as const;

export const PRICE_RANGES = ['500+', '1000+', '2500+', 'any'] as const;

export const ONBOARDING_STEPS = [
  'name',
  'skills',
  'types',
  'price',
  'complete',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export interface OnboardingState {
  name?: string;
  skills: Skill[];
  listingTypes: ListingType[];
  priceRange: PriceRange | '';
  step: OnboardingStep;
}

export type Skill = (typeof SKILLS)[number];
export type ListingType = (typeof LISTING_TYPES)[number];
export type PriceRange = (typeof PRICE_RANGES)[number];

export interface UserPreferences {
  skills: Skill[];
  listingTypes: ListingType[];
  priceRange: PriceRange | '';
  onboardingState?: OnboardingState;
}

export interface TelegramUserData {
  telegramId: bigint;
  chatId: bigint;
  username?: string;
  name?: string;
  isSubscribed: boolean;
  isOnboarded: boolean;
  preferences: UserPreferences;
}
