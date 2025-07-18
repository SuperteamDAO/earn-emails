import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface SpamAppealRejectedProps {
  name: string;
  submissionType: 'submission' | 'application';
  listingName: string;
  listingLink: string;
}

export const SpamAppealRejectedTemplate = ({
  name,
  submissionType,
  listingName,
  listingLink,
}: SpamAppealRejectedProps) => {
  const submissionTypeText =
    submissionType === 'application' ? 'applications' : 'submissions';

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Your appeal for your {submissionType} being labeled as spam for{' '}
        <a href={listingLink} style={styles.link}>
          {listingName}
        </a>{' '}
        has been carefully reviewed. However, your {submissionType} didn't pass
        the necessary threshold of quality and/or relevance. Hence, your appeal
        has been rejected and the credit penalty stands.
      </p>
      <p style={styles.textWithMargin}>
        Please note that we get a large number of spam disputes and it won't be
        possible for us to share individual feedback. We hope you take this
        constructively and are able to submit higher quality{' '}
        {submissionTypeText} in the future, and hopefully win!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
