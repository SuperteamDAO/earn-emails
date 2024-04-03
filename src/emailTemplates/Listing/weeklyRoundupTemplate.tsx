import React from 'react';

import { styles } from '../../utils/styles';

interface Reward {
  rewardAmount: number | null;
  compensationType: string;
  maxRewardAsk: number | null;
  minRewardAsk: number | null;
}
interface Bounty extends Reward {
  title: string;
  sponsor: string;
  slug: string;
  type: 'bounty' | 'project' | 'hackathon';
  token: string | null;
}

interface TemplateProps {
  name: string;
  bounties: Bounty[] | undefined;
}

export const WeeklyRoundupTemplate = ({ name, bounties }: TemplateProps) => {
  function getReward({
    compensationType,
    maxRewardAsk,
    minRewardAsk,
    rewardAmount,
  }: Reward) {
    const formatNumber = (number: number) =>
      new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
        number,
      );
    switch (compensationType) {
      case 'fixed':
        return rewardAmount !== null ? formatNumber(rewardAmount) : 'N/A';
      case 'variable':
        return 'Variable';
      case 'range':
        const minFormatted =
          minRewardAsk !== null ? formatNumber(minRewardAsk) : 'N/A';
        const maxFormatted =
          maxRewardAsk !== null ? formatNumber(maxRewardAsk) : 'N/A';
        return `${minFormatted} - ${maxFormatted}`;
    }
  }
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey there, {name}!</p>
      <p style={styles.textWithMargin}>
        Here&apos;s a weekly round-up of all live listings, curated just for
        you:
      </p>
      <ol>
        {bounties?.map((bounty, i) => (
          <li key={i} style={styles.text}>
            <a
              href={`https://earn.superteam.fun/listings/${bounty.type}/${
                bounty?.slug || ''
              }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
              style={styles.link}
            >
              {bounty.title} by {bounty.sponsor} (
              {getReward({
                compensationType: bounty?.compensationType,
                maxRewardAsk: bounty?.maxRewardAsk,
                minRewardAsk: bounty?.minRewardAsk,
                rewardAmount: bounty?.rewardAmount,
              })}{' '}
              {bounty?.token})
            </a>
          </li>
        ))}
      </ol>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.unsubscribe}>
        <a
          href="https://earn.superteam.fun/#emailPreferences"
          style={styles.unsubscribeLink}
        >
          Click here
        </a>{' '}
        to update your email preferences on Earn (recommended) or{' '}
        <a
          href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
          style={styles.unsubscribeLink}
        >
          click here
        </a>{' '}
        to unsubscribe from all future emails from Superteam Earn
      </p>
    </div>
  );
};
