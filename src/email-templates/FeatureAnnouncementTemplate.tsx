import React from 'react';

import { UnsubscribeLine } from '../components/unsubscribeLine';
import { styles } from './styles';

interface TemplateProps {
  name: string | null;
}

export const FeatureAnnouncementTemplate = ({ name }: TemplateProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hey {name},</p>
      <p style={styles.textWithMargin}>
        We're introducing a new feature called{' '}
        <strong>Submission Credits</strong>, to help improve the quality of
        submissions and keep Earn valuable for everyone.
      </p>
      <p style={styles.textWithMargin}>
        Starting this month, you’ll now have submission credits to help you
        prioritize your best submissions across bounties and projects. It’s a
        simple system designed to raise the bar for quality of submissions and
        reduce overall spam.
      </p>
      <p style={styles.textWithMargin}>
        <b>Why the shift?</b>
      </p>
      <p style={styles.textWithMargin}>
        We’ve been seeing an incredible surge in submissions lately and we love
        the energy! But with volume comes variance: not every submission brings
        real value to the table, and that can slow things down for sponsors and
        hinder other participants.
      </p>
      <p style={styles.textWithMargin}>
        Submission Credits are our way of encouraging quality, rewarding
        thoughtful contributors and making sure Earn stays valuable for everyone
        involved.
      </p>
      <p style={styles.textWithMargin}>
        <b>How does it work?</b>
      </p>
      <p style={styles.textWithMargin}>
        <ol type="1">
          <li style={styles.text}>
            <strong>Monthly credits:</strong> Every user starts with 3
            submission credits each month.
          </li>
          <li style={styles.text}>
            <strong>Using credits:</strong> Each submission uses up 1 credit.
          </li>
          <li style={styles.text}>
            <strong>Bonuses and deductions:</strong>
            <ul>
              <li style={styles.text}>
                For every winning submission in a month, you will earn 1 extra
                credit the following month
              </li>
              <li style={styles.text}>
                If your submission is marked as spam by the sponsor/reviewer, 1
                credit will be deducted the following month
              </li>
            </ul>
          </li>
        </ol>
      </p>
      <p style={styles.text}>
        Note: Your credits refresh automatically on the 1st of every month.
      </p>
      <p style={styles.textWithMargin}>
        You can check your available credits and credit history from the credits
        icon on the top right of your screen (next to the wallet icon).
      </p>
      <p style={styles.textWithMargin}>
        If you’d like to learn more,{' '}
        <a
          href="https://superteamdao.notion.site/Submission-Credits-User-Guide-17b794d3ba33804392f9e1c613eff9a0?pvs=4"
          style={styles.link}
        >
          here’s a detailed guide
        </a>
        . If you’ve still got questions, we’re here to help — please reach out
        to support@superteamearn.com with your questions.
      </p>
      <p style={styles.text}>Keep stacking wins!</p>
      <p style={styles.salutation}>
        Cheers,
        <br />
        Superteam Earn
      </p>
      <UnsubscribeLine />
    </div>
  );
};
