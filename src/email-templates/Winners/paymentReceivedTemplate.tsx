import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { styles } from '../styles';

interface TemplateProps {
  name: string | null;
  amount: number;
  tokenName: string | null;
  username: string | null;
}

export const PaymentReceivedTemplate = ({
  name,
  amount,
  tokenName,
  username,
}: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        Do you know what just happened?! You just managed to turn your talent
        into some glorious crypto.{' '}
        <a href={`${basePath}/#wallet`} style={styles.link}>
          Check your wallet on Earn
        </a>{' '}
        — you should&apos;ve received {amount} {tokenName}.
      </p>
      <p style={styles.textWithMargin}>
        Wondering what you can do with your rewards? We've got you covered!{' '}
        <a
          href="https://superteamdao.notion.site/using-your-earn-wallet"
          className="flex items-center text-xs font-normal text-slate-400 underline"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.link}
        >
          Learn more here
        </a>
        .
      </p>
      <p style={styles.textWithMargin}>
        Also, we bet your network would love to hear about your success. Why not
        take a moment to admire the win on your profile and share it on Twitter?{' '}
        <a
          href={`${basePath}/t/${username}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`}
          style={styles.link}
        >
          Click here
        </a>{' '}
        to check it out, and tell the world about it!
      </p>
      <Salutation />
      <UnsubscribeLine />
    </div>
  );
};
