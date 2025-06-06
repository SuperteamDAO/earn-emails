import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  powName: string;
  newLikesCount: number;
  feedLink: string;
}

export const PoWLikeTemplate = ({
  name,
  powName,
  feedLink,
  newLikesCount,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The community loves your <strong>{powName}</strong>{' '}
        <strong>Personal Project</strong>. {newLikesCount}{' '}
        {newLikesCount === 1 ? 'person has' : 'people have'} liked your work in
        the last 24 hours. Keep it up!
      </p>
      <p style={styles.textWithMargin}>
        Check out other contributions on our{' '}
        <a href={feedLink} style={styles.link}>
          Activity Feed
        </a>{' '}
        and spread some love to the other contributors :)
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
