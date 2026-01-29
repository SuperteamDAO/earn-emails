import React from 'react';

import { Salutation } from '../components/Salutation';
import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const KalshiGrantsTemplate = ({ name }: TemplateProps) => {
  const ctaLink = `https://superteam.fun/earn/grants/kalshi-grants?utm_source=Email&utm_medium=Kalshi%20Grant&utm_campaign=Email`;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name || 'there'},</p>
      <p style={styles.textWithMargin}>
        Your Pro status has unlocked a new grant! Kalshi's Builder Codes Grant
        is live and available exclusively to Pro members for a limited time.
      </p>
      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', margin: '20px 0' }}
      >
        <img
          src="https://res.cloudinary.com/dgvnuwspr/image/upload/assets/emails/Kalshi_x_earn.jpg"
          alt="Kalshi x Earn - $2M+ in Total Funding"
          style={{
            display: 'block',
            maxWidth: '100%',
            height: 'auto',
            borderRadius: '8px',
          }}
        />
      </a>
      <p style={styles.textWithMargin}>
        Kalshi is the liquidity layer for real-world prediction markets,
        enabling developers to build products on top of markets for elections,
        inflation, weather, and other macro events.
      </p>
      <p style={styles.textWithMargin}>
        Beyond the grant funding, you get direct support from the Kalshi team,
        including engineering guidance, priority API access, and marketing
        amplification.
      </p>
      <p style={styles.textWithMargin}>
        You can build trading bots, analytics dashboards, data and visualisation
        tools, mobile apps, browser extensions, or any product that leverages
        prediction market data. Builders get to keep up to 30% of user-generated
        fees too!
      </p>
      <p style={styles.textWithMargin}>
        Remember, Pro users get exclusive access, but only for limited amount of
        time:
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
          Apply now
        </a>
      </div>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
