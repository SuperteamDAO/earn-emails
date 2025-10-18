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
    'https://earn.superteam.fun/listing/asi-agents-track/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  const imageUrl =
    'https://res.cloudinary.com/dgvnuwspr/image/upload/v1760789795/assets/hackathon/cypherpunk/asi-sidetrack.png';

  return (
    <div
      style={{
        ...styles.container,
        margin: '0 auto',
      }}
    >
      <a href={ctaLink} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt="ASI Agents Track!" style={imageStyle} />
      </a>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        The ASI Agents Track is live! It has a{' '}
        <strong>$20,000 prize pool</strong> for builders pushing the limits of
        on-chain autonomy.
      </p>

      <p style={styles.textWithMargin}>
        Your mission: design and deploy <strong>Solana-native agents</strong>{' '}
        that can observe, decide, and act without human input. Think
        coordination, intelligence, and automation — all running trustlessly
        on-chain.
      </p>

      <p style={styles.textWithMargin}>
        If you've been looking to build in the AI x Crypto space (and get a
        serious reward for it), this is it.
      </p>

      <p style={styles.textWithMargin}>
        <strong>Deadline</strong>: October 31, 7 AM UTC.
      </p>

      <p style={styles.textWithMargin}>
        Build something that thinks for itself.
      </p>

      <a
        href={ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{ marginLeft: 'auto', marginRight: 'auto', display: 'flex' }}
      >
        <div style={buttonStyle}>
          <p style={buttonTextStyle}>Learn More</p>
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
