import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface RedactedHackathonProps {
  name: string;
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

export const RedactedHackathonTemplate = ({ name }: RedactedHackathonProps) => {
  const ctaLink =
    'https://earn.superteam.fun/hackathon/redacted/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>

      <p style={styles.textWithMargin}>
        The countdown is getting intense — just 7 days left to submit to the
        $170K+ [REDACTED] hackathon. [REDACTED] is a virtual competition by{' '}
        <strong>Helius</strong>, bringing together analysts, security
        researchers, and on-chain sleuths from across crypto.
      </p>

      <h3 style={{ ...styles.textWithMargin, marginTop: '25px' }}>
        Who It’s For
      </h3>
      <ul style={{ ...styles.text, paddingLeft: '20px', marginTop: '10px' }}>
        <li style={{ marginBottom: '8px' }}>
          <strong>On‑chain sleuths</strong> hunting fraud and fake activity
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Data & security engineers</strong> who specialise in making
          analytics and monitoring dashboards
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Curious data analysts from web2</strong> looking to break into
          crypto
        </li>
      </ul>

      <h3 style={{ ...styles.textWithMargin, marginTop: '25px' }}>
        Why You Should Participate
      </h3>
      <ul style={{ ...styles.text, paddingLeft: '20px', marginTop: '10px' }}>
        <li style={{ marginBottom: '8px' }}>
          <strong>Massive upside</strong> – over $170K in prizes across 38
          tracks
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Proof of work</strong> – catch the eye of sponsors actively
          scouting for future gigs/jobs
        </li>
        <li style={{ marginBottom: '8px' }}>
          <strong>Real impact</strong> – your work strengthens trust and
          transparency across the Solana ecosystem.
        </li>
      </ul>

      <p style={styles.textWithMargin}>
        The Solana ecosystem has grown in size tremendously in the last year –
        which has caught the attention of good and bad actors alike. Help us
        make the ecosystem more secure and transparent by exposing fraudulent
        and fake activity.
      </p>

      <p style={styles.textWithMargin}>
        And of course, to get yourself a good chunk of those big rewards!
      </p>

      <a href={ctaLink} target="_blank">
        <div style={buttonStyle}>
          <p style={buttonTextStyle}>Submit Now</p>
        </div>
      </a>

      <p style={styles.textWithMargin}>
        See you on the leaderboard,
        <br />
        Superteam Earn
      </p>

      <p style={styles.text}>&nbsp;</p>

      <UnsubscribeLine />
    </div>
  );
};
