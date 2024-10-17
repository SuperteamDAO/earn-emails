import React from 'react';

import { UnsubscribeLine } from '@/components';

import { styles } from '../styles';

interface TemplateProps {
  name: string;
  listingName: string;
  link: string;
  submissionCount: number;
  listingLink: string;
  listingType: 'bounty' | 'project' | 'hackathon';
}

export const SubmissionSponsorTemplate = ({
  name,
  listingName,
  link,
  submissionCount,
  listingLink,
  listingType,
}: TemplateProps) => {
  const word = listingType === 'bounty' ? 'submission(s)' : 'application(s)';
  const projectNote =
    listingType === 'project'
      ? 'Additionally, you can reject applications before announcing the winner as well.'
      : '';

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Friendly note to inform you that your {listingType}{' '}
        <strong>
          <a href={listingLink}>{listingName}</a>
        </strong>{' '}
        has received {submissionCount} {word} in the last 24 hours.
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review them from your dashboard. You can also add submission labels
        and notes to these {word} right now, to announce winners swiftly later.{' '}
        {projectNote}
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
