import { Worker } from 'bullmq';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { redis } from '../utils/queue';

const MAX_RETRIES = 3;

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    dotenv.config();
    const resend = new Resend(process.env.RESEND_API_KEY);

    let retries = 0;

    const sendEmailWithRetry = async () => {
      try {
        const { from, to, subject, html } = job.data;
        const response = await resend.emails.send({ from, to, subject, html });
        console.log('Email sent successfully:', response);
      } catch (error: any) {
        if (
          error.response &&
          error.response.status === 429 &&
          retries < MAX_RETRIES
        ) {
          const retryAfter = parseInt(
            error.response.headers['retry-after'] || '1',
            10,
          );
          retries++;

          console.error(
            'Resend rate limit hit. Retrying in:',
            retryAfter,
            'seconds',
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryAfter * 1000),
          );
          await sendEmailWithRetry();
        } else {
          console.error('Failed to send email (non-rate-limit error):', error);
          throw error;
        }
      }
    };

    await sendEmailWithRetry();
  },
  {
    connection: redis,
  },
);

console.log('Email worker started');
