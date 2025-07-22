import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingSlug: string;
  disputeUrl: string;
}

export const SpamCreditTemplate = ({
  name,
  listingName,
  listingSlug,
  disputeUrl,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Your submission for{' '}
        <a
          href={`${basePath}/listing/${
            listingSlug || ''
          }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
          style={styles.link}
        >
          <strong>{listingName}</strong>
        </a>{' '}
        was reported as spam by the sponsor/reviewer. As a result, 1 submission
        credit will be deducted from your credit balance next month.
      </p>
      <p style={styles.textWithMargin}>
        We hope you can take this feedback constructively and submit some
        winning submissions soon. If you strongly believe that this submission
        has been marked as spam unreasonably or there has been a mistake, please
        click{' '}
        <a href={disputeUrl} style={styles.link}>
          here
        </a>{' '}
        to dispute it, and our team will have a look at your concern.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
