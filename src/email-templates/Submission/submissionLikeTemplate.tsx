import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  newLikesCount: number;
  type: string;
  listingLink: string;
  feedLink: string;
}

export const SubmissionLikeTemplate = ({
  name,
  listingName,
  newLikesCount,
  type,
  listingLink,
  feedLink,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The community loves your{' '}
        <a href={listingLink} style={styles.link}>
          {listingName}
        </a>{' '}
        <strong>
          {type}
        </strong>
        .{" "}{newLikesCount}{" "}{newLikesCount === 1 ? 'person has' : 'people have'}{" "} liked your work in the last 24 hours. Keep it up!
      </p>
      <p style={styles.textWithMargin}>
        Check out other contributions on our{" "}
        <a href={feedLink} style={styles.link}>
          Activity Feed
        </a>{" "}
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
