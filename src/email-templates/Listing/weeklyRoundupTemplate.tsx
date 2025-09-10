import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { type CompensationType } from '../../generated/prisma/enums';
import { formatNumber } from '../../utils/formatNumber';
import { getListingTypeLabel } from '../../utils/getListingTypeLabel';
import { styles } from '../styles';

interface Skill {
  skills: string;
  subskills: string[];
}

interface Listing {
  id: string;
  title: string;
  sponsor: string;
  slug: string;
  type: string;
  token: string | null;
  skills: any;
  usdValue: number | null;
  rewardAmount: number | null;
  compensationType: CompensationType;
  maxRewardAsk: number | null;
  minRewardAsk: number | null;
}

interface TemplateProps {
  name: string;
  listings: Listing[];
  userSkills: Skill[];
}

const getReward = (listing: Listing) => {
  switch (listing.compensationType) {
    case 'fixed':
      return listing.rewardAmount !== null
        ? formatNumber(listing.rewardAmount)
        : 'N/A';
    case 'variable':
      return 'Variable';
    case 'range':
      const minFormatted =
        listing.minRewardAsk !== null
          ? formatNumber(listing.minRewardAsk)
          : 'N/A';
      const maxFormatted =
        listing.maxRewardAsk !== null
          ? formatNumber(listing.maxRewardAsk)
          : 'N/A';
      return `${minFormatted} - ${maxFormatted}`;
  }
};

const ListingItem = ({ listing }: { listing: Listing }) => (
  <li style={styles.text}>
    <div>
      <a
        href={`${basePath}/listing/${
          listing.slug || ''
        }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
        style={styles.link}
      >
        {listing.title}
      </a>{' '}
      by {listing.sponsor} ({getReward(listing)} {listing.token}{' '}
      {getListingTypeLabel(listing.type)})
    </div>
  </li>
);

export const WeeklyRoundupTemplate = ({
  name,
  listings,
  userSkills,
}: TemplateProps) => {
  const groupedListings: Record<string, Listing[]> = {};
  const usedListings = new Set<string>();

  userSkills.forEach((userSkill) => {
    const skillListings = listings.filter(
      (listing) =>
        listing.skills.some(
          (skill: Skill) => skill.skills === userSkill.skills,
        ) && !usedListings.has(listing.id),
    );

    if (skillListings.length > 0) {
      groupedListings[userSkill.skills] = skillListings.sort(
        (a, b) => (b.usdValue || 0) - (a.usdValue || 0),
      );
      skillListings.forEach((listing) => usedListings.add(listing.id));
    }
  });

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey there, {name}!</p>
      <p style={styles.textWithMargin}>
        Here's a weekly round-up of all live listings, curated just for you:
      </p>

      {Object.entries(groupedListings).map(([skill, skillListings]) => (
        <div key={skill}>
          <h2
            style={{
              fontSize: '15px',
              lineHeight: '18px',
              fontWeight: 'semibold',
              marginTop: '16px',
            }}
          >
            {skill}
          </h2>
          <ol>
            {skillListings.map((listing) => (
              <ListingItem key={listing.id} listing={listing} />
            ))}
          </ol>
        </div>
      ))}

      <p style={styles.text}>
        Hope to see you participate in (and hopefully win!) some of these :)
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
