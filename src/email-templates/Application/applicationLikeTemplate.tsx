import React from 'react';

import { UnsubscribeLine } from '@/components';

import { styles } from '../styles';

interface TemplateProps {
  name: string;
  grantName: string;
  newLikesCount: number;
  grantLink: string;
  feedLink: string;
}

export const ApplicationLikeTemplate = ({
  name,
  grantName,
  grantLink,
  feedLink,
  newLikesCount,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The community loves your{' '}
        <a href={grantLink} style={styles.link}>
          {grantName}
        </a>{' '}
        <strong>Grant Win</strong>. {newLikesCount}{' '}
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
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
