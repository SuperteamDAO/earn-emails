import { Worker } from 'bullmq';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { redis } from '../utils/queue';

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    dotenv.config();
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      const { from, to, subject, html } = job.data;
      const response = await resend.emails.send({ from, to, subject, html });
      console.log(`Email sent successfully to ${to}:`, response);
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        const retryAfter = parseInt(
          error.response.headers['retry-after'] || '60',
          10,
        );
        await emailWorker.rateLimit(retryAfter * 1000);
        throw Worker.RateLimitError();
      } else {
        console.error('Failed to send email (non-rate-limit error):', error);
        throw error;
      }
    }
  },
  {
    connection: redis,
    limiter: {
      max: 10,
      duration: 1000,
    },
  },
);

console.log('Email worker started');
