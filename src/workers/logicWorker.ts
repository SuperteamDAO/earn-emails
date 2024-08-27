import { emailQueue, redis } from '../utils';
import { Worker, Job } from 'bullmq';
import { config } from 'dotenv';
import { getPriority, processLogic } from '../utils';
import { v4 as uuidv4 } from 'uuid';

config();

const LOCK_DURATION = 30000;
const LOCK_EXTENSION = 20000;

async function processJob(job: Job) {
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
}

async function manualJobProcessing() {
  const worker = new Worker('logicQueue', null, {
    connection: redis,
    lockDuration: LOCK_DURATION,
  });

  await worker.startStalledCheckTimer();

  const token = uuidv4();
  let job: Job | undefined;

  while (true) {
    try {
      if (!job) {
        job = await worker.getNextJob(token);
        if (!job) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          continue;
        }
      }

      console.log(`Processing job ${job.id}`);

      const extendLockInterval = setInterval(async () => {
        try {
          await job!.extendLock(token, LOCK_EXTENSION);
          console.log(`Extended lock for job ${job!.id}`);
        } catch (error) {
          console.error(`Failed to extend lock for job ${job!.id}:`, error);
        }
      }, LOCK_DURATION / 2);

      try {
        await processJob(job);
        await job.moveToCompleted('Job completed', token);
        console.log(`Job ${job.id} completed successfully`);
      } catch (error: any) {
        console.error(`Failed to process logic for job ${job.id}:`, error);
        await job.moveToFailed(
          new Error(`Job processing failed: ${error.message}`),
          token,
        );
      } finally {
        clearInterval(extendLockInterval);
      }

      job = undefined;
    } catch (error) {
      console.error('Error in job processing loop:', error);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

console.log('Logic worker started');
manualJobProcessing().catch(console.error);
