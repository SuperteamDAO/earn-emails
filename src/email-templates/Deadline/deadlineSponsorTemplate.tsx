import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  submissionReviewLink: string;
  listingLink: string;
}

export const DeadlineSponsorTemplate = ({
  name,
  listingName,
  submissionReviewLink,
  listingLink,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The deadline for your listing{' '}
        <strong>
          <a href={listingLink} style={styles.link}>
            {listingName}
          </a>
        </strong>
        &nbsp; has expired. Please
        <a href={submissionReviewLink} style={styles.link}>
          review the submissions and announce the
        </a>
        winners on Superteam Earn&nbsp;within 5 days.
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
