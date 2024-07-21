import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

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
        Your grant application for {applicationTitle} has been approved.{' '}
        {sponsorName} will reach out to you for the next steps.
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
