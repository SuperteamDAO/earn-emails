import cron from 'node-cron';

import { type EmailActionType } from '../types';
import { getPriority, logicQueue } from '../utils';

const scheduleJob = (time: string, type: EmailActionType) => {
  const priority = getPriority(type);

  cron.schedule(time, () => {
    console.log(`Triggering ${type} email job`);
    logicQueue.add('processLogic', { type }, { priority });
  });
};

if (process.env.SERVER_ENV !== 'preview') {
  scheduleJob('30 * * * *', 'deadline3days');
  scheduleJob('45 * * * *', 'deadlineExceeded');
  scheduleJob('50 * * * *', 'deadlineExceededWeek');
  scheduleJob('0 12 * * *', 'submissionSponsor');
  scheduleJob('10 12 * * *', 'submissionLike');
  scheduleJob('15 12 * * *', 'applicationLike');
  scheduleJob('20 12 * * *', 'powLike');
  scheduleJob('25 12 * * *', 'scoutReminder');
}

if (process.env.SERVER_ENV === 'development') {
  scheduleJob('*/5 * * * *', 'createListing');
} else {
  scheduleJob('0 */6 * * *', 'createListing');
}

scheduleJob('0 12 * * 4', 'weeklyListingRoundup');
scheduleJob('0 11 * * *', 'talentReminder');
