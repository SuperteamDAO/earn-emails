import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface Props {
  decision: 'approve' | 'reject';
  link: string;
  name: string;
  listingName: string;
  listingType: string;
}

export const VerifiedStatusTemplate = ({
  name,
  link,
  listingName,
  listingType,
  decision,
}: Props) => {
  if (decision === 'approve') {
    return (
      <div style={styles.container}>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Your {listingType}{' '}
          <a href={link} style={styles.link}>
            {listingName}
          </a>{' '}
          has been verified by our team and published.
        </p>
        <p style={styles.text}>
          Thanks for your patience!
        </p>

        <p style={styles.salutation}>
          Best,
          <br />
          Superteam Earn
        </p>
        <p style={styles.text}>&nbsp;</p>
        <UnsubscribeLine />
      </div>
    );
  }
  else if (decision === 'reject') {
    return (
      <div style={styles.container}>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Unfortunately, your {listingType}{' '}
          <a href={link} style={styles.link}>
            {listingName}
          </a>{' '}
          did not pass our due diligence review and, therefore, could not be published.
        </p>
        <p style={styles.text}>
          If you believe this decision was made in error, please don’t hesitate to contact us at{' '}
          <a href='mailto:support@superteamearn.com' style={styles.link}>
            support@superteamearn.com
          </a>
          . We’re here to help.
        </p>

        <p style={styles.salutation}>
          Best,
          <br />
          Superteam Earn
        </p>
        <p style={styles.text}>&nbsp;</p>
        <UnsubscribeLine />
      </div>
    );
  }
};
