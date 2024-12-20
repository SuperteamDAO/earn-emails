import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationCompletedProps {
  name: string;
  grantName: string;
  applicationTitle: string;
  sponsorName: string;
  grantLink: string;
  otherGrantsLink: string;
}

export const ApplicationCompletedTemplate = ({
  name,
  grantName,
  applicationTitle,
  sponsorName,
  grantLink,
  otherGrantsLink,
}: ApplicationCompletedProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Your grant project <strong>{applicationTitle}</strong> has been marked
        as completed by {sponsorName}. This means you can send in another
        application for {grantName}!
      </p>

      <p style={styles.textWithMargin}>
        <a href={grantLink} style={styles.link}>
          Click here
        </a>{' '}
        to apply again, or check out{' '}
        <a href={otherGrantsLink} style={styles.link}>
          other grants
        </a>
        .
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
