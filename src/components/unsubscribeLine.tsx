import React from 'react';
import { basePath } from '../constants';

export const UnsubscribeLine = () => {
  return (
    <p style={{ fontSize: '11px', lineHeight: '20px', marginTop: '16px' }}>
      <a
        href={`${basePath}/#emailPreferences`}
        style={{ fontSize: '11px', color: '#007BFF' }}
      >
        Click here
      </a>{' '}
      to update your email preferences on Earn (recommended) or{' '}
      <a
        href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
        style={{ fontSize: '11px', color: '#007BFF' }}
      >
        click here
      </a>{' '}
      to unsubscribe from all future emails from Superteam Earn
    </p>
  );
};
