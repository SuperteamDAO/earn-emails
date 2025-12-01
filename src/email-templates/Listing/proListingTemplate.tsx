import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { type BountyType } from '../../generated/prisma/enums';
import { type JsonValue } from '../../generated/prisma/internal/prismaNamespace';
import { styles } from '../styles';

interface ProListingProps {
  name: string;
  link: string;
  listing: {
    id: string;
    title: string;
    region: string;
    skills: JsonValue;
    type: BountyType;
    slug: string;
    token: string | null;
    rewardAmount: number | null;
    sponsor: {
      name: string;
    };
  };
  roundedAmount: number;
}

export const ProListingTemplate = ({
  name,
  link,
  listing,
  roundedAmount,
}: ProListingProps) => {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        A new <strong>Earn Pro</strong> listing just dropped — exclusively for
        the top <strong>1%</strong> of Earn contributors like you:
      </p>
      <strong style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          {listing.title}
        </a>{' '}
        worth {formattedAmount}
      </strong>
      <p style={styles.textWithMargin}>
        Remember: Pro listings mean{' '}
        <strong> higher win probability, faster reviews,</strong> and{' '}
        <strong>premium rewards</strong>. In fact, you're 90% more likely to win
        a Pro listing than a non-Pro listing.
      </p>
      <p style={styles.textWithMargin}>
        You're in the top tier. Make the most of it.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Submit Now
        </a>
      </p>
      <Salutation />
      <p style={styles.text}>&nbsp;</p>
      <UnsubscribeLine />
    </div>
  );
};
