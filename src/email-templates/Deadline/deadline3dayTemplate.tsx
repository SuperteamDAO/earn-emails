import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const DeadlineThreeDaysTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Friendly reminder that &quot;
        <span style={{ fontWeight: 400 }}>
          <a href={link} style={styles.link}>
            {listingName}
          </a>
        </span>
        &quot; you&nbsp;had indicated&nbsp; will close in 3 days!
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
