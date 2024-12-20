import { type CompensationType } from '@prisma/client';
import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants';
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

const ListingItem = ({ listing }: { listing: Listing }) => {
  const roundedValue = Math.round((listing.usdValue ?? 0) / 10) * 10;

  const formattedUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedValue);

  return (
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
        by {listing.sponsor} ({formattedUSD})
      </div>
    </li>
  );
};

const link = `https://earn.superteam.fun/new/?utm_source=superteamearn&utm_medium=email&utm_campaign=profileconversion`;

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
        People like you have earned over {TVE} on Superteam Earn.
      </p>
      <p style={styles.textWithMargin}>
        Take the final step by completing your profile from{' '}
        <a href={link} style={styles.link}>
          here
        </a>{' '}
        — having a profile increases your chances of winning gigs. It’s easy and
        quick to set up.
      </p>

      <p style={styles.textWithMargin}>
        Here's a sneak peek of the kind of opportunities you're missing out on:
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

      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: '#6366F1',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '6px',
          border: 'none',
          fontWeight: 500,
          cursor: 'pointer',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          textDecoration: 'none',
          display: 'inline-block',
          textAlign: 'center',
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
      >
        Complete Profile
      </a>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
