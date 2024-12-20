import { Worker } from 'bullmq';
import { config } from 'dotenv';

import { getPriority } from '../utils/getPriority';
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
        });
      };

      if (Array.isArray(emailDatas)) {
        for (const emailData of emailDatas) {
          await addToQueue(emailData);
        }
      } else {
        await addToQueue(emailDatas);
      }

      console.log(`Logic processed for type ${type}, email queued.`);
    } catch (error) {
      console.error(`Failed to process logic for job ${job.id}:`, error);
    }
  },
  {
    connection: redis,
  },
);

console.log('Logic worker started');

export { logicWorker };
