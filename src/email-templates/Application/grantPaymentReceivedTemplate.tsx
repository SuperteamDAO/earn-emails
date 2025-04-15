import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
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
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
