import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface HackathonProps {
  name: string;
  link?: string;
}

export const MobiusHackathonTemplate = ({
  name,
  link = 'https://earn.superteam.fun/hackathon/mobius/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications',
}: HackathonProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The clock is ticking—submissions for the <strong>$1 million</strong>{' '}
        <a href={link} style={styles.link}>
          Mobius Hackathon
        </a>{' '}
        are now live on Superteam Earn!
      </p>
      <p style={styles.textWithMargin}>
        Submit your projects before March 17 and showcase what you’ve built in
        the Mobius Hackathon. Categories include Attention Capital Markets,
        DeFi, AI, and Gaming.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to view the tracks and submit.
      </p>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.text}>&nbsp;</p>
      <UnsubscribeLine />
    </div>
  );
};
