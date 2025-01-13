import { Worker } from 'bullmq';
import { config } from 'dotenv';

import { prisma } from '../prisma';
import { getPriority } from '../utils/getPriority';
import { processLogic } from '../utils/processLogic';
import { emailQueue, redis } from '../utils/queue';

config();

const logicWorker = new Worker(
  'logicQueue',
  async (job) => {
    try {
      const { type, entityId, userId, otherInfo, logId, batchId } = job.data;
      const emailDatas = await processLogic({
        type,
        entityId,
        userId,
        otherInfo,
        logId,
        batchId,
      });

      const priority = getPriority(type);

      const addToQueue = async (emailData: any) => {
        await emailQueue.add('emailQueue', emailData, {
          backoff: { type: 'exponential', delay: 1000 },
          attempts: 3,
          priority,
        });
      };

      if (batchId) {
        if (Array.isArray(emailDatas)) {
          await Promise.all(
            emailDatas.map(async (emailData) => {
              await prisma.emails.create({
                data: {
                  email: emailData.to,
                  subject: emailData.subject,
                  status: 'initiated',
                  type,
                  batchId,
                  triggeredBy: job.data.triggeredBy || 'system',
                },
              });
            }),
          );
        }
      }

      if (Array.isArray(emailDatas)) {
        await Promise.all(emailDatas.map(addToQueue));
      } else {
        await addToQueue(emailDatas);
      }

      if (batchId) {
        await prisma.emailBatch.update({
          where: { id: batchId },
          data: {
            status: 'processing',
            updatedAt: new Date(),
          },
        });
      }

      console.log(`Logic processed for type ${type}, email queued.`);
    } catch (error) {
      console.error(`Failed to process logic for job ${job.id}:`, error);

      if (job.data.batchId) {
        await prisma.emailBatch.update({
          where: { id: job.data.batchId },
          data: {
            status: 'failed',
            updatedAt: new Date(),
          },
        });
      }
    }
  },
  {
    connection: redis,
  },
);

console.log('Logic worker started');

export { logicWorker };
