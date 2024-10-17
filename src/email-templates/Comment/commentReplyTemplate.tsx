import React from 'react';

import { UnsubscribeLine } from '../../components';
import { styles } from '../styles';

interface SubmissionProps {
  name: string;
  listingName: string;
  link: string;
}

export const CommentReplyTemplate = ({
  name,
  listingName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        Someone has responded to your comment on the{' '}
        <strong>{listingName}</strong> listing on Superteam Earn.
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
      <UnsubscribeLine />
    </div>
  );
};
