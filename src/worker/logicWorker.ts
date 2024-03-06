import { connection, emailQueue } from '../utils/queue';
import { Worker } from 'bullmq';
import { processLogic } from '../utils/processLogic';

const logicWorker = new Worker(
  'logicQueue',
  async (job) => {
    try {
      const { type, id, userId } = job.data;
      const emailDatas = await processLogic({ type, id, userId });

      if (Array.isArray(emailDatas)) {
        for (const emailData of emailDatas) {
          await emailQueue.add('emailQueue', emailData);
        }
      } else {
        await emailQueue.add('emailQueue', emailDatas);
      }

      console.log(`Logic processed for type ${type}, email queued.`);
    } catch (error) {
      console.error(`Failed to process logic for job ${job.id}:`, error);
    }
  },
  { connection: connection },
);

console.log('Logic worker started');
