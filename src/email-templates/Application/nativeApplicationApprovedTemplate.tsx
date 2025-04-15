import { type GrantApplication, type Grants } from '@prisma/client';
import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { basePath } from '../../constants/basePath';
import { formatNumber } from '../../utils/formatNumber';
import { styles } from '../styles';

interface ApplicationApprovedProps {
  name: string;
  application: GrantApplication;
  grant: Grants;
  salutation: string | null;
}

export const NativeApplicationApprovedTemplate = ({
  name,
  application,
  grant,
  salutation,
}: ApplicationApprovedProps) => {
  const { title, token, slug } = grant;
  const { projectTitle, approvedAmount, approvedAmountInUSD } = application;
  const amount = formatNumber(approvedAmount);

  let trancheAmount = approvedAmount / 2;
  if (approvedAmountInUSD > 5000) {
    trancheAmount = approvedAmount * 0.3;
  }
  const trancheAmountFormatted = formatNumber(trancheAmount);

  const grantPageLink = basePath + '/grants/' + slug;

  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hi {name},</p>
      <p style={styles.textWithMargin}>
        Your application to {title} for <strong>{projectTitle}</strong> has been
        approved for {amount} {token}. Congratulations!
      </p>
      <p style={styles.textWithMargin}>
        To receive your first tranche ({trancheAmountFormatted} {token}), please
        complete KYC verification from the{' '}
        <a href={grantPageLink}>grant listing page</a>. Please ignore this if
        you have already completed KYC verification on Earn before.
      </p>

      <p style={styles.textWithMargin}>
        Once you receive your first tranche and make significant progress on
        your project, share an update to claim your next tranche from the{' '}
        <a href={grantPageLink}>grant listing page</a>.
      </p>

      <Salutation text={salutation ?? 'Best, Superteam Earn'} />
      <UnsubscribeLine />
    </div>
  );
};
