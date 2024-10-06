import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
  sponsorName: string;
  walletAddress: string | null;
  totalEarnings: number;
  position: number;
}

export const PaymentSTWinnersTemplate = ({
  name,
  listingName,
  listingType,
  sponsorName,
  walletAddress,
  totalEarnings,
  position,
}: TemplateProps) => {
  const suffix =
    position === 1
      ? 'st'
      : position === 2
      ? 'nd'
      : position === 3
      ? 'rd'
      : 'th';

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> {listingType}!
      </p>
      <p style={styles.text}>
        {sponsorName} will be sending your reward directly into your wallet (
        {walletAddress}). No action is needed from your end. If you need to
        contact the sponsor, you can do so from
        <a
          href={'https://airtable.com/appmgNmQgJWJeo3x4/shr8fxYLAc3ZY18cQ'}
          style={styles.link}
        >
          here
        </a>{' '}
        .
      </p>
      <p style={styles.textWithMargin}>
        With this win, your earnings have increased to ${totalEarnings} and your
        leaderboard position has jumped to {position}
        {suffix} position! We hope you continue winning :)
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
