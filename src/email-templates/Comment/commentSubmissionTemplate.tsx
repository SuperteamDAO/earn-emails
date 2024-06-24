import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface SubmissionProps {
  name: string;
  listingName: string;
  personName: string;
  link: string;
}

export const CommentSubmissionTemplate = ({
  name,
  listingName,
  personName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} just left a new
        <a href={link} style={styles.link}>
          {' '}
          comment{' '}
        </a>
        on your submission to the <strong>{listingName}</strong> listing.
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
