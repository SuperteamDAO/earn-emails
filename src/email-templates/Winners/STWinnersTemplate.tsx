import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';
import { getListingTypeLabel } from '../../utils';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
}

export const STWinnersTemplate = ({
  name,
  listingName,
  listingType,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> {listingType}!
      </p>
      <p style={styles.text}>
        Since you have won a {listingType} sponsored by a Superteam, you must
        fill out
        <a
          href={'https://airtable.com/appmgNmQgJWJeo3x4/shr8fxYLAc3ZY18cQ'}
          style={styles.link}
        >
          this form
        </a>{' '}
        to receive your reward.
      </p>
      <p style={styles.textWithMargin}>
        We follow a weekly payout system. Therefore, your listing reward might
        take up to a week to show up in your wallet. If you would like to track
        the status of your payment, you can do so{' '}
        <a
          href={'https://in.superteam.fun/payment-pipeline'}
          style={styles.link}
        >
          here
        </a>{' '}
        .
      </p>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
