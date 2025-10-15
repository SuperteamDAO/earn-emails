import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface CypherpunkSidetracksProps {
  name: string;
}

const buttonStyle: React.CSSProperties = {
  display: 'inline-block',
  padding: '12px 24px',
  margin: '20px auto',
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

const imageStyle: React.CSSProperties = {
  display: 'block',
  marginLeft: 'auto',
  marginRight: 'auto',
  marginBottom: '25px',
  maxWidth: '600px',
  height: 'auto',
};

export const CypherpunkSidetracksTemplate = ({
  name,
}: CypherpunkSidetracksProps) => {
  const ctaLink =
    'https://earn.superteam.fun/hackathon/cypherpunk/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  const imageUrl =
    'https://res.cloudinary.com/dgvnuwspr/image/upload/v1745912361/assets/hackathon/cypherpunk/email';

  return (
    <div
      style={{
        ...styles.container,
        margin: '0 auto',
      }}
    >
      <a href={ctaLink} target="_blank" rel="noopener noreferrer">
        <img
          src={imageUrl}
          alt="Solana Cypherpunk Hackathon is here!"
          style={imageStyle}
        />
      </a>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        We're looking for builders like you to submit to{' '}
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#6466F1', textDecoration: 'underline' }}
        >
          Cypherpunk Sidetracks
        </a>{' '}
        on Earn — with over <strong>$300,000 in prizes</strong> up for grabs.
      </p>

      <p style={styles.textWithMargin}>
        Sidetracks are bounties that run parallel to the main Cypherpunk
        hackathon. They're sponsor-backed challenges built around specific
        protocols and real-world use cases. It's your chance to build something
        meaningful, get noticed by top ecosystem teams, and get rewarded for it.
      </p>

      <h3 style={{ ...styles.textWithMargin, marginTop: '25px' }}>
        Highlights include:
      </h3>
      <ul style={{ ...styles.text, paddingLeft: '20px', marginTop: '10px' }}>
        <li style={{ marginBottom: '8px' }}>
          $20,000 from Arcium for building encrypted privacy infrastructure
        </li>
        <li style={{ marginBottom: '8px' }}>
          $20,000 from ASI for Solana-native autonomous agents
        </li>
        <li style={{ marginBottom: '8px' }}>
          $50,000 in security credits from Adevar Labs
        </li>
      </ul>

      <p style={styles.textWithMargin}>
        ..and many more tracks. Each track has its own rewards, scope, and
        judging panel.
      </p>

      <p style={styles.textWithMargin}>
        <strong>All submissions close on October 31, 7 AM UTC.</strong>
      </p>

      <p style={styles.textWithMargin}>
        This is your moment to build, ship, and stand out in the Cypherpunk era
        of Solana.
      </p>

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}
      >
        <div style={buttonStyle}>
          <p style={buttonTextStyle}>Browse Sidetracks</p>
        </div>
      </a>

      <p style={styles.textWithMargin}>
        Wishing you all the best,
        <br />
        Superteam Earn
      </p>

      <UnsubscribeLine />
    </div>
  );
};
