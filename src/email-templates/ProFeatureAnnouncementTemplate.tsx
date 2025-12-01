import React from 'react';

import { Salutation } from '../components/Salutation';
import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const ProFeatureAnnouncementTemplate = ({ name }: TemplateProps) => {
  const ctaLink = `https://earn.superteam.fun/pro?utm_source=superteamearn&utm_medium=email&utm_campaign=pro_announcement`;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name || 'there'},</p>
      <p style={styles.textWithMargin}>
        Congrats — you're now the founding member of <strong>Earn Pro</strong>,
        the top tier on Earn which unlocks exclusive high-paying bounties and
        premium perks. At launch, Earn Pro already includes $100k+ in live
        bounties and perks.
      </p>
      <p style={styles.textWithMargin}>
        You're in the top ~1% of Earn users who qualify.
      </p>
      <p style={styles.textWithMargin}>With Earn Pro, you now unlock:</p>
      <ul style={styles.textWithMargin}>
        <li style={{ marginBottom: '8px' }}>Exclusive, high-value listings</li>
        <li style={{ marginBottom: '8px' }}>
          Far less competition → higher win probability
        </li>
        <li style={{ marginBottom: '8px' }}>Premium-tier payouts</li>
        <li style={{ marginBottom: '8px' }}>
          A dedicated Pro badge across Earn
        </li>
      </ul>
      <p style={styles.textWithMargin}>
        Click below to access all Pro listings and perks:
      </p>
      <div style={{ margin: '20px 0' }}>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#000000',
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
          Upgrade to Pro
        </a>
      </div>
      <p style={styles.textWithMargin}>Thank you for setting the standard.</p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
