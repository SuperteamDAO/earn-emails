import { render } from '@react-email/render';

import { type User } from '@/prisma/client';

import { pratikEmail } from '../constants/emails';
import { SponsorFeatureAnnouncementTemplate } from '../email-templates/SponsorFeatureAnnouncementTemplate';
import { prisma } from '../prisma';

export async function processSponsorFeatureAnnouncement() {
  console.log('-------------------------------------');
  console.log('[SponsorFeatureAnnouncement] Starting process');
  console.log('-------------------------------------');

  try {
    console.log('[SponsorFeatureAnnouncement] Querying eligible sponsor users');
    const batchSize = 10000;
    type UserSelect = Pick<User, 'id' | 'firstName' | 'email'>;
    const users: UserSelect[] = [];
    let cursor: string | undefined = undefined;

    while (true) {
      const batch: UserSelect[] = await prisma.user.findMany({
        take: batchSize,
        ...(cursor && { skip: 1, cursor: { id: cursor } }),
        where: {
          emailSettings: { some: { category: 'productAndNewsletter' } },
          AND: [
            { currentSponsorId: { not: null } },
            { currentSponsorId: { not: '' } },
          ],
          isBlocked: false,
          emailLogs: {
            none: {
              type: 'SPONSOR_FEATURE_ANNOUNCEMENT',
            },
          },
        },
        select: {
          id: true,
          firstName: true,
          email: true,
        },
      });

      users.push(...batch);

      if (batch.length < batchSize) {
        break;
      }

      cursor = batch[batch.length - 1].id;
    }
    console.log(
      `[SponsorFeatureAnnouncement] Found ${users.length} eligible sponsor users`,
    );

    const emails = [];
    const emailType = 'SPONSOR_FEATURE_ANNOUNCEMENT';
    console.log(`[SponsorFeatureAnnouncement] Email type: ${emailType}`);

    console.log('[SponsorFeatureAnnouncement] Processing sponsor users');
    for (const user of users) {
      console.log(
        `[SponsorFeatureAnnouncement] Processing user: ${user.id} (${user.email})`,
      );

      console.log(
        `[SponsorFeatureAnnouncement] Rendering email template for user: ${user.id}`,
      );
      const emailHtml = await render(
        SponsorFeatureAnnouncementTemplate({ name: user.firstName }),
      );
      console.log(
        `[SponsorFeatureAnnouncement] Email template rendered successfully for user: ${user.id}`,
      );

      console.log(
        `[SponsorFeatureAnnouncement] Adding email to queue for user: ${user.id}`,
      );
      emails.push({
        from: pratikEmail,
        to: user.email,
        subject: 'Not everyone gets access to 150k Solana builders',
        html: emailHtml,
      });

      console.log(
        `[SponsorFeatureAnnouncement] Creating email log record for user: ${user.id}`,
      );
      await prisma.emailLogs.create({
        data: { type: emailType, userId: user.id },
      });
      console.log(
        `[SponsorFeatureAnnouncement] Email log record created successfully for user: ${user.id}`,
      );
    }

    console.log(
      `[SponsorFeatureAnnouncement] Processing complete. ${emails.length} emails prepared for sending`,
    );
    console.log('-------------------------------------');

    return emails;
  } catch (error) {
    console.error(
      '[SponsorFeatureAnnouncement] Error processing sponsor feature announcement:',
    );
    console.error(error);
    console.log('-------------------------------------');
    throw error;
  }
}
