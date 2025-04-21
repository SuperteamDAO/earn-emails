import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { formatNumber } from '../../utils/formatNumber';
import { styles } from '../styles';

interface TrancheApprovedProps {
  name: string;
  projectTitle: string;
  sponsorName: string;
  approvedTrancheAmount: number | null;
  token: string;
  salutation: string | null;
  language: string;
}

export const TrancheApprovedTemplate = ({
  name,
  projectTitle,
  sponsorName,
  approvedTrancheAmount,
  token,
  salutation,
  language,
}: TrancheApprovedProps) => {
  const formattedAmount = formatNumber(approvedTrancheAmount ?? 0);

  const templates = {
    en: (
      <>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Your tranche request for <strong>{projectTitle}</strong> has been
          accepted by {sponsorName} for{' '}
          <strong>
            {formattedAmount} {token}
          </strong>
          . Congratulations! You should receive your payment in a few days.
        </p>
      </>
    ),
    fr: (
      <>
        <p style={styles.greetings}>Bonjour {name},</p>
        <p style={styles.textWithMargin}>
          Votre demande de tranche pour <strong>{projectTitle}</strong> a été
          acceptée par {sponsorName} pour un montant de{' '}
          <strong>
            {formattedAmount} {token}
          </strong>
          . Félicitations ! Vous devriez recevoir le paiement dans quelques
          jours.
        </p>
      </>
    ),
    vi: (
      <>
        <p style={styles.greetings}>Chào {name},</p>
        <p style={styles.textWithMargin}>
          Yêu cầu giải ngân cho dự án <strong>{projectTitle}</strong> của bạn đã
          được {sponsorName} chấp thuận với số tiền{' '}
          <strong>
            {formattedAmount} {token}
          </strong>
          . Xin chúc mừng! Bạn sẽ nhận được khoản thanh toán trong vài ngày tới.
        </p>
      </>
    ),
  };

  const content = templates[language as keyof typeof templates] || templates.en;

  return (
    <div style={styles.container}>
      {content}
      <Salutation text={salutation ?? 'Best, Superteam Earn'} />
      <UnsubscribeLine />
    </div>
  );
};
