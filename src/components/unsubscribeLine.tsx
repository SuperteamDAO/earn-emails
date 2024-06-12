import React from 'react';
import { styles } from '../utils/styles';

export const UnsubscribeLine = () => {
  return (
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
  );
};
