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
  const { title, token, slug, communityLink } = grant;
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
        <p style={styles.text}>Here are the next steps:</p>
        <ul>
          <li style={styles.text}>
            To receive your first tranche ({trancheAmountFormatted} {token}),
            please complete KYC verification from the{' '}
            <a href={grantPageLink} style={styles.link}>
              grant listing page
            </a>
            . Please ignore this if you have already completed KYC verification
            on Earn before.
          </li>
          {communityLink && (
            <li style={styles.text}>
              In case you're not part of our community already,{' '}
              <a href={communityLink} style={styles.link}>
                click here
              </a>{' '}
              to join and fill this{' '}
              <a href={'https://new-mem.superteam.fun/'} style={styles.link}>
                onboarding form
              </a>
              .
            </li>
          )}
          <li style={styles.text}>
            Once you receive your first tranche and make significant progress on
            your project, share an update to claim your next tranche from the{' '}
            <a href={grantPageLink} style={styles.link}>
              grant listing page
            </a>
            .
          </li>
        </ul>
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
        <p style={styles.text}>Voici les prochaines étapes :</p>
        <ul>
          <li style={styles.text}>
            Pour recevoir votre première tranche ({trancheAmountFormatted}{' '}
            {token}
            ), veuillez compléter la vérification KYC depuis la{' '}
            <a href={grantPageLink} style={styles.link}>
              page de la subvention
            </a>
            . Veuillez ignorer ceci si vous avez déjà effectué la vérification
            KYC sur Earn auparavant.
          </li>
          {communityLink && (
            <li style={styles.text}>
              Si vous ne faites pas encore partie de notre communauté,{' '}
              <a href={communityLink} style={styles.link}>
                cliquez ici
              </a>{' '}
              pour rejoindre et remplissez ce{' '}
              <a href={'https://new-mem.superteam.fun/'} style={styles.link}>
                formulaire d'intégration
              </a>
              .
            </li>
          )}
          <li style={styles.text}>
            Une fois que vous recevez votre première tranche et faites des
            progrès significatifs sur votre projet, partagez une mise à jour
            pour réclamer votre prochaine tranche depuis la{' '}
            <a href={grantPageLink} style={styles.link}>
              page de la subvention
            </a>
            .
          </li>
        </ul>
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
        <p style={styles.text}>Đây là các bước tiếp theo:</p>
        <ul>
          <li style={styles.text}>
            Để nhận khoản giải ngân đầu tiên ({trancheAmountFormatted} {token}),
            vui lòng hoàn tất xác minh KYC từ{' '}
            <a href={grantPageLink} style={styles.link}>
              trang thông tin tài trợ
            </a>
            . Vui lòng bỏ qua nếu bạn đã hoàn thành KYC trên Earn trước đó.
          </li>
          {communityLink && (
            <li style={styles.text}>
              Trong trường hợp bạn chưa tham gia cộng đồng của chúng tôi,{' '}
              <a href={communityLink} style={styles.link}>
                nhấp vào đây
              </a>{' '}
              để tham gia và điền vào{' '}
              <a href={'https://new-mem.superteam.fun/'} style={styles.link}>
                biểu mẫu giới thiệu này
              </a>
              .
            </li>
          )}
          <li style={styles.text}>
            Khi bạn nhận được khoản giải ngân đầu tiên và đạt được tiến độ đáng
            kể trong dự án, hãy chia sẻ cập nhật để yêu cầu khoản tiếp theo từ{' '}
            <a href={grantPageLink} style={styles.link}>
              trang thông tin tài trợ
            </a>
            .
          </li>
        </ul>
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
