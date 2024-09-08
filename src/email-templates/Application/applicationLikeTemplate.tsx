import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  sponsorName: string;
  link: string;
}

export const ApplicationLikeTemplate = ({
  name,
  sponsorName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        People are digging that you won a grant by <strong>{sponsorName}</strong>{' '}
      </p>
      <p style={styles.textWithMargin}>
        Check out our{" "}
        <a href={link} style={styles.link}>
          Activity Feed
        </a>{" "}and give back some love to the community :)
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
