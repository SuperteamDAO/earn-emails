import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
}

export const WinnersAnnouncedTemplate = ({
  name,
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        The winners for the <strong>{listingName}</strong> listing have been
        announced!{' '}
        <p style={styles.text}>
          <a href={link} style={styles.link}>
            Click here
          </a>{' '}
          to see who claimed the top spots.
        </p>
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
