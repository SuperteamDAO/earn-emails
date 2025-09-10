import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { type GrantsModel } from '../../generated/prisma/models';
import { styles } from '../styles';

interface ApplicationProps {
  name: string;
  applicationTitle: string;
  grant: GrantsModel;
  salutation: string | null;
  language: string;
}

export const ApplicationTemplate = ({
  name,
  applicationTitle,
  grant,
  salutation,
  language,
}: ApplicationProps) => {
  const { avgResponseTime, title } = grant;

  const templates = {
    en: (
      <>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Thanks for sending in your <strong>{title}</strong> application for{' '}
          <strong>{applicationTitle}</strong>. The sponsor will try their best
          to get back to you within <strong>{avgResponseTime}</strong>.
          Appreciate your patience!
        </p>
      </>
    ),
    fr: (
      <>
        <p style={styles.greetings}>Bonjour {name},</p>
        <p style={styles.textWithMargin}>
          Merci d'avoir envoyé votre candidature pour <strong>{title}</strong>{' '}
          dans le cadre de <strong>{applicationTitle}</strong>. Le sponsor fera
          de son mieux pour vous répondre sous{' '}
          <strong>{avgResponseTime}</strong>. Merci pour votre patience !
        </p>
      </>
    ),
    vi: (
      <>
        <p style={styles.greetings}>Chào {name},</p>
        <p style={styles.textWithMargin}>
          Cảm ơn bạn đã gửi đơn ứng tuyển <strong>{title}</strong> cho{' '}
          <strong>{applicationTitle}</strong>. Nhà tài trợ sẽ cố gắng phản hồi
          bạn trong vòng <strong>{avgResponseTime}</strong>. Cảm ơn bạn đã kiên
          nhẫn!
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
