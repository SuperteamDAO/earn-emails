import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
}

export const STWinnersTemplate = ({
  name,
  listingName,
  listingType,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the <strong>{listingName}</strong> {listingType}!
        You must fill out{' '}
        <a
          href={'https://airtable.com/appmgNmQgJWJeo3x4/shr8fxYLAc3ZY18cQ'}
          style={styles.link}
        >
          this form
        </a>{' '}
        to receive your reward.
      </p>
      <p style={styles.textWithMargin}>
        We verify payment requests on Mondays. If verified, payments should
        reach you by the following Friday (UTC). Therefore, your rewards might
        take a week or so to show up in your wallet. Once your payment request
        is verified, you can track the status of your payment{' '}
        <a
          href={'https://in.superteam.fun/payment-pipeline'}
          style={styles.link}
        >
          here
        </a>
        .
      </p>
      <p style={styles.textWithMargin}>
        More good news: because of this win, you’ll be earning one extra credit
        next month! This means you’ll be able to apply to more opportunities on
        Earn next month and keep stacking wins.
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
