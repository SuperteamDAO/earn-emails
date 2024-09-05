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

export const RollingUnpublishTemplate = ({
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
        Hope {"you're"} doing well!
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
      <p style={styles.textWithMargin}>
        It’s been 2 months since your rolling listing <span style={{ fontWeight: 400 }}><a href={link} style={styles.link}> &quot;{listingName}&quot; </a></span> was published, and we noticed that the winners haven’t been announced yet. To keep the platform up to date and ensure applicants are informed about their status, we’ll be unpublishing your listing for now due to inactivity.
      </p>
      <p style={styles.text}>
        If you have any updates about the listing, feel free to reach out
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
