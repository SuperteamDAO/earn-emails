import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface ApplicationSponsorProps {
  name: string;
  grantName: string;
  applicationTitle: string;
  link: string;
}

export const ApplicationSponsorTemplate = ({
  name,
  grantName,
  applicationTitle,
  link,
}: ApplicationSponsorProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Your listing <strong>{grantName}</strong> has received a new grant
        application with the title <strong>{applicationTitle}</strong>.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to check all applications.
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
