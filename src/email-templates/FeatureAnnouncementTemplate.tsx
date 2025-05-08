import React from 'react';

import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 24px',
  margin: '20px 0',
  backgroundColor: '#6466F1',
  color: '#ffffff',
  textDecoration: 'none',
  borderRadius: '5px',
  fontWeight: 'medium',
  textAlign: 'center',
};

const buttonTextStyle: React.CSSProperties = {
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'medium',
  textAlign: 'center',
  marginBlockStart: '0',
  marginBlockEnd: '0',
  margin: '0',
  padding: '0',
  display: 'inline-block',
};

export const FeatureAnnouncementTemplate = ({ name }: TemplateProps) => {
  const ctaLink =
    'https://earn.superteam.fun/dashboard/new/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        We’re excited to roll out a new feature on your sponsor dashboard - the{' '}
        <strong>Auto Generate</strong> button, designed to create listings
        faster and easier than ever.
      </p>
      <br />
      <p style={styles.textWithMargin}>
        <b>What is "Auto Generate"?</b>
      </p>
      <p style={styles.textWithMargin}>
        Just pop in a few key details for your listing, hit the button, and boom
        – a complete listing is ready in <strong>under a minute!</strong> We
        handle the rest, crafting everything for you.
      </p>
      <br />
      <p style={styles.textWithMargin}>
        <b>Why does this matter?</b>
      </p>
      <p style={styles.textWithMargin}>
        Way less manual typing and thinking for you! Intelligently generates all
        key components of a listing, tailored to your needs and the chosen
        listing type. It helps you launch faster while maintaining quality and
        consistency.
      </p>
      <br />
      <p style={styles.textWithMargin}>
        Reach <strong>95,000+ talented folks</strong> in less than a minute.
        Create a new listing and check out Auto Generate in your Sponsor
        Dashboard today.
      </p>
      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'flex' }}
      >
        <div style={buttonStyle}>
          <p style={buttonTextStyle}>Try Now</p>
        </div>
      </a>
      <p style={styles.salutation}>
        Cheers,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
