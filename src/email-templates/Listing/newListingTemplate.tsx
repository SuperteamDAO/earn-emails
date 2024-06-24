import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface NewListingProps {
  name: string;
  link: string;
  sponsorName: string;
}

export const NewListingTemplate = ({
  name,
  link,
  sponsorName,
}: NewListingProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Good news &mdash; there&apos;s a newly added listing by {sponsorName},
        made just for you.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to learn about it.
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
