import React from 'react';

import { UnsubscribeLine } from '../../components';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const SubmissionRejectedTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Unfortunately, your application for{' '}
        <a href={link} style={styles.link}>
          {listingName}
        </a>{' '}
        has been rejected. Please note that neither we nor the sponsor can share
        individual feedback on your application.
      </p>
      <p style={styles.textWithMargin}>
        We hope you continue to add to your proof of work by submitting to more
        bounties and projects and winning some along the way! All the best.
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
