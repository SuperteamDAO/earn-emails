import { Worker } from 'bullmq';
import { config } from 'dotenv';

import { getPriority } from '../utils/getPriority';
import { logError, logInfo } from '../utils/logger';
import { processLogic } from '../utils/processLogic';
import { emailQueue, redis } from '../utils/queue';

config();

const logicWorker = new Worker(
  'logicQueue',
  async (job) => {
    try {
      const { type, id, userId, otherInfo } = job.data;
      const emailDatas = await processLogic({ type, id, userId, otherInfo });

      const priority = getPriority(type);

      const addToQueue = async (emailData: any) => {
        await emailQueue.add('emailQueue', emailData, {
          backoff: { type: 'exponential', delay: 1000 },
          attempts: 3,
          priority,
          removeOnComplete: true,
        });
      };

      if (Array.isArray(emailDatas)) {
        await Promise.all(emailDatas.map(addToQueue));
      } else {
        await addToQueue(emailDatas);
      }

      await logInfo(`Logic processed for type ${type}`, {
        jobId: job.id,
        type,
        id,
        userId,
        otherInfo,
      });
    } catch (error) {
      await logError(error as Error, {
        jobId: job.id,
        type: job.data.type,
        id: job.data.id,
        userId: job.data.userId,
        otherInfo: job.data.otherInfo,
      });
    }
  },
  {
    connection: redis,
    concurrency: 5,
    limiter: { max: 100, duration: 10000 },
    stalledInterval: 30000,
    lockDuration: 60000,
  },
);

logInfo('Logic worker started').catch(console.error);

export { logicWorker };
