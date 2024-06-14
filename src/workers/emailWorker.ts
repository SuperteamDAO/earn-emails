import { Worker } from 'bullmq';
import { Resend } from 'resend';
import dotenv from 'dotenv';
import { redis } from '../utils';
import { PrismaClient } from '@prisma/client';
import { kashEmail } from '../constants';
import { AlertTemplate } from '../email-templates';
import { render } from '@react-email/render';

dotenv.config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { to, subject, html, cc, bcc, id, type, userId, otherInfo } =
      job.data;

    try {
      if (!to || !subject || !html) {
        console.log(`Skipping job ${job.id} due to missing job properties.`);
        return;
      }

      const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
        where: { email: to },
      });

      if (isUnsubscribed) {
        console.log(`Email not sent. ${to} has unsubscribed.`);
        return;
      }

      const response = await resend.emails.send({
        from: kashEmail,
        to,
        subject,
        html,
        ...(bcc && { bcc }),
        ...(cc && { cc }),
      });
      console.log(`Email sent successfully to ${to}:`, response);
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(
          error.response.headers['retry-after'] || '60',
          10,
        );
        await emailWorker.rateLimit(retryAfter * 1000);
        throw Worker.RateLimitError();
      } else {
        console.error('Failed to send email (non-rate-limit error):', error);
        await resend.emails.send({
          from: kashEmail,
          to: ['abhwshek@gmail.com', 'pratik.dholani1@gmail.com'],
          subject: 'Email Error',
          html: render(
            AlertTemplate({
              type,
              id,
              otherInfo,
              userId,
              errorMessage: error.message || 'Unknown Error',
            }),
          ),
        });
        throw error;
      }
    }
  },
  { connection: redis, limiter: { max: 10, duration: 1000 } },
);

console.log('Email worker started');
