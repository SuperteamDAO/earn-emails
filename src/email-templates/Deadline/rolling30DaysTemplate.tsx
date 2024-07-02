import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
  sponsorName: string;
  applicationNumber: number;
}

export const Rolling30DaysTemplate = ({
  name,
  listingName,
  link,
  sponsorName,
  applicationNumber,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        It&apos;s been a month since you added the listing{' '}
        <span style={{ fontWeight: 400 }}>
          <a href={link} style={styles.link}>
            &quot;{listingName}&quot;
          </a>
        </span>{' '}
        for {sponsorName}. The listing has received {applicationNumber}{' '}
        applications. We request you to announce the winner as soon as possible
        — this will help {sponsorName} retain the trust of Earn's users for any
        future listings.
      </p>
      <p style={styles.text}>
        If you have any questions, please get in touch with{' '}
        <a style={styles.link} href="https://t.me/pratikdholani">
          Pratik
        </a>{' '}
        on Telegram.
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
