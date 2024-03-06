import { Queue } from 'bullmq';
export const connection = { host: '127.0.0.1', port: 6379 };

export const emailQueue = new Queue('emailQueue', { connection });
export const logicQueue = new Queue('logicQueue', { connection });
