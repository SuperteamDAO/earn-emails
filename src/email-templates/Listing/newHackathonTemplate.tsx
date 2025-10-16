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
    'https://earn.superteam.fun/listing/arciums-encrypted-side-track/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  const imageUrl =
    'https://res.cloudinary.com/dgvnuwspr/image/upload/v1759759179/listing-description/qu9zg1u4j3kvvpk0igvk.png';

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
          alt="Arcium's Encrypted Side Track!"
          style={imageStyle}
        />
      </a>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Arcium is offering $20,000 in rewards — as one of the biggest sidetracks
        on Earn — for Solana devs to integrate Arcium's encrypted compute into a
        new or existing Solana project.
      </p>

      <p style={styles.textWithMargin}>
        This is your chance to work on cutting-edge on-chain privacy, showcase
        your skills, and boost your Solana career building core infrastructure.
      </p>

      <p style={styles.textWithMargin}>
        <strong>Deadline</strong>: October 31, 7 AM UTC.
      </p>

      <p style={styles.textWithMargin}>
        Build for privacy. Use Arcium. Earn thousands of dollars in rewards.
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
