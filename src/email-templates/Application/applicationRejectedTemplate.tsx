import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationRejectedProps {
  name: string;
  applicationTitle: string;
  salutation: string | null;
}

export const ApplicationRejectedTemplate = ({
  name,
  applicationTitle,
  salutation,
}: ApplicationRejectedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Unfortunately, your grant application for{' '}
        <strong>{applicationTitle}</strong> has been rejected. Please note that
        it is not possible for us or the sponsor to share individual feedback on
        your grant application.
      </p>
      <p style={styles.textWithMargin}>
        We hope you continue adding to your proof of work by submitting to
        bounties and projects, and winning some along the way. All the best!
      </p>
      <Salutation text={salutation ?? 'Best, Superteam Earn'} />
      <UnsubscribeLine />
    </div>
  );
};
