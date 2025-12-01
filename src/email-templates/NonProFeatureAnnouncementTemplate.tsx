import React from 'react';

import { Salutation } from '../components/Salutation';
import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const NonProFeatureAnnouncementTemplate = ({ name }: TemplateProps) => {
  const ctaLink = `https://earn.superteam.fun/pro/eligibility?utm_source=superteamearn&utm_medium=email&utm_campaign=pro_announcement`;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name || 'there'},</p>
      <p style={styles.textWithMargin}>
        Today we're launching <strong>Earn Pro</strong> — a new tier of
        <strong>high-value bounties and exclusive perks</strong> reserved for
        our most accomplished contributors. At launch, Earn Pro already includes
        $10k+ in live bounties and perks worth thousands of dollars.
      </p>
      <p style={styles.textWithMargin}>
        Earn Pro offers higher payouts and far less competition, and is
        available only to users who've contributed meaningfully on Earn or are
        Superteam Members.
      </p>
      <p style={styles.textWithMargin}>
        Click below to sign in and instantly see whether you're eligible — and
        how to become a Pro member if you're not there yet:
      </p>
      <div style={{ margin: '20px 0' }}>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#6366F1',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '6px',
            border: 'none',
            fontWeight: 500,
            fontSize: '14px',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block',
            textAlign: 'center',
          }}
          onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Check Pro Eligibility
        </a>
      </div>
      <p style={styles.textWithMargin}>
        We built Earn Pro to show what's possible when you invest in your craft,
        ship consistently, and grow within the community. We'd love to see you
        unlock this tier soon.
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
