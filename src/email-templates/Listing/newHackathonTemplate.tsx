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
    'https://earn.superteam.fun/listing/dollar50000-in-security-audit-credits-for-solana-colosseum-hackathon/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications';
  const imageUrl =
    'https://res.cloudinary.com/dgvnuwspr/image/upload/v1760860835/assets/hackathon/cypherpunk/adevar-sidetrack.png';

  return (
    <div
      style={{
        ...styles.container,
        margin: '0 auto',
      }}
    >
      <a href={ctaLink} target="_blank" rel="noopener noreferrer">
        <img src={imageUrl} alt="Adevar Labs Track!" style={imageStyle} />
      </a>
      <p style={styles.greetings}>Hey {name},</p>

      <p style={styles.textWithMargin}>
        Adevar Labs is offering{' '}
        <strong>$50,000 in security audit credits</strong> to projects that
        submit to the official Cypherpunk Hackathon.
      </p>

      <p style={styles.textWithMargin}>
        If you're building something serious on Solana and submitting to the
        official Cypherpunk hackathon — a protocol, DeFi app, or infrastructure
        project — this is your chance to <strong>get audited and secure</strong>{' '}
        for a fraction of the cost.
      </p>

      <p style={styles.textWithMargin}>
        These credits can cover professional audits for winning projects,
        helping you ship production-ready code with confidence.
      </p>

      <p style={styles.textWithMargin}>
        <strong>Deadline:</strong> October 31, 7 AM UTC.
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
