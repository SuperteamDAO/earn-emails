import React from 'react';

import { UnsubscribeLine } from '@/components';

import { styles } from '../styles';

interface SubmissionProps {
  name: string;
  personName: string;
  link: string;
}

export const CommentTagTemplate = ({
  name,
  personName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} has tagged you in a comment on Superteam Earn.{' '}
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to check it out.
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
