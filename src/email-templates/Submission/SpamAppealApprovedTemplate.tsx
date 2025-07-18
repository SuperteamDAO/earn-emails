import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface SpamAppealApprovedProps {
  name: string;
  submissionType: 'submission' | 'application';
  listingName: string;
  listingLink: string;
}

export const SpamAppealApprovedTemplate = ({
  name,
  submissionType,
  listingName,
  listingLink,
}: SpamAppealApprovedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Your request for appealing your {submissionType} being labeled as spam
        for{' '}
        <a href={listingLink} style={styles.link}>
          {listingName}
        </a>{' '}
        has been approved. Your credit will be refunded to you at the beginning
        of next month!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
