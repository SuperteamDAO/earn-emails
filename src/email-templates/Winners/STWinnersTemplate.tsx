import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  listingName: string;
  listingType: string;
  listingUrl: string;
}

export const STWinnersTemplate = ({
  name,
  listingName,
  listingType,
  listingUrl,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Congrats on winning the{' '}
        <a href={listingUrl} style={styles.link}>
          <strong>{listingName}</strong>
        </a>{' '}
        {listingType}!
      </p>
      <p style={styles.textWithMargin}>
        To receive your reward, please complete KYC by clicking{' '}
        <a href={listingUrl}>here</a> (make sure you're logged in with your
        winning Earn account). If KYC is successful, your payment will be sent
        the following Friday to your Earn embedded wallet.
      </p>
      <p style={styles.textWithMargin}>
        <strong>Already completed KYC on Earn recently?</strong>
        <br />
        No action needed — your rewards will be sent your Earn embedded wallet
        automatically.
      </p>
      <p style={styles.textWithMargin}>
        You can track your payment status{' '}
        <a
          href={'https://in.superteam.fun/payment-pipeline'}
          style={styles.link}
        >
          here
        </a>{' '}
        or on the listing page once KYC is complete.
      </p>

      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
