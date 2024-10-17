import React from 'react';

import { UnsubscribeLine } from '@/components';

import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const RollingUnpublishTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>Hope {"you're"} doing well!</p>
      <p style={styles.text}>
        It’s been over 2 months since your rolling Project{' '}
        <span style={{ fontWeight: 400 }}>
          <a href={link} style={styles.link}>
            {' '}
            {`"`}
            {listingName}
            {`"`}
          </a>
        </span>{' '}
        was published, and we noticed that the winners haven’t been announced
        yet. To keep the platform up to date and ensure candidates are informed
        about their application status, we’ll be unpublishing your listing for
        now due to inactivity.
      </p>
      <p style={styles.text}>
        If you have any updates about the listing, feel free to reach out to{' '}
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
