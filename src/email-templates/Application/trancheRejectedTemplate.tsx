import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TrancheRejectedProps {
  name: string;
  projectTitle: string;
  sponsorName: string;
}

export const TrancheRejectedTemplate = ({
  name,
  projectTitle,
  sponsorName,
}: TrancheRejectedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Unfortunately, your tranche request for <strong>{projectTitle}</strong>{' '}
        has been rejected by {sponsorName}. Please get in touch with the sponsor
        directly to discuss further.
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
