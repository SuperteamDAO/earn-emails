import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const DeadlineExceededbyWeekTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        It has been a week since the <strong>{listingName}</strong> listing
        expired. The participants would be expecting the results to be out soon
        — request you to publish the winners on Earn shortly!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the submissions.
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
