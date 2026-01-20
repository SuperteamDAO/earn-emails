import { render } from '@react-email/render';

import { type User } from '@/prisma/client';

import { pratikEmail } from '../constants/emails';
import { KalshiGrantsTemplate } from '../email-templates/KalshiGrantsTemplate';
import { prisma } from '../prisma';

export async function processKalshiGrants() {
  console.log('-------------------------------------');
  console.log('[KalshiGrants] Starting process');
  console.log('-------------------------------------');

  try {
    console.log('[KalshiGrants] Querying eligible users');
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
          isBlocked: false,
          emailLogs: {
            none: {
              type: 'KALSHI_GRANTS',
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
      `[KalshiGrants] Found ${users.length} users with productAndNewsletter`,
    );

    console.log('[KalshiGrants] Identifying pro-eligible and pro users');
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
        u.isPro = true
        OR (COALESCE(submission_stats.listing_winnings, 0) + COALESCE(grant_stats.grant_winnings, 0)) > 1000
        OR u.superteamLevel LIKE '%Superteam%'
      )
    `;

    const proUserIds = new Set(proUsersResult.map((r) => r.userId));
    console.log(
      `[KalshiGrants] Found ${proUserIds.size} pro-eligible and pro users`,
    );

    const proUsers = users.filter((u) => proUserIds.has(u.id));
    console.log(
      `[KalshiGrants] ${proUsers.length} pro-eligible and pro users with productAndNewsletter setting`,
    );

    const emails = [];
    const emailType = 'KALSHI_GRANTS';
    console.log(`[KalshiGrants] Email type: ${emailType}`);

    console.log('[KalshiGrants] Processing pro-eligible and pro users');
    for (const user of proUsers) {
      console.log(`[KalshiGrants] Processing user: ${user.id} (${user.email})`);

      console.log(
        `[KalshiGrants] Rendering email template for user: ${user.id}`,
      );
      const emailHtml = await render(
        KalshiGrantsTemplate({ name: user.firstName }),
      );
      console.log(
        `[KalshiGrants] Email template rendered successfully for user: ${user.id}`,
      );

      console.log(`[KalshiGrants] Adding email to queue for user: ${user.id}`);
      emails.push({
        from: pratikEmail,
        to: user.email,
        subject: 'BREAKING: Pro Membership = $10,000 grant',
        html: emailHtml,
      });

      console.log(
        `[KalshiGrants] Creating email log record for user: ${user.id}`,
      );
      await prisma.emailLogs.create({
        data: { type: emailType, userId: user.id },
      });
      console.log(
        `[KalshiGrants] Email log record created successfully for user: ${user.id}`,
      );
    }

    console.log(
      `[KalshiGrants] Processing complete. ${emails.length} emails prepared for sending`,
    );
    console.log('-------------------------------------');

    return emails;
  } catch (error) {
    console.error('[KalshiGrants] Error processing kalshi grants:');
    console.error(error);
    console.log('-------------------------------------');
    throw error;
  }
}
