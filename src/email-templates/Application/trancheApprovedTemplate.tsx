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
        <p style={styles.textWithMargin}>
          <strong>Note:</strong> Payments for this grant will be made in{' '}
          <a
            href="https://solscan.io/token/2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH"
            style={styles.link}
          >
            USDG
          </a>
          . If your wallet is not compatible with USDG, please reach out to us
          immediately. Once payments are sent for processing (on Monday noon
          UTC), we won't be able to update your wallet address.
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
        <p style={styles.textWithMargin}>
          <strong>Note :</strong> Les paiements pour cette subvention seront
          effectués en{' '}
          <a
            href="https://solscan.io/token/2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH"
            style={styles.link}
          >
            USDG
          </a>
          . Si votre portefeuille n'est pas compatible avec l'USDG, veuillez
          nous contacter immédiatement. Une fois les paiements envoyés pour
          traitement (lundi à midi UTC), nous ne pourrons plus mettre à jour
          l'adresse de votre portefeuille.
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
        <p style={styles.textWithMargin}>
          <strong>Lưu ý:</strong> Các khoản thanh toán cho tài trợ này sẽ được
          thực hiện bằng{' '}
          <a
            href="https://solscan.io/token/2u1tszSeqZ3qBWF3uNGPFc8TzMk2tdiwknnRMWGWjGWH"
            style={styles.link}
          >
            USDG
          </a>
          . Nếu ví của bạn không tương thích với USDG, vui lòng liên hệ với
          chúng tôi ngay lập tức. Sau khi các khoản thanh toán được gửi đi xử lý
          (vào trưa thứ Hai theo giờ UTC), chúng tôi sẽ không thể cập nhật địa
          chỉ ví của bạn.
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
