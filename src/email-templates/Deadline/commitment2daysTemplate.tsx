import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  telegramLink: string;
  link: string;
}

export const CommitmentTwoDaysTemplate = ({
  name,
  listingName,
  telegramLink,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Just a quick heads-up — the deadline to announce winners for your
        listing &quot;
        <span style={{ fontWeight: 700 }}>{listingName}&quot;</span> is in{' '}
        <span style={{ fontWeight: 700 }}>2 days</span>.
      </p>
      <p style={styles.textWithMargin}>
        If you haven&apos;t reviewed the submissions yet, now&apos;s a great
        time to dive in and select your winners. Prompt announcements keep
        contributors motivated and maintain trust in your bounties.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the submissions.
      </p>
      <p style={styles.textWithMargin}>
        Reach out to us on{' '}
        <a href={telegramLink} style={styles.link}>
          Telegram
        </a>{' '}
        in case you need help.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
