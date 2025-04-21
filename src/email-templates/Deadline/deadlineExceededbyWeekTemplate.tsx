import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

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
        It has been 7 days since the <strong>{listingName}</strong> listing
        expired. Participants would be expecting the results to be out soon —
        request you to publish the winners on Earn ASAP!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the submissions.
      </p>

      <p style={styles.textWithMargin}>
        Reach out to us on{' '}
        <a href="https://t.me/pratikdholani/" style={styles.link}>
          Telegram
        </a>{' '}
        in case you need help.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
