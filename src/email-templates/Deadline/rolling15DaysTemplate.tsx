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

export const Rolling15DaysTemplate = ({
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
        It&apos;s been two weeks since you added the listing{' '}
        <span style={{ fontWeight: 400 }}>
          <a href={link} style={styles.link}>
            &quot;{listingName}&quot;
          </a>
        </span>{' '}
        for {sponsorName}. The listing has received {applicationNumber}{' '}
        applications right now &mdash; this is a good time to review the
        applications and hopefully announce the winner!
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
