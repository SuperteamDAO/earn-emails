import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationApprovedProps {
  name: string;
  applicationTitle: string;
  sponsorName: string;
}

export const ApplicationApprovedTemplate = ({
  name,
  applicationTitle,
  sponsorName,
}: ApplicationApprovedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Your grant application for <strong>{applicationTitle}</strong> has been
        approved. {sponsorName} will reach out to you for the next steps.
      </p>

      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
