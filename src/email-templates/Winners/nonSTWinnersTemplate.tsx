import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
  sponsorName: string;
  totalEarnings: number;
  position: number;
  pocSocials: string | null;
}

export const NonSTWinnersTemplate = ({
  name,
  listingName,
  listingType,
  sponsorName,
  totalEarnings,
  position,
  pocSocials,
}: TemplateProps) => {
  const suffix =
    position === 1
      ? 'st'
      : position === 2
        ? 'nd'
        : position === 3
          ? 'rd'
          : 'th';

  const formattedEarnings = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(totalEarnings);

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> {listingType}!
      </p>
      <p style={styles.text}>
        {sponsorName} will be sending your reward directly into your Earn
        wallet. No action is needed from your end. If you need to contact the
        sponsor, you can do so from{' '}
        <a
          href={
            pocSocials?.includes('@')
              ? `mailto:${pocSocials}`
              : `${pocSocials}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`
          }
          style={styles.link}
        >
          here
        </a>
        .
      </p>
      <p style={styles.text}>
        With this win:
        <ul>
          <li style={styles.text}>
            Your total earnings have climbed to{' '}
            <strong>{formattedEarnings}</strong>
          </li>
          <li style={styles.text}>
            You've jumped up to{' '}
            <strong>
              {position}
              {suffix} place
            </strong>{' '}
            on the leaderboard
          </li>
          <li style={styles.text}>
            And you'll receive <strong>1 extra credit next month</strong>,
            giving you access to more opportunities on Earn
          </li>
        </ul>
        <p style={styles.text}>
          Congratulations again — we hope you continue winning!
        </p>
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
