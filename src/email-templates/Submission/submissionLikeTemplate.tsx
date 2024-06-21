import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const SubmissionLikeTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        People are digging your work on the <strong>{listingName}</strong>{' '}
        listing. Keep it up!
      </p>
      <p style={styles.textWithMargin}>
        Return the love by liking{' '}
        <a href={link} style={styles.link}>
          other submissions.
        </a>
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
