import React from 'react';

import { Salutation } from '../../components/Salutation';
import { UnsubscribeLine } from '../../components/unsubscribeLine';
import { styles } from '../styles';

interface ApplicationRejectedProps {
  name: string;
  applicationTitle: string;
  grantName: string;
  salutation: string | null;
  language: string;
}

export const ApplicationRejectedTemplate = ({
  name,
  applicationTitle,
  grantName,
  salutation,
  language,
}: ApplicationRejectedProps) => {
  const templates = {
    en: (
      <>
        <p style={styles.greetings}>Hey {name},</p>
        <p style={styles.textWithMargin}>
          Unfortunately, your grant application for{' '}
          <strong>{applicationTitle}</strong> under <strong>{grantName}</strong>{' '}
          has been rejected. Please note that it is not possible for us or the
          sponsor to share individual feedback on your grant application.
        </p>
        <p style={styles.textWithMargin}>
          We hope you continue adding to your proof of work by submitting to
          bounties and projects, and winning some along the way. All the best!
        </p>
      </>
    ),
    fr: (
      <>
        <p style={styles.greetings}>Salut {name},</p>
        <p style={styles.textWithMargin}>
          Malheureusement, votre candidature de subvention pour{' '}
          <strong>{applicationTitle}</strong> sous <strong>{grantName}</strong>{' '}
          a été rejetée. Veuillez noter qu'il ne nous est pas possible, ni au
          sponsor, de fournir un retour individuel sur cette candidature.
        </p>
        <p style={styles.textWithMargin}>
          Nous espérons que vous continuerez à renforcer votre portfolio en
          soumettant à d'autres projets et bounties, et que vous en remporterez
          bientôt. Bonne chance !
        </p>
      </>
    ),
    vi: (
      <>
        <p style={styles.greetings}>Chào {name},</p>
        <p style={styles.textWithMargin}>
          Rất tiếc, đơn xin tài trợ của bạn cho{' '}
          <strong>{applicationTitle}</strong> thuộc <strong>{grantName}</strong>{' '}
          đã bị từ chối. Xin lưu ý rằng cả chúng tôi và nhà tài trợ đều không
          thể cung cấp phản hồi chi tiết cho từng đơn.
        </p>
        <p style={styles.textWithMargin}>
          Chúng tôi hy vọng bạn sẽ tiếp tục xây dựng hồ sơ bằng cách tham gia
          các dự án và bounty khác, và sẽ sớm giành được thành công. Chúc bạn
          may mắn!
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
