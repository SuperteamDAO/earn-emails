import React from 'react';

import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { formatNumber } from '../../utils/formatNumber';
import { styles } from '../styles';

interface ScoutReminderProps {
  name: string;
  link: string;
  listingName: string;
  invitesLeft: number;
  totalMatchedUSD: number;
  type: string;
}

export const ScoutReminderTemplate = ({
  name,
  link,
  listingName,
  invitesLeft,
  totalMatchedUSD,
  type,
}: ScoutReminderProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.text}>
        If you haven't tried Earn Scout yet for {type} {listingName}, {`you're`}{' '}
        <strong>missing out on the best talent</strong> on Earn. This elite
        group of users, handpicked for your {type}, has earned a total of $
        {formatNumber(totalMatchedUSD)} from similar work on Earn!
      </p>
      <p style={styles.textWithMargin}>
        <a href={link} style={styles.link}>
          Click here
        </a>{' '}
        to review the profiles of these chads and invite them. {invitesLeft}{' '}
        invites left!
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
