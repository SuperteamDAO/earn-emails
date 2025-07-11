import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingSlug: string;
}

export const SpamCreditTemplate = ({
  name,
  listingName,
  listingSlug,
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
        We strive to improve the overall quality of submissions on the platform.
        We hope you can take this feedback constructively and make some winning
        submissions soon.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
