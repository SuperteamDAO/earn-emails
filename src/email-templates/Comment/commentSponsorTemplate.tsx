import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const CommentSponsorTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello {name},</p>
      <p style={styles.textWithMargin}>
        Your listing <strong>{listingName}</strong> just received a comment
        &mdash;{' '}
        <a href={link} style={styles.link}>
          check it out!
        </a>
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
