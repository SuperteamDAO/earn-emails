import { type Grants } from '@prisma/client';
import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationProps {
  name: string;
  applicationTitle: string;
  grant: Grants;
}

export const ApplicationTemplate = ({
  name,
  applicationTitle,
  grant,
}: ApplicationProps) => {
  const { avgResponseTime, title } = grant;
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>

      <p style={styles.textWithMargin}>
        Thanks for sending in your <strong>{applicationTitle}</strong>{' '}
        application for <strong>{title}</strong>. The sponsor will try their
        best to get back to you within <strong>{avgResponseTime}</strong>.
        Appreciate your patience!
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
