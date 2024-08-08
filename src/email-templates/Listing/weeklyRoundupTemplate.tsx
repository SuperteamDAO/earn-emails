import React from 'react';
import { styles } from '../styles';
import { UnsubscribeLine } from '../../components';
import { basePath } from '../../constants';
import { CompensationType } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';

interface Skill {
  skills: string;
  subskills: string[];
}

interface Bounty {
  id: string;
  title: string;
  sponsor: string;
  slug: string;
  type: 'bounty' | 'project' | 'hackathon';
  token: string | null;
  skills: any;
  usdValue: number | null;
  rewardAmount: number | null;
  compensationType: CompensationType;
  maxRewardAsk: number | null;
  minRewardAsk: number | null;
}

interface TemplateProps {
  name: string;
  bounties: Bounty[];
  userSkills: Skill[];
}

const getReward = (bounty: Bounty) => {
  const formatNumber = (number: number) =>
    new Intl.NumberFormat('en-US', { maximumSignificantDigits: 3 }).format(
      number,
    );

  switch (bounty.compensationType) {
    case 'fixed':
      return bounty.rewardAmount !== null
        ? formatNumber(bounty.rewardAmount)
        : 'N/A';
    case 'variable':
      return 'Variable';
    case 'range':
      const minFormatted =
        bounty.minRewardAsk !== null
          ? formatNumber(bounty.minRewardAsk)
          : 'N/A';
      const maxFormatted =
        bounty.maxRewardAsk !== null
          ? formatNumber(bounty.maxRewardAsk)
          : 'N/A';
      return `${minFormatted} - ${maxFormatted}`;
  }
};

const BountyItem = ({ bounty }: { bounty: Bounty }) => (
  <li style={styles.text}>
    <div>
      <a
        href={`${basePath}/listings/${bounty.type}/${
          bounty.slug || ''
        }/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
        style={styles.link}
      >
        {bounty.title}
      </a>{' '}
      by {bounty.sponsor} ({getReward(bounty)} {bounty.token})
    </div>
  </li>
);

export const WeeklyRoundupTemplate = ({
  name,
  bounties,
  userSkills,
}: TemplateProps) => {
  const groupedBounties: Record<string, Bounty[]> = {};
  const usedBounties = new Set<string>();

  userSkills.forEach((userSkill) => {
    const skillBounties = bounties.filter(
      (bounty) =>
        bounty.skills.some(
          (skill: Skill) => skill.skills === userSkill.skills,
        ) && !usedBounties.has(bounty.id),
    );

    if (skillBounties.length > 0) {
      groupedBounties[userSkill.skills] = skillBounties.sort(
        (a, b) => (b.usdValue || 0) - (a.usdValue || 0),
      );
      skillBounties.forEach((bounty) => usedBounties.add(bounty.id));
    }
  });

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey there, {name}!</p>
      <p style={styles.textWithMargin}>
        Here's a weekly round-up of all live listings, curated just for you:
      </p>

      {Object.entries(groupedBounties).map(([skill, skillBounties]) => (
        <div key={skill}>
          <h2
            style={{
              fontSize: '15px',
              lineHeight: '18px',
              fontWeight: 'semibold',
              marginTop: '16px',
            }}
          >
            {skill}
          </h2>
          <ol>
            {skillBounties.map((bounty) => (
              <BountyItem key={bounty.id} bounty={bounty} />
            ))}
          </ol>
        </div>
      ))}

      <p style={styles.text}>
        Hope to see you participate in (and hopefully win!) some of these :)
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
