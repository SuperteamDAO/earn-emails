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
  language: string;
}

export const NativeApplicationApprovedTemplate = ({
  name,
  application,
  grant,
  salutation,
  language,
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

  const templates = {
    en: (
      <>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Your application to {title} for <strong>{projectTitle}</strong> has
          been approved for {amount} {token}. Congratulations!
        </p>
        <p style={styles.textWithMargin}>
          To receive your first tranche ({trancheAmountFormatted} {token}),
          please complete KYC verification from the{' '}
          <a href={grantPageLink}>grant listing page</a>. Please ignore this if
          you have already completed KYC verification on Earn before.
        </p>
        <p style={styles.textWithMargin}>
          Once you receive your first tranche and make significant progress on
          your project, share an update to claim your next tranche from the{' '}
          <a href={grantPageLink}>grant listing page</a>.
        </p>
      </>
    ),
    fr: (
      <>
        <p style={styles.greetings}>Bonjour {name},</p>
        <p style={styles.textWithMargin}>
          Votre candidature pour {title} dans le cadre du projet{' '}
          <strong>{projectTitle}</strong> a été approuvée pour un montant de{' '}
          {amount} {token}. Félicitations !
        </p>
        <p style={styles.textWithMargin}>
          Pour recevoir votre première tranche ({trancheAmountFormatted} {token}
          ), veuillez compléter la vérification KYC depuis la{' '}
          <a href={grantPageLink}>page de la subvention</a>. Veuillez ignorer ce
          message si vous avez déjà complété votre vérification KYC sur Earn.
        </p>
        <p style={styles.textWithMargin}>
          Une fois que vous aurez reçu votre première tranche et réalisé des
          progrès significatifs sur votre projet, partagez une mise à jour pour
          réclamer la prochaine tranche depuis la{' '}
          <a href={grantPageLink}>page de la subvention</a>.
        </p>
      </>
    ),
    vi: (
      <>
        <p style={styles.greetings}>Chào {name},</p>
        <p style={styles.textWithMargin}>
          Đơn xin tài trợ {title} của bạn cho dự án{' '}
          <strong>{projectTitle}</strong> đã được chấp thuận với số tiền{' '}
          {amount} {token}. Chúc mừng bạn!
        </p>
        <p style={styles.textWithMargin}>
          Để nhận khoản giải ngân đầu tiên ({trancheAmountFormatted} {token}),
          vui lòng hoàn tất xác minh KYC từ{' '}
          <a href={grantPageLink}>trang thông tin tài trợ</a>. Vui lòng bỏ qua
          nếu bạn đã hoàn thành KYC trên Earn trước đó.
        </p>
        <p style={styles.textWithMargin}>
          Khi bạn nhận được khoản giải ngân đầu tiên và đạt được tiến độ đáng kể
          trong dự án, hãy chia sẻ cập nhật để yêu cầu khoản tiếp theo từ{' '}
          <a href={grantPageLink}>trang thông tin tài trợ</a>.
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
