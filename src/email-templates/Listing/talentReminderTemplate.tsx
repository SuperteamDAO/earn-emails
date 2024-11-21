import { type CompensationType } from '@prisma/client';
import React from 'react';

import { UnsubscribeLine } from '../../components';
import { basePath } from '../../constants';
import { getListingTypeLabel } from '../../utils';
import { styles } from '../styles';

interface Listing {
  id: string;
  title: string;
  sponsor: string;
  slug: string;
  type: string;
  token: string | null;
  usdValue: number | null;
  rewardAmount: number | null;
  compensationType: CompensationType;
  maxRewardAsk: number | null;
  minRewardAsk: number | null;
}

interface TemplateProps {
  name: string | null | undefined;
  listings: Listing[];
  TVE: string | null;
}

const getReward = (listing: Listing) => {
  const formatNumber = (number: number) =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
      number,
    );

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
        href={`${basePath}/listings/${listing.type}/${
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

export const TalentReminderTemplate = ({
  name,
  listings,
  TVE,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>{name ? 'Hello ' + name + ',' : 'Hello,'}</p>
      <p style={styles.textWithMargin}>
        Contributing to web3 projects is the most reliable way to earn in global
        standards. Superteam Earn is the easiest way to do it!
      </p>
      <p style={styles.textWithMargin}>
        Take the next step by completing your profile from here — it helps
        sponsors understand your skills better and increases your chances of
        winning bounties and projects. It’s easy and quick to set up.
      </p>

      <p style={styles.textWithMargin}>
        You're missing out. People like you have earned over {TVE} on Superteam
        Earn!
      </p>

      <p style={styles.textWithMargin}>
        Here's a sneak peak:
        <br />
        <ol>
          {listings.map((listing) => (
            <ListingItem key={listing.id} listing={listing} />
          ))}
        </ol>
      </p>

      <p style={styles.text}>
        Click on the button below to complete your talent profile. It might be
        the <b>start of something great for your career</b>.
      </p>

      <button
        style={{
          backgroundColor: '#6366F1',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        onClick={() =>
          window.open(
            'https://earn.superteam.fun/new/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications',
            '_blank',
          )
        }
      >
        Complete Profile
      </button>

      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
