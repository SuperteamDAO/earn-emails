import React from 'react';

import { styles } from '../../utils/styles';
import { UnsubscribeLine } from '../../components/unsubscribeLine';

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
        Check out the other submissions and spread some love to the other
        participants!
      </p>
      <a href={link} style={styles.link}>
        View Other Submissions
      </a>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
