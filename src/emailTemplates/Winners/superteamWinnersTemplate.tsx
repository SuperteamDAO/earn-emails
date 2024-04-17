import React from 'react';

import { styles } from '../../utils/styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
}

export const SuperteamWinnersTemplate = ({
  name,
  listingName,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> listing! Please
        fill out{' '}
        <a
          href={'https://airtable.com/appPZ5nE1OqZiBKx7/shrm91wzYYj6i2cbA'}
          style={styles.link}
        >
          this form
        </a>{' '}
        to receive your listing reward, and select &quot;Pratik Dholani&quot; as
        the Project Lead.
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
      <p style={styles.unsubscribe}>
        <a
          href="https://earn.superteam.fun/#emailPreferences"
          style={styles.unsubscribeLink}
        >
          Click here
        </a>{' '}
        to update your email preferences on Earn (recommended) or{' '}
        <a
          href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
          style={styles.unsubscribeLink}
        >
          click here
        </a>{' '}
        to unsubscribe from all future emails from Superteam Earn
      </p>
    </div>
  );
};
