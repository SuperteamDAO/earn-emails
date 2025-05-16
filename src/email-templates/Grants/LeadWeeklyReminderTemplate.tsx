import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  leadName: string | null;
  pendingApplicationCount: number;
  grantName: string;
}

export const LeadWeeklyReminderTemplate = ({
  leadName,
  pendingApplicationCount,
  grantName,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {leadName},</p>
      <p style={styles.textWithMargin}>
        You have <strong>{pendingApplicationCount}</strong> pending grant
        applications for <strong>{grantName}</strong>.
      </p>
      <p style={styles.textWithMargin}>
        Please review and approve/reject them as soon as possible.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
