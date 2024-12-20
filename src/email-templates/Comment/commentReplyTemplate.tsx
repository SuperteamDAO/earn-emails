import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface SubmissionProps {
  name: string;
  link: string;
}

export const CommentReplyTemplate = ({ name, link }: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        Someone has responded to your comment on Superteam Earn.{' '}
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
