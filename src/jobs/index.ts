import cron from 'node-cron';
import { getPriority, logicQueue } from '../utils';
import { EmailActionType } from '../types';

const scheduleJob = (time: string, type: EmailActionType) => {
  const priority = getPriority(type);

  cron.schedule(time, () => {
    console.log(`Triggering ${type} email job`);
    logicQueue.add('processLogic', { type, priority });
  });
};

scheduleJob('30 * * * *', 'deadline3days');
scheduleJob('45 * * * *', 'deadlineExceeded');
scheduleJob('50 * * * *', 'deadlineExceededWeek');
// scheduleJob('0 12 * * 4', 'weeklyListingRoundup');
