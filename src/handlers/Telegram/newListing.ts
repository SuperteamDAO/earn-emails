import { prisma } from '../../prisma';
import { type UserPreferences } from '../../types/telegramUserBot';
import { logError, logInfo, logWarn } from '../../utils/logger';
import { matchesUserPreferences } from './matchPreference';
import { matchesRegion } from './matchRegion';
import { sendNotification } from './sendTelegramListingNotification';

interface NotificationResult {
  success: boolean;
  notificationsSent: number;
  errors: string[];
  processedUsers: number;
  listingId: string;
  listingTitle?: string;
}

export async function processTelegramNewListing(listingId: string) {
  try {
    const result: NotificationResult = {
      success: true,
      notificationsSent: 0,
      errors: [],
      processedUsers: 0,
      listingId,
    };

    console.log(`🔍 Processing single listing: ${listingId}`);
    await logInfo(`Processing single listing: ${listingId}`, { listingId });

    const telegramLogExists = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listingId,
        type: 'NEW_LISTING_TELEGRAM',
      },
    });

    if (telegramLogExists) {
      console.log(`⚠️ Listing ${listingId} already processed, skipping`);
      await logInfo(`Listing already processed, skipping`, { listingId });
      return null;
    }

    const listing = await prisma.bounties.findUnique({
      where: { id: listingId },
      include: {
        sponsor: true,
      },
    });

    if (!listing) {
      console.log(`❌ Listing ${listingId} not found`);
      await logWarn(`Listing not found`, { listingId });
      return null;
    }

    const isEligible =
      listing.isPublished &&
      listing.isActive &&
      !listing.isPrivate &&
      !listing.isWinnersAnnounced &&
      !listing.isArchived &&
      listing.status === 'OPEN';

    if (!isEligible) {
      console.log(`⚠️ Listing ${listingId} is not eligible for notifications`);
      await logInfo(`Listing not eligible for notifications`, {
        listingId,
        listingTitle: listing.title,
        isPublished: listing.isPublished,
        isActive: listing.isActive,
        isPrivate: listing.isPrivate,
        isArchived: listing.isArchived,
        status: listing.status,
        isWinnersAnnounced: listing.isWinnersAnnounced,
      });
      return null;
    }

    result.listingTitle = listing.title;

    console.log(`📋 Processing listing: "${listing.title}" (${listingId})`);
    await logInfo(`Processing listing: "${listing.title}"`, {
      listingId,
      listingTitle: listing.title,
      listingType: listing.type,
      sponsorName: listing.sponsor.name,
    });

    const users = await prisma.telegramUser.findMany({
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
    });

    console.log(`👥 Found ${users.length} subscribed users to process`);
    await logInfo(`Found ${users.length} subscribed users to process`, {
      totalUsers: users.length,
      listingId,
      listingTitle: listing.title,
    });

    for (const user of users) {
      try {
        const userPreferences = user.preferences as unknown as UserPreferences;

        if (!userPreferences) {
          console.warn(`User ${user.chatId} has no preferences, skipping`);
          await logWarn(`User has no preferences, skipping`, {
            userId: user.chatId.toString(),
            listingId,
          });
          continue;
        }

        const matchResult = matchesUserPreferences(userPreferences, listing);
        console.log(matchResult.reasons);

        const regionMatch = matchesRegion(listing.region, user.user?.location);
        console.log(
          `Regional match for user ${user.chatId}: ${regionMatch} (listing region: ${listing.region}, user location: ${
            user.user?.location || 'none'
          })`,
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

        result.processedUsers++;
      } catch (error) {
        console.error(`Error processing user ${user.chatId}:`, error);
        await logWarn(`Error processing user ${user.chatId}: ${error}`, {
          userId: user.chatId.toString(),
          userName: user.username,
          listingId,
          originalError: error instanceof Error ? error.message : String(error),
        });
        result.errors.push(`Error processing user ${user.chatId}: ${error}`);
      }
    }

    try {
      await prisma.emailLogs.create({
        data: {
          type: 'NEW_LISTING_TELEGRAM',
          bountyId: listing.id,
        },
      });
      console.log(`📝 Created telegram log for listing: ${listing.title}`);
      await logInfo(`Created telegram log for listing`, {
        listingId: listing.id,
        listingTitle: listing.title,
      });
    } catch (error) {
      console.error(
        `Failed to create telegram log for listing ${listing.id}:`,
        error,
      );
      await logWarn(`Failed to create telegram log for listing`, {
        listingId: listing.id,
        listingTitle: listing.title,
        originalError: error instanceof Error ? error.message : String(error),
      });
      result.errors.push(
        `Failed to create log for listing ${listing.id}: ${error}`,
      );
      result.success = false;
    }

    console.log(`✅ Single listing notification processing complete:`);
    console.log(`📋 Listing: "${result.listingTitle}" (${result.listingId})`);
    console.log(`👥 Processed ${result.processedUsers} users`);
    console.log(`📱 Sent ${result.notificationsSent} notifications`);
    console.log(`❌ Encountered ${result.errors.length} errors`);

    await logInfo('Single listing notification processing complete', {
      listingId: result.listingId,
      listingTitle: result.listingTitle,
      processedUsers: result.processedUsers,
      notificationsSent: result.notificationsSent,
      errorsCount: result.errors.length,
      success: result.success,
    });

    if (result.errors.length > 0) {
      console.error('some errors:', result.errors);
      await logWarn(
        'Errors occurred during single listing notification processing',
        {
          listingId,
          listingTitle: result.listingTitle,
          totalErrors: result.errors.length,
          sampleErrors: result.errors.slice(0, 5),
          processedUsers: result.processedUsers,
        },
      );
    }

    return null;
  } catch (error) {
    console.error(
      'Fatal error in single listing notification processing:',
      error,
    );
    await logError(
      new Error('Fatal error in single listing notification processing'),
      {
        listingId,
        originalError: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
    );
    return null;
  }
}
