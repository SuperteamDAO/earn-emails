import React from 'react';

import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
  referralCode: string;
}

export const FeatureAnnouncementTemplate = ({
  name,
  referralCode,
}: TemplateProps) => {
  const ctaLink = `https://earn.superteam.fun/r/${referralCode}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Starting today, you can invite your friends to Superteam Earn — and get
        extra credits for it.
      </p>
      <br />
      <p style={styles.textWithMargin}>
        Here's how Superteam Earn's referral system works:
      </p>
      <ul style={styles.textWithMargin}>
        <li style={{ marginBottom: '8px' }}>
          Get your referral link from the "Get Free Credits" button on the top
          navigation bar. Share it with your friends.
        </li>
        <li style={{ marginBottom: '8px' }}>
          Earn free credits when your friend signs up and makes their first
          valid submission.
        </li>
        <li style={{ marginBottom: '8px' }}>
          Keep earning credits every time your referred friend wins a bounty,
          project, or grant — forever.
        </li>
        <li style={{ marginBottom: '8px' }}>Invite up to 10 friends.</li>
      </ul>
      <br />
      <p style={styles.textWithMargin}>
        Here's your unique referral link:{' '}
        <a href={ctaLink}>{'https://earn.superteam.fun/r/' + referralCode}</a>
      </p>
      <br />
      <p style={styles.textWithMargin}>
        Start building your crew on Earn, stack up credits while your friends
        earn their crypto.
      </p>
      <p style={styles.salutation}>
        Cheers,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
