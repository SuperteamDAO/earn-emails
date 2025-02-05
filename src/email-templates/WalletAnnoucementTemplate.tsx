import React from 'react';

import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const WalletAnnouncementTemplate = ({ name }: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Big news: we’re making earning simpler and more secure with the
        introduction of the embedded Earn Wallet. From now on, all your rewards
        will be sent to this new, easy-to-use wallet — accessible directly from
        your Earn profile!
      </p>
      <p style={styles.textWithMargin}>
        <b>Why the upgrade?</b>
      </p>
      <p style={styles.textWithMargin}>
        <ul>
          <li style={styles.text}>
            We wanted to make things simpler — no extensions to install, no
            passwords to remember, and no worries about entering the wrong
            address. Just log in to Earn to access or withdraw your rewards.
          </li>
          <li style={styles.text}>
            Wallets have already been pre-generated and assigned for all
            existing users — no action needed on your end!
          </li>
          <li style={styles.text}>
            It’s more secure, with funds protected by{' '}
            <a href="https://privy.io" style={styles.link}>
              Privy
            </a>{' '}
            — a trusted partner backed by regular audits and industry-leading
            security. Plus, this wallet is non-custodial, meaning only you have
            access to its funds — neither we nor Privy have any control over it.
          </li>
        </ul>
        <p style={styles.textWithMargin}>
          <b>What's new?</b>
          <ul>
            <li style={styles.text}>
              Easy payments: Whenever the sponsor pays out your winnings, the
              funds will appear in your Earn wallet.
            </li>
            <li style={styles.text}>
              Withdraw anytime: Move your funds to any wallet of your choice,
              whenever you want.
            </li>
          </ul>
        </p>
      </p>
      <p style={styles.text}>
        <a href="https://app.superteam.xyz/earn" style={styles.link}>
          Check out your wallet
        </a>
      </p>
      <p style={styles.text}>
        If you’ve got questions, we’re here to help! Reach out to
        support@superteamearn.com with your questions.
      </p>
      <p style={styles.salutation}>
        Cheers,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
