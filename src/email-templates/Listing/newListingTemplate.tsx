import { type $Enums, type Prisma } from '@prisma/client';
import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { getListingTypeLabel } from '../../utils/getListingTypeLabel';
import { styles } from '../styles';

interface NewListingProps {
  name: string;
  link: string;
  listing: {
    id: string;
    title: string;
    region: string;
    skills: Prisma.JsonValue;
    type: $Enums.BountyType;
    slug: string;
    token: string | null;
    rewardAmount: number | null;
    sponsor: {
      name: string;
    };
  };
}

export const NewListingTemplate = ({
  name,
  link,
  listing,
}: NewListingProps) => {
  const listingType = getListingTypeLabel(listing.type);
  const submitOrApply = listing.type === 'project' ? 'apply' : 'submit';
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        {listing.sponsor.name} just posted a new {listingType} called{' '}
        <a href={link} style={styles.link}>
          {listing.title} (
          {!!listing.rewardAmount
            ? listing.rewardAmount?.toLocaleString().trim() + ' '
            : ''}
          {listing.token})
        </a>{' '}
        that looks like a great match for your skills! Have a quick look at the
        scope of the {listingType} and make sure to {submitOrApply} before the
        deadline.
      </p>
      <p style={styles.textWithMargin}>
        Pro tip: Subscribe to the {listingType} to get relevant updates on it.
      </p>
      <p style={styles.textWithMargin}>
        Looking forward to seeing your submission!
      </p>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.text}>&nbsp;</p>
      <UnsubscribeLine />
    </div>
  );
};
