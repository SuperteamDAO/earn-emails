import { Queue } from 'bullmq';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
export const redis = new Redis(REDIS_URL!, {
  maxRetriesPerRequest: 3,
  connectTimeout: 10000,
  disconnectTimeout: 2000,
  enableReadyCheck: true,
  keepAlive: 30000,
});

const defaultQueueOptions = {
  connection: redis,
  defaultJobOptions: {
    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 1000,
    },
    removeOnFail: {
      age: 7 * 24 * 60 * 60,
      count: 5000,
    },
  },
  historyTTL: 14 * 24 * 60 * 60,
  sharedConnection: true,
};

export const emailQueue = new Queue('emailQueue', defaultQueueOptions);
export const logicQueue = new Queue('logicQueue', defaultQueueOptions);

export const closeRedisConnections = async (): Promise<void> => {
  await Promise.all([emailQueue.close(), logicQueue.close(), redis.quit()]);
};
