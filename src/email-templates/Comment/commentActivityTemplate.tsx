import { type CommentRefType } from '@prisma/client';
import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ActivityProps {
  name: string;
  personName: string;
  link: string;
  type: CommentRefType;
  isProject?: boolean;
}

function typeCopy(
  type: CommentRefType,
  isProject?: boolean,
): React.JSX.Element | null {
  switch (type) {
    case 'POW':
      return <>just left a new comment on your personal project.</>;
    case 'SUBMISSION':
      return (
        <>
          just left a new comment on your{' '}
          {isProject ? 'application' : 'submission'}.
        </>
      );
    case 'GRANT_APPLICATION':
      return <>just left a new comment on your grant application.</>;
    default:
      return <></>;
  }
}

export const CommentActivityTemplate = ({
  name,
  personName,
  link,
  type,
  isProject,
}: ActivityProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} {typeCopy(type, isProject)}{' '}
        <a href={link} style={styles.link}>
          Click here to see what they said!
        </a>{' '}
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
