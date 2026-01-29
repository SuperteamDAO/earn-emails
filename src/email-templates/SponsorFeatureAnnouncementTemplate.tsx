import React from 'react';

import { Salutation } from '../components/Salutation';
import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const SponsorFeatureAnnouncementTemplate = ({ name }: TemplateProps) => {
  const ctaLink = `https://superteam.fun/earn/dashboard/listings?utm_source=email&utm_medium=sponsor&utm_campaign=150k`;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name || 'there'},</p>
      <p style={styles.textWithMargin}>
        Earn just crossed 150k registered users! That's great, but what does
        this mean for you?
      </p>
      <p style={styles.textWithMargin}>
        You now have access to the largest Solana talent network, for free. With
        just a few clicks, you can tap into a deep pool of Solana-native
        developers, creators, designers, editors, and many other skilled
        professionals.
      </p>
      <p style={styles.textWithMargin}>
        This means faster turnaround times, more diverse submissions, and
        long-term contributors you can rely on. Have work you want to outsource?
      </p>
      <p style={styles.textWithMargin}>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Create a Listing
        </a>
      </p>
      <p style={styles.textWithMargin}>
        Thanks for building with us and for being part of this journey. We're
        just getting started.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
