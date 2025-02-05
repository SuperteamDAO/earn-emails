import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  applicationTitle: string;
  sponsorName: string;
}

export const GrantPaymentReceivedTemplate = ({
  applicationTitle,
  sponsorName,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.textWithMargin}>
        {sponsorName} has just transferred a grant payment for your project{' '}
        {applicationTitle} to your Earn wallet.
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
