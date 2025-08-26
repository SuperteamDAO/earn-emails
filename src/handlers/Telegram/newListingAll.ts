import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { prisma } from '../../prisma';
import { type UserPreferences } from '../../types/telegramUserBot';
import { logError, logInfo, logWarn } from '../../utils/logger';
import { matchesUserPreferences } from './matchPreference';
import { matchesRegion } from './matchRegion';
import { sendNotification } from './sendTelegramListingNotification';

const BATCH_SIZE = 1000;
const HOURS_THRESHOLD = 6;

interface NotificationResult {
  success: boolean;
  notificationsSent: number;
  errors: string[];
  processedListings: number;
  processedUsers: number;
}

export async function processTelegramNewListingsAll() {
  dayjs.extend(utc);
  try {
    const result: NotificationResult = {
      success: true,
      notificationsSent: 0,
      errors: [],
      processedListings: 0,
      processedUsers: 0,
    };

    const timeThreshold = dayjs().subtract(HOURS_THRESHOLD, 'hours').toDate();

    console.log(
      `🔍 Fetching listings published after ${dayjs(timeThreshold).format('YYYY-MM-DD HH:mm:ss')}`,
    );
    await logInfo(
      `Fetching listings published after ${dayjs(timeThreshold).format('YYYY-MM-DD HH:mm:ss')}`,
      { timeThreshold, hoursThreshold: HOURS_THRESHOLD },
    );

    const allRecentListings = await prisma.bounties.findMany({
      where: {
        publishedAt: {
          gte: timeThreshold,
        },
        isPublished: true,
        isActive: true,
        isArchived: false,
        isPrivate: false,
        isWinnersAnnounced: false,
        status: 'OPEN',
      },
      include: {
        sponsor: true,
      },
    });

    console.log(
      `📋 Found ${allRecentListings.length} recent listings, filtering for unprocessed ones`,
    );
    await logInfo(
      `Found ${allRecentListings.length} recent listings, filtering for unprocessed ones`,
      {
        allListingsCount: allRecentListings.length,
        allListingIds: allRecentListings.map((l) => l.id),
      },
    );

    const recentListings = [];
    for (const listing of allRecentListings) {
      const telegramLogExists = await prisma.emailLogs.findFirst({
        where: {
          bountyId: listing.id,
          type: 'NEW_LISTING_TELEGRAM',
        },
      });

      if (!telegramLogExists) {
        recentListings.push(listing);
      }
    }

    console.log(
      `📋 Found ${recentListings.length} unprocessed listings after filtering`,
    );
    await logInfo(
      `Found ${recentListings.length} unprocessed listings after filtering`,
      {
        listingsCount: recentListings.length,
        listingIds: recentListings.map((l) => l.id),
        filteredOut: allRecentListings.length - recentListings.length,
      },
    );
    result.processedListings = recentListings.length;

    if (recentListings.length === 0) {
      logInfo('No unprocessed listings found');
      return null;
    }

    const totalUsers = await prisma.telegramUser.count({
      where: {
        isSubscribed: true,
        isOnboarded: true,
      },
    });

    console.log(`👥 Found ${totalUsers} subscribed users to process`);
    await logInfo(`Found ${totalUsers} subscribed users to process`, {
      totalUsers,
    });

    let processedUsers = 0;
    let skip = 0;

    while (skip < totalUsers) {
      console.log(
        `📦 Processing batch ${Math.floor(skip / BATCH_SIZE) + 1}/${Math.ceil(totalUsers / BATCH_SIZE)}`,
      );
      await logInfo(
        `Processing batch ${Math.floor(skip / BATCH_SIZE) + 1}/${Math.ceil(totalUsers / BATCH_SIZE)}`,
        {
          batchNumber: Math.floor(skip / BATCH_SIZE) + 1,
          totalBatches: Math.ceil(totalUsers / BATCH_SIZE),
          skip,
          batchSize: BATCH_SIZE,
        },
      );

      const userBatch = await prisma.telegramUser.findMany({
        where: {
          isSubscribed: true,
          isOnboarded: true,
        },
        select: {
          chatId: true,
          preferences: true,
          username: true,
          userId: true,
          user: {
            select: {
              location: true,
            },
          },
        },
        skip,
        take: BATCH_SIZE,
        orderBy: {
          id: 'asc',
        },
      });

      for (const user of userBatch) {
        try {
          const userPreferences =
            user.preferences as unknown as UserPreferences;

          if (!userPreferences) {
            console.warn(`User ${user.chatId} has no preferences, skipping`);
            await logWarn(`User has no preferences, skipping`, {
              userId: user.chatId.toString(),
              userName: user.username,
            });
            continue;
          }

          for (const listing of recentListings) {
            const matchResult = matchesUserPreferences(
              userPreferences,
              listing,
            );

            const regionMatch = matchesRegion(
              listing.region,
              user.user?.location,
            );

            if (matchResult.matches && regionMatch) {
              console.log(
                `✅ Sending notification to ${user.username || user.chatId} for listing: ${listing.title}`,
              );
              await logInfo(
                `Sending notification to user for listing: ${listing.title}`,
                {
                  userId: user.chatId.toString(),
                  userName: user.username,
                  listingId: listing.id,
                  listingTitle: listing.title,
                  listingType: listing.type,
                  matchReason: matchResult,
                },
              );

              const sent = await sendNotification(user.chatId, listing);
              if (sent) {
                result.notificationsSent++;
              } else {
                result.errors.push(
                  `Failed to send notification to user ${user.chatId} for listing ${listing.id}`,
                );
              }

              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }

          processedUsers++;
        } catch (error) {
          console.error(`Error processing user ${user.chatId}:`, error);
          await logWarn(`Error processing user ${user.chatId}: ${error}`, {
            userId: user.chatId.toString(),
            userName: user.username,
            originalError:
              error instanceof Error ? error.message : String(error),
          });
          result.errors.push(`Error processing user ${user.chatId}: ${error}`);
        }
      }

      skip += BATCH_SIZE;

      if (skip < totalUsers) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    result.processedUsers = processedUsers;

    for (const listing of recentListings) {
      try {
        await prisma.emailLogs.create({
          data: {
            type: 'NEW_LISTING_TELEGRAM',
            bountyId: listing.id,
          },
        });
        console.log(`📝 Created telegram log for listing: ${listing.title}`);
      } catch (error) {
        console.error(
          `Failed to create telegram log for listing ${listing.id}:`,
          error,
        );
        await logWarn(
          `Failed to create telegram log for listing ${listing.id}`,
          {
            listingId: listing.id,
            listingTitle: listing.title,
            originalError:
              error instanceof Error ? error.message : String(error),
          },
        );
        result.errors.push(
          `Failed to create log for listing ${listing.id}: ${error}`,
        );
      }
    }

    console.log(`✅ Notification processing complete:`);
    console.log(`📊 Processed ${result.processedListings} listings`);
    console.log(`👥 Processed ${result.processedUsers} users`);
    console.log(`📱 Sent ${result.notificationsSent} notifications`);
    console.log(`❌ Encountered ${result.errors.length} errors`);

    await logInfo('Notification processing complete', {
      processedListings: result.processedListings,
      processedUsers: result.processedUsers,
      notificationsSent: result.notificationsSent,
      errorsCount: result.errors.length,
      success: result.success,
    });

    if (result.errors.length > 0) {
      console.error('Sample errors:', result.errors.slice(0, 5));
      await logWarn('Multiple errors occurred during notification processing', {
        totalErrors: result.errors.length,
        sampleErrors: result.errors.slice(0, 5),
        processedListings: result.processedListings,
        processedUsers: result.processedUsers,
      });
    }

    return null;
  } catch (error) {
    console.error('Fatal error in notification processing:', error);
    await logError(new Error('Fatal error in notification processing'), {
      originalError: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
