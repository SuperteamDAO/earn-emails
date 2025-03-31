import { PrismaClient } from '@prisma/client';
import { render } from '@react-email/render';
import { Worker } from 'bullmq';
import { createHmac } from 'crypto';
import { config } from 'dotenv';
import { Resend } from 'resend';

import { basePath } from '../constants/basePath';
import { pratikEmail } from '../constants/emails';
import { AlertTemplate } from '../email-templates/Alert/AlertTemplate';
import { logError, logInfo, logWarn } from '../utils/logger';
import { redis } from '../utils/queue';

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

        await logWarn(`Skipping email job due to missing properties`, {
          jobId: job.id,
          missingProperties,
          type,
          id,
          userId,
        });
        return;
      }

      const [isBlocked, isUnsubscribed] = await Promise.all([
        prisma.blockedEmail.findUnique({ where: { email: to } }),
        checkUnsubscribe
          ? prisma.unsubscribedEmail.findUnique({ where: { email: to } })
          : Promise.resolve(null),
      ]);

      if (isBlocked) {
        await logInfo(`Email not sent - recipient is blocked`, {
          jobId: job.id,
          email: to,
          type,
          id,
          userId,
        });
        return;
      }

      if (isUnsubscribed) {
        await logInfo(`Email not sent - recipient has unsubscribed`, {
          jobId: job.id,
          email: to,
          type,
          id,
          userId,
        });
        return;
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

      await logInfo(`Email sent successfully`, {
        jobId: job.id,
        email: to,
        type,
        id,
        userId,
        response,
      });
    } catch (error: any) {
      if (error.response?.status === 429) {
        const retryAfter = parseInt(
          error.response.headers['retry-after'] || '60',
          10,
        );
        await logWarn(`Rate limit hit for email sending`, {
          jobId: job.id,
          retryAfter,
          type,
          id,
          userId,
        });
        await emailWorker.rateLimit(retryAfter * 1000);
        throw Worker.RateLimitError();
      } else {
        await logError(error as Error, {
          jobId: job.id,
          email: to,
          type,
          id,
          userId,
          subject,
        });

        if (process.env.SERVER_ENV === 'production') {
          await resend.emails.send({
            from: pratikEmail,
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
  {
    connection: redis,
    concurrency: 10,
    limiter: { max: 10, duration: 1000 },
    lockDuration: 60000,
    stalledInterval: 30000,
  },
);

logInfo('Email worker started').catch(console.error);

process.on('SIGTERM', async () => {
  await emailWorker.close();
});

process.on('SIGINT', async () => {
  await emailWorker.close();
});

export { emailWorker };
