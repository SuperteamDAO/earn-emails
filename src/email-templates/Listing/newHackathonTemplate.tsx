import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface BreakoutSidetracksProps {
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

export const BreakoutSidetracksTemplate = ({
  name,
}: BreakoutSidetracksProps) => {
  const ctaLink =
    'https://earn.superteam.fun/hackathon/breakout/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  const imageUrl =
    'https://res.cloudinary.com/dgvnuwspr/image/upload/v1745912361/assets/hackathon/breakout/og-image.png';

  return (
    <div
      style={{
        ...styles.container,
        margin: '0 auto',
      }}
    >
      <img
        src={imageUrl}
        alt="Solana Breakout Hackathon Banner"
        style={imageStyle}
      />
      <p style={styles.greetings}>Hi {name},</p>

      <p style={styles.textWithMargin}>
        Are you already building for the global Solana Breakout hackathon? Then
        don’t leave money on the table!
      </p>

      <p style={styles.textWithMargin}>
        Superteam Earn is hosting 30+ sidetracks with extra rewards worth
        $300k+, <strong>on top of the official prize pool</strong> of the
        Breakout hackathon.
      </p>
      <p style={styles.textWithMargin}>
        Think of them as mini‑tracks you can enter potentially with the same
        project for a second shot at glory (and earnings). Each track has its
        own eligibility requirements — be sure to follow them.
      </p>

      <h3 style={{ ...styles.textWithMargin, marginTop: '25px' }}>
        Why bother with sidetracks?
      </h3>
      <ul style={{ ...styles.text, paddingLeft: '20px', marginTop: '10px' }}>
        <li style={{ marginBottom: '8px' }}>
          <strong>Double‑dip rewards:</strong> the same repo can win both
          Breakout and a sidetrack pot.
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Better odds:</strong> each Sidetrack has its own jury and
          smaller playing field.
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Recruiter magnet:</strong> sponsors are always scouting
          sidetrack winners for full‑time roles.
        </li>
      </ul>

      <p style={styles.textWithMargin}>
        Submission deadline is <strong>16 May 2025, 23:59 PST</strong> (same as
        the official Breakout hackathon).
      </p>

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}
      >
        <div style={buttonStyle}>
          <p style={buttonTextStyle}>Submit Now</p>
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
