import cron from 'node-cron';
import { getPriority, logicQueue } from '../utils';
import { EmailActionType } from '../types';

const scheduleJob = (time: string, type: EmailActionType) => {
  const priority = getPriority(type);

  cron.schedule(time, () => {
    console.log(`Triggering ${type} email job`);
    logicQueue.add('processLogic', { type }, { priority });
  });
};

scheduleJob('30 * * * *', 'deadline3days');
scheduleJob('45 * * * *', 'deadlineExceeded');
scheduleJob('50 * * * *', 'deadlineExceededWeek');
scheduleJob('55 * * * *', 'rolling15Days');
scheduleJob('56 * * * *', 'rolling30Days');

if (process.env.SERVER_ENV === 'development') {
  scheduleJob('*/5 * * * *', 'createListing');
} else {
  scheduleJob('0 */6 * * *', 'createListing');
}

scheduleJob('30 15 * * 4', 'weeklyListingRoundup');
