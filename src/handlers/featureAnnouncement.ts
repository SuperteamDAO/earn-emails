import { render } from '@react-email/render';

import { type User } from '@/prisma/client';

import { pratikEmail } from '../constants/emails';
import { NonProFeatureAnnouncementTemplate } from '../email-templates/NonProFeatureAnnouncementTemplate';
import { ProFeatureAnnouncementTemplate } from '../email-templates/ProFeatureAnnouncementTemplate';
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
              type: 'PRO_FEATURE_ANNOUNCEMENT',
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

    console.log('[FeatureAnnouncement] Identifying pro users');
    const proUsersResult = await prisma.$queryRaw<
      Array<{
        userId: string;
      }>
    >`
      SELECT DISTINCT u.id as userId
      FROM User u
      LEFT JOIN (
        SELECT 
          s.userId,
          COALESCE(
            SUM(CASE 
              WHEN s.isWinner = true AND l.isWinnersAnnounced = true 
              THEN s.rewardInUSD 
              ELSE 0 
            END),
            0
          ) as listing_winnings
        FROM Submission s
        INNER JOIN Bounties l ON s.listingId = l.id
        GROUP BY s.userId
      ) submission_stats ON u.id = submission_stats.userId
      LEFT JOIN (
        SELECT 
          ga.userId,
          COALESCE(
            SUM(CASE 
              WHEN ga.applicationStatus IN ('Approved', 'Completed') 
              THEN ga.approvedAmountInUSD 
              ELSE 0 
            END),
            0
          ) as grant_winnings
        FROM GrantApplication ga
        GROUP BY ga.userId
      ) grant_stats ON u.id = grant_stats.userId
      WHERE (
        (COALESCE(submission_stats.listing_winnings, 0) + COALESCE(grant_stats.grant_winnings, 0)) > 1000
        OR u.superteamLevel LIKE '%Superteam%'
      )
    `;

    const proUserIds = new Set(proUsersResult.map((r) => r.userId));
    console.log(`[FeatureAnnouncement] Found ${proUserIds.size} pro users`);

    const proUsers = users.filter((u) => proUserIds.has(u.id));
    const nonProUsers = users.filter((u) => !proUserIds.has(u.id));
    console.log(
      `[FeatureAnnouncement] Split: ${proUsers.length} pro, ${nonProUsers.length} non-pro`,
    );

    const emails = [];
    const emailType = 'PRO_FEATURE_ANNOUNCEMENT';
    console.log(`[FeatureAnnouncement] Email type: ${emailType}`);

    console.log('[FeatureAnnouncement] Processing pro users');
    for (const user of proUsers) {
      console.log(
        `[FeatureAnnouncement] Processing pro user: ${user.id} (${user.email})`,
      );

      console.log(
        `[FeatureAnnouncement] Rendering pro email template for user: ${user.id}`,
      );
      const emailHtml = await render(
        ProFeatureAnnouncementTemplate({ name: user.firstName }),
      );
      console.log(
        `[FeatureAnnouncement] Pro email template rendered successfully for user: ${user.id}`,
      );

      console.log(
        `[FeatureAnnouncement] Adding pro email to queue for user: ${user.id}`,
      );
      emails.push({
        from: pratikEmail,
        to: user.email,
        subject: "You're in the top 1% — we're now friends with benefits",
        html: emailHtml,
      });

      console.log(
        `[FeatureAnnouncement] Creating email log record for pro user: ${user.id}`,
      );
      await prisma.emailLogs.create({
        data: { type: emailType, userId: user.id },
      });
      console.log(
        `[FeatureAnnouncement] Email log record created successfully for pro user: ${user.id}`,
      );
    }

    console.log('[FeatureAnnouncement] Processing non-pro users');
    for (const user of nonProUsers) {
      console.log(
        `[FeatureAnnouncement] Processing non-pro user: ${user.id} (${user.email})`,
      );

      console.log(
        `[FeatureAnnouncement] Rendering non-pro email template for user: ${user.id}`,
      );
      const emailHtml = await render(
        NonProFeatureAnnouncementTemplate({ name: user.firstName }),
      );
      console.log(
        `[FeatureAnnouncement] Non-pro email template rendered successfully for user: ${user.id}`,
      );

      console.log(
        `[FeatureAnnouncement] Adding non-pro email to queue for user: ${user.id}`,
      );
      emails.push({
        from: pratikEmail,
        to: user.email,
        subject: 'Exclusive bounties just dropped — are you in?',
        html: emailHtml,
      });

      console.log(
        `[FeatureAnnouncement] Creating email log record for non-pro user: ${user.id}`,
      );
      await prisma.emailLogs.create({
        data: { type: emailType, userId: user.id },
      });
      console.log(
        `[FeatureAnnouncement] Email log record created successfully for non-pro user: ${user.id}`,
      );
    }

    console.log(
      `[FeatureAnnouncement] Processing complete. ${emails.length} emails prepared for sending (${proUsers.length} pro, ${nonProUsers.length} non-pro)`,
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
