import { render } from '@react-email/render';

import { type User } from '@/prisma/client';

import { pratikEmail } from '../constants/emails';
import { FeatureAnnouncementTemplate } from '../email-templates/FeatureAnnouncementTemplate';
import { prisma } from '../prisma';

export async function processFeatureAnnouncement() {
  console.log('-------------------------------------');
  console.log('[FeatureAnnouncement] Starting process');
  console.log('-------------------------------------');

  try {
    console.log('[FeatureAnnouncement] Querying eligible users');
    const batchSize = 10000;
    type UserSelect = Pick<User, 'id' | 'firstName' | 'email' | 'referralCode'>;
    const users: UserSelect[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
      const batch: UserSelect[] = await prisma.user.findMany({
        take: batchSize,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        where: {
          emailSettings: { some: { category: 'productAndNewsletter' } },
          isTalentFilled: true,
          currentSponsorId: null,
          isBlocked: false,
          emailLogs: {
            none: {
              type: 'REFERRAL_ANNOUNCEMENT',
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          email: true,
          referralCode: true,
        },
      });

      users.push(...batch);

      if (batch.length < batchSize) {
        break;
      }

      cursor = batch[batch.length - 1].id;
    }
    console.log(`[FeatureAnnouncement] Found ${users.length} eligible users`);

    const emails = [];
    const emailType = 'REFERRAL_ANNOUNCEMENT';
    console.log(`[FeatureAnnouncement] Email type: ${emailType}`);

    console.log('[FeatureAnnouncement] Starting user processing loop');
    for (const user of users) {
      console.log(
        `[FeatureAnnouncement] Processing user: ${user.id} (${user.email})`,
      );

      console.log(
        `[FeatureAnnouncement] Rendering email template for user: ${user.id}`,
      );
      const emailHtml = await render(
        FeatureAnnouncementTemplate({
          name: user.firstName,
          referralCode: user.referralCode || '',
        }),
      );
      console.log(
        `[FeatureAnnouncement] Email template rendered successfully for user: ${user.id}`,
      );

      console.log(
        `[FeatureAnnouncement] Adding email to queue for user: ${user.id}`,
      );
      emails.push({
        from: pratikEmail,
        to: user.email,
        subject: 'Want more credits without winning?',
        html: emailHtml,
      });

      console.log(
        `[FeatureAnnouncement] Creating email log record for user: ${user.id}`,
      );
      await prisma.emailLogs.create({
        data: { type: emailType, userId: user.id },
      });
      console.log(
        `[FeatureAnnouncement] Email log record created successfully for user: ${user.id}`,
      );
    }

    console.log(
      `[FeatureAnnouncement] Processing complete. ${emails.length} emails prepared for sending`,
    );
    console.log('-------------------------------------');

    return emails;
  } catch (error) {
    console.error(
      '[FeatureAnnouncement] Error processing feature announcement:',
    );
    console.error(error);
    console.log('-------------------------------------');
    throw error;
  }
}
