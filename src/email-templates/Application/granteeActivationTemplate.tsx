import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  projectTitle: string;
  ctaLink: string;
  userCount: number;
}

export const GranteeActivationTemplate = ({
  name,
  projectTitle,
  ctaLink,
  userCount,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Congratulations again for winning a grant for{' '}
        <span style={{ fontWeight: 700 }}>{projectTitle}</span>! This is only
        the beginning — the real work starts now.
      </p>
      <p style={styles.textWithMargin}>
        Every successful project needs some combination of marketing, content,
        design, and developer support. But reaching the right people is tough,
        and no one can do it all alone.
      </p>
      <p style={styles.textWithMargin}>
        The good news? There's a tool that can help you reach {userCount} Solana
        native freelancers, <span style={{ fontWeight: 700 }}>for free</span>.
        It's called Superteam Earn (might ring a bell).
      </p>
      <p style={styles.textWithMargin}>
        Instead of juggling everything yourself, you can:
      </p>
      <ul style={{ ...styles.textWithMargin, paddingLeft: '20px' }}>
        <li>Get designs, code, or content delivered within days</li>
        <li>Hire based on proof of work, not resumes</li>
        <li>Pay directly with your grant funds</li>
      </ul>
      <p style={styles.textWithMargin}>
        You've already secured the resources. Now, let's make sure you maximize
        them.
      </p>
      <div style={{ margin: '20px 0' }}>
        <a
          href={ctaLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: '#6366F1',
            color: 'white',
            padding: '10px 20px',
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
          Post Your First Listing Today
        </a>
      </div>
      <Salutation text="Best, Pratik" />
      <p style={{ ...styles.textWithMargin, fontStyle: 'italic' }}>
        PS: The best projects move quickly after funding. The sooner you get
        your first listing live, the faster your grant turns into results. Don't
        lose momentum — let the community help you build.
      </p>
      <UnsubscribeLine />
    </div>
  );
};
