import React from 'react';

import { UnsubscribeLine } from '../../components';
import { styles } from '../styles';

interface NewListingProps {
  name: string;
  link: string;
  listingTitle: string;
  listingType: string;
}

export const NewListingTemplate = ({
  name,
  link,
  listingTitle,
  listingType,
}: NewListingProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Good news &mdash; a new&nbsp;{listingType} called{' '}
        <a href={link} style={styles.link}>
          {listingTitle}
        </a>{' '}
        has just arrived with your name on it. It&apos;s like finding extra
        money in your pocket, but way more exciting!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to learn more about this {listingType}.
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
