import React from 'react';

import { styles } from '../../utils/styles';

interface ScoutInviteProps {
  name: string;
  link: string;
  sponsorName: string;
  listingName: string;
}

export const ScoutInviteTemplate = ({
  name,
  sponsorName,
  link,
  listingName,
}: ScoutInviteProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        {sponsorName} is impressed with your profile and thinks you’d be perfect
        for their new listing called
        <a href={link} style={styles.link}>
          "{listingName}"
        </a>
        . Interested? Submit now and stand a higher chance of winning!
      </p>

      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.text}>&nbsp;</p>
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
