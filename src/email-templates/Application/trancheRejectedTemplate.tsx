import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface TrancheRejectedProps {
  name: string;
  projectTitle: string;
  sponsorName: string;
  salutation: string | null;
  language: string;
}

export const TrancheRejectedTemplate = ({
  name,
  projectTitle,
  sponsorName,
  salutation,
  language,
}: TrancheRejectedProps) => {
  const templates = {
    en: (
      <>
        <p style={styles.greetings}>Hi {name},</p>
        <p style={styles.textWithMargin}>
          Unfortunately, your tranche request for{' '}
          <strong>{projectTitle}</strong> has been rejected by {sponsorName}.
          Please get in touch with the sponsor directly to discuss further.
        </p>
      </>
    ),
    fr: (
      <>
        <p style={styles.greetings}>Bonjour {name},</p>
        <p style={styles.textWithMargin}>
          Malheureusement, votre demande de tranche pour{' '}
          <strong>{projectTitle}</strong> a été rejetée par {sponsorName}.
          Veuillez contacter directement le sponsor pour en discuter.
        </p>
      </>
    ),
    vi: (
      <>
        <p style={styles.greetings}>Chào {name},</p>
        <p style={styles.textWithMargin}>
          Rất tiếc, yêu cầu giải ngân của bạn cho{' '}
          <strong>{projectTitle}</strong> đã bị {sponsorName} từ chối. Vui lòng
          liên hệ trực tiếp với nhà tài trợ để trao đổi thêm.
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
