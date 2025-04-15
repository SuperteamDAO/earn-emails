import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TrancheRejectedProps {
  name: string;
  projectTitle: string;
  sponsorName: string;
  salutation: string | null;
}

export const TrancheRejectedTemplate = ({
  name,
  projectTitle,
  sponsorName,
  salutation,
}: TrancheRejectedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Unfortunately, your tranche request for <strong>{projectTitle}</strong>{' '}
        has been rejected by {sponsorName}. Please get in touch with the sponsor
        directly to discuss further.
      </p>
      <Salutation text={salutation ?? 'Best, Superteam Earn'} />
      <UnsubscribeLine />
    </div>
  );
};
