import { Worker } from 'bullmq';
import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import { redis } from '../utils/queue';
import { PrismaClient } from '@prisma/client';

dotenv.config();
const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    try {
      if (
        !job.data ||
        typeof job.data !== 'object' ||
        !job.data.from ||
        !job.data.to ||
        !job.data.subject ||
        !job.data.html
      ) {
        console.log(`Skipping job ${job.id} due to missing job properties.`);
        return;
      }

      const { from, to, subject, html, bcc, cc } = job.data;

      const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
        where: {
          email: to,
        },
      });

      if (isUnsubscribed) {
        console.log(`Email not sent. ${to} has unsubscribed.`);
        return;
      }

      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
        bcc,
        cc,
      });
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
