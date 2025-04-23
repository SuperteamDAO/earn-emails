import { config } from 'dotenv';
import cron from 'node-cron';

import { type EmailActionType } from '../types/EmailActionType';
import { getPriority } from '../utils/getPriority';
import { logError, logInfo } from '../utils/logger';
import { logicQueue } from '../utils/queue';

config();

const scheduleJob = (time: string, type: EmailActionType) => {
  const priority = getPriority(type);

  cron.schedule(time, async () => {
    try {
      await logInfo(`Triggering email job`, {
        type,
        priority,
        scheduledTime: time,
      });

      await logicQueue.add('processLogic', { type }, { priority });
    } catch (error) {
      await logError(error as Error, {
        type,
        priority,
        scheduledTime: time,
      });
    }
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
// scheduleJob('30 15 * * *', 'featureAnnouncement');

logInfo('Cron jobs scheduled').catch(console.error);
