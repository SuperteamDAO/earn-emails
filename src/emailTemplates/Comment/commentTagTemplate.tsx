import React from 'react';

import { styles } from '../../utils/styles';

interface SubmissionProps {
  name: string;
  personName: string;
  link: string;
}

export const CommentTagTemplate = ({
  name,
  personName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} has tagged you in a comment on Superteam Earn.{' '}
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to check it out.
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
        to unsubscribe from all future emails from Superteam Earn.
      </p>
    </div>
  );
};
