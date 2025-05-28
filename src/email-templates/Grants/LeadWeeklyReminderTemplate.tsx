import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  leadName: string | null;
  pendingApplicationCount: number;
  pendingTrancheCount: number;
  grantName: string;
}

export const LeadWeeklyReminderTemplate = ({
  leadName,
  pendingApplicationCount,
  pendingTrancheCount,
  grantName,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {leadName},</p>
      <p style={styles.textWithMargin}>
        {pendingApplicationCount > 0 && pendingTrancheCount > 0 ? (
          <>
            You have <strong>{pendingApplicationCount}</strong> pending grant
            application(s) and <strong>{pendingTrancheCount}</strong> pending
            tranche request(s) for <strong>{grantName}</strong>.
          </>
        ) : pendingApplicationCount > 0 ? (
          <>
            You have <strong>{pendingApplicationCount}</strong> pending grant
            application(s) for <strong>{grantName}</strong>.
          </>
        ) : (
          <>
            You have <strong>{pendingTrancheCount}</strong> pending tranche
            request(s) for <strong>{grantName}</strong>.
          </>
        )}
      </p>
      <p style={styles.textWithMargin}>
        Please review and approve/reject them as soon as possible.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
