import React from 'react';

import { styles } from '../email-templates/styles';

export const Salutation = ({
  text = 'Best, Superteam Earn',
}: {
  text?: string;
}) => {
  const salutation = text.replace(/,/g, ',<br />');

  return (
    <p
      dangerouslySetInnerHTML={{ __html: salutation }}
      style={styles.salutation}
    />
  );
};
