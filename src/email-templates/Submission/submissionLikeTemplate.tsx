import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  newLikesCount: number;
  link: string;
}

export const SubmissionLikeTemplate = ({
  name,
  listingName,
  newLikesCount,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The community loves your <strong>{listingName}</strong>{' '}
        listing.{" "}{newLikesCount}{" "}{newLikesCount === 1 ? 'person has' : 'people have'}{" "} liked your work in the last 24 hours. Keep it up!
      </p>
      <p style={styles.textWithMargin}>
        Check out other contributions on our{" "}
        <a href={link} style={styles.link}>
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
