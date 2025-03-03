import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { formatNumber } from '../../utils/formatNumber';
import { styles } from '../styles';

interface TrancheApprovedProps {
  name: string;
  projectTitle: string;
  sponsorName: string;
  approvedTrancheAmount: number | null;
  token: string;
}

export const TrancheApprovedTemplate = ({
  name,
  projectTitle,
  sponsorName,
  approvedTrancheAmount,
  token,
}: TrancheApprovedProps) => {
  const formattedAmount = formatNumber(approvedTrancheAmount ?? 0);

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>

      <p style={styles.textWithMargin}>
        Your tranche request for <strong>{projectTitle}</strong> has been
        accepted by {sponsorName} for{' '}
        <strong>
          {formattedAmount} {token}
        </strong>
        . Congratulations! You should receive your payment in a few days.
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
