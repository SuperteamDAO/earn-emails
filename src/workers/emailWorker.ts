import { Worker } from 'bullmq';
import { Resend } from 'resend';
import { config } from 'dotenv';
import { redis } from '../utils';
import { PrismaClient } from '@prisma/client';
import { AlertTemplate } from '../email-templates';
import { render } from '@react-email/render';
import { kashEmail } from '../constants';
import crypto from 'crypto';

config();

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY);

const generateUnsubscribeToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const emailWorker = new Worker(
  'emailQueue',
  async (job) => {
    const { from, to, subject, html, cc, bcc, id, type, userId, otherInfo } =
      job.data;

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

      const isUnsubscribed = await prisma.unsubscribedEmail.findUnique({
        where: { email: to },
      });

      if (isUnsubscribed) {
        console.log(`Email not sent. ${to} has unsubscribed.`);
        return;
      }

      const unsubscribeToken = generateUnsubscribeToken();
      const unsubscribeUrl = `https://beta.earn.superteam.fun/api/email/unsubscribe?token=${unsubscribeToken}`;

      await prisma.unsubscribeToken.create({
        data: {
          token: unsubscribeToken,
          email: to,
        },
      });

      const response = await resend.emails.send({
        from,
        to,
        subject,
        html,
        ...(bcc && { bcc }),
        ...(cc && { cc }),
        reply_to: 'support@superteamearn.com',
        headers: {
          'List-Unsubscribe': `<${unsubscribeUrl}>`,
          'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
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
