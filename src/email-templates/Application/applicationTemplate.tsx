import { type Grants } from '@prisma/client';
import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationProps {
  name: string;
  applicationTitle: string;
  grant: Grants;
  salutation: string | null;
}

export const ApplicationTemplate = ({
  name,
  applicationTitle,
  grant,
  salutation,
}: ApplicationProps) => {
  const { avgResponseTime, title } = grant;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>

      <p style={styles.textWithMargin}>
        Thanks for sending in your <strong>{title}</strong> application for{' '}
        <strong>{applicationTitle}</strong>. The sponsor will try their best to
        get back to you within <strong>{avgResponseTime}</strong>. Appreciate
        your patience!
      </p>

      <Salutation text={salutation ?? 'Best, Superteam Earn'} />
      <UnsubscribeLine />
    </div>
  );
};
