import { Queue } from 'bullmq';
import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL;
export const redis = new Redis(REDIS_URL!, { maxRetriesPerRequest: null });

export const emailQueue = new Queue('emailQueue', { connection: redis });
export const logicQueue = new Queue('logicQueue', { connection: redis });
