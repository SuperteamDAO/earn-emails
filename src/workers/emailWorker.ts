import { PrismaClient } from '@prisma/client';
import { render } from '@react-email/render';
import { Worker } from 'bullmq';
import { createHmac } from 'crypto';
import { config } from 'dotenv';
import { Resend } from 'resend';

import { basePath, kashEmail } from '../constants';
import { AlertTemplate } from '../email-templates';
import { redis } from '../utils';

config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const generateUnsubscribeURL = (email: string) => {
  const signature = createHmac('sha256', process.env.UNSUB_SECRET!)
    .update(email)
    .digest('hex');
  return `${basePath}/api/email/unsubscribe?email=${encodeURIComponent(
    email,
  )}&signature=${signature}`;
};

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const {
      from,
      to,
      subject,
      html,
      cc,
      bcc,
      id,
      type,
      userId,
      otherInfo,
      checkUnsubscribe = true,
    } = job.data;

    try {
      if (!to || !subject || !html) {
        const missingProperties = [];
        if (!to) missingProperties.push('to');
        if (!subject) missingProperties.push('subject');
        if (!html) missingProperties.push('html');

        console.log(
          `Skipping job ${
            job.id
          } due to missing properties: ${missingProperties.join(', ')}.`,
        );
        return;
      }

      const isBlocked = await prisma.blockedEmail.findUnique({
        where: { email: to },
      });

      if (isBlocked) {
        console.log(`Email not sent. ${to} is blocked.`);
        return;
      }

      if (checkUnsubscribe) {
        const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
          where: { email: to },
        });

        if (isUnsubscribed) {
          console.log(`Email not sent. ${to} has unsubscribed.`);
          return;
        }
      }

      const unsubscribeURL = generateUnsubscribeURL(to);

      const response = await resend.emails.send({
        from,
        to,
        subject,
        html: html.replace('{{unsubscribeUrl}}', unsubscribeURL),
        ...(bcc && { bcc }),
        ...(cc && { cc }),
        replyTo: 'support@superteamearn.com',
        headers: {
          'List-Unsubscribe': `<${unsubscribeURL}>`,
        },
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
        console.error('Failed to send email:', error);
        if (process.env.SERVER_ENV === 'production') {
          await resend.emails.send({
            from: kashEmail,
            to: ['abhwshek@gmail.com', 'pratik.dholani1@gmail.com'],
            subject: 'Email Error',
            html: await render(
              AlertTemplate({
                type,
                id,
                otherInfo,
                userId,
                errorMessage: error.message || 'Unknown Error',
              }),
            ),
          });
        }
        throw error;
      }
    }
  },
  { connection: redis, limiter: { max: 10, duration: 1000 } },
);

console.log('Email worker started');

export { emailWorker };
