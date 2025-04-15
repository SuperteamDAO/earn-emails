import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TemplateProps {
  listingName: string;
  link: string;
}

export const DeadlineExtendedTemplate = ({
  listingName,
  link,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello,</p>
      <p style={styles.textWithMargin}>
        Quick heads up – the deadline for the{' '}
        <a href={link} style={styles.link}>
          {listingName}
        </a>{' '}
        listing has been updated. Check it out and adjust your plans
        accordingly!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
