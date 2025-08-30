import { type Bounties } from '@prisma/client';

import { type MainSkills, type Skills } from '../../types/Skills';
import {
  type ListingType,
  type RewardRange,
  type Skill,
  type UserPreferences,
} from '../../types/telegramUserBot';

export const LISTING_TO_PREFERENCE_SKILL_MAP: Record<MainSkills, Skill[]> = {
  Frontend: ['DEV'],
  Backend: ['DEV'],
  Blockchain: ['DEV'],
  Mobile: ['DEV'],
  Design: ['DESIGN'],
  Community: ['COMMUNITY'],
  Growth: ['GROWTH'],
  Content: ['CONTENT'],
  Other: [],
};

export const PREFERENCE_TO_LISTING_SKILL_MAP: Record<Skill, MainSkills[]> = {
  DEV: ['Frontend', 'Backend', 'Blockchain', 'Mobile'],
  DESIGN: ['Design'],
  CONTENT: ['Content'],
  GROWTH: ['Growth'],
  COMMUNITY: ['Community'],
};

export interface MatchResult {
  matches: boolean;
  reasons: {
    rewardMatch: boolean;
    listingTypeMatch: boolean;
    skillMatch: boolean;
  };
}

function matchesReward(
  userRewardRange: RewardRange | '',
  listingUsdValue?: number | null,
): boolean {
  if (!userRewardRange || userRewardRange === 'any') {
    return true;
  }

  if (listingUsdValue == null) {
    return false;
  }

  const rewardThresholds: Record<RewardRange, number> = {
    '500+': 500,
    '1000+': 1000,
    '2500+': 2500,
    any: 0,
  };

  const threshold = rewardThresholds[userRewardRange];
  return listingUsdValue >= threshold;
}

function matchesListingType(
  userListingTypes: ListingType[],
  listingType: Bounties['type'],
): boolean {
  if (userListingTypes.length === 0) {
    return false;
  }

  const typeMapping: Record<Bounties['type'], ListingType> = {
    bounty: 'BOUNTIES',
    project: 'PROJECTS',
    hackathon: 'HACKATHONS',
  };

  const mappedType = typeMapping[listingType];
  return userListingTypes.includes(mappedType);
}

function matchesSkills(
  userSkills: UserPreferences['skills'],
  listingSkills?: Skills,
): boolean {
  if (userSkills.length === 0) {
    return false;
  }

  if (!listingSkills || listingSkills.length === 0) {
    return false;
  }

  const listingParentSkills = listingSkills.map((skill) => skill.skills);

  for (const userSkill of userSkills) {
    const mappedListingSkills = PREFERENCE_TO_LISTING_SKILL_MAP[userSkill];

    const hasMatchingSkill = mappedListingSkills.some((mappedSkill) =>
      listingParentSkills.includes(mappedSkill),
    );

    if (hasMatchingSkill) {
      return true;
    }
  }

  return false;
}

function isListingEligible(listing: Bounties): boolean {
  return (
    listing.isPublished &&
    listing.isActive &&
    !listing.isPrivate &&
    !listing.isWinnersAnnounced &&
    !listing.isArchived &&
    listing.status === 'OPEN'
  );
}

export function matchesUserPreferences(
  userPreferences: UserPreferences,
  listing: Bounties,
): MatchResult {
  if (!isListingEligible(listing)) {
    return {
      matches: false,
      reasons: {
        rewardMatch: false,
        listingTypeMatch: false,
        skillMatch: false,
      },
    };
  }

  const rewardMatch = matchesReward(
    userPreferences.rewardRange,
    listing.usdValue,
  );
  const listingTypeMatch = matchesListingType(
    userPreferences.listingTypes,
    listing.type,
  );
  const skillMatch = matchesSkills(
    userPreferences.skills,
    listing.skills as unknown as Skills,
  );

  const matches = rewardMatch && listingTypeMatch && skillMatch;

  return {
    matches,
    reasons: {
      rewardMatch,
      listingTypeMatch,
      skillMatch,
    },
  };
}
