import React from 'react';

import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';

interface SubmissionProps {
  name: string;
  listingName: string;
  type: 'bounty' | 'project' | 'hackathon';
}

export const SubmissionTemplate = ({
  name,
  listingName,
  type,
}: SubmissionProps) => {
  const isProject = type === 'project';
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      {isProject ? (
        <>
          <p style={styles.textWithMargin}>
            Nice work! Your application for <strong>{listingName}</strong> has
            been received. Pour yourself a glass of something tasty —
            you&apos;ve earned it 🥳
          </p>
          <p style={styles.textWithMargin}>
            We&rsquo;ll notify you via email once the winner (hopefully you) is
            announced!
          </p>
        </>
      ) : (
        <>
          <p style={styles.textWithMargin}>
            Nice work! Your submission for <strong>{listingName}</strong> has
            been received. Pour yourself a glass of something tasty &mdash;
            you&rsquo;ve earned it 🥳
          </p>
          <p style={styles.textWithMargin}>
            We&rsquo;ll notify you via email once the winners (hopefully
            including you) are announced!
          </p>
        </>
      )}
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
