import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface ApplicationRejectedProps {
  name: string;
  applicationTitle: string;
}

export const ApplicationRejectedTemplate = ({
  name,
  applicationTitle,
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

      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
