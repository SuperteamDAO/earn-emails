import React from 'react';

import { styles } from '../../utils/styles';
import { UnsubscribeLine } from '../../components/unsubscribeLine';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const SubmissionSponsorTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Your listing <strong>{listingName}</strong> just received a submission
        on Superteam Earn &mdash;{' '}
        <a href={link} style={styles.link}>
          check it out!
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
