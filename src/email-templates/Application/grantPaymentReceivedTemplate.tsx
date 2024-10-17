import React from 'react';

import { UnsubscribeLine } from '@/components';

import { styles } from '../styles';

interface TemplateProps {
  applicationTitle: string;
  sponsorName: string;
  walletAddress: string;
}

export const GrantPaymentReceivedTemplate = ({
  applicationTitle,
  sponsorName,
  walletAddress,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.textWithMargin}>
        {sponsorName} has just transferred a grant payment for your project{' '}
        {applicationTitle} to your wallet {walletAddress}.
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
