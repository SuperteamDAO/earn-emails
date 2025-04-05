import React from 'react';

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
        Your submission for
        <a
          href={`${basePath}/listing/${
            listingSlug || ''
          }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
          style={styles.link}
        >
          <strong>{listingName}</strong>
        </a>
        has been marked as Spam by the sponsor.
      </p>
      <p style={styles.textWithMargin}>
        We discourage spam submissions and for that reason, we will be deducting
        a credit from your account for the upcoming month.
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
