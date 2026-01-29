import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { basePath } from 'src/constants/basePath';

import {
  type BountiesModel,
  type SponsorsModel,
} from '../../generated/prisma/models';
import { logWarn } from '../../utils/logger';
import { telegramUserBot } from '../../utils/telegramUserBot';

dayjs.extend(utc);

type ListingWithSponsor = BountiesModel & {
  sponsor: SponsorsModel;
};

function generateListingUrl(
  listingSlug: string,
  source: string = 'telegram-notification',
): string {
  const baseUrl = basePath;
  const utm = new URLSearchParams({
    utm_source: source,
    utm_medium: 'telegram',
    utm_campaign: 'listing_notification',
  });

  return `${baseUrl}/listing/${listingSlug}?${utm.toString()}`;
}

export const BONUS_REWARD_POSITION = 99;
export const calculateTotalRewardsForPodium = (
  currentRewards: Record<string, number>,
  maxBonusSpots?: number,
) => {
  return Object.entries(currentRewards).reduce((sum, [pos, value]) => {
    if (isNaN(value)) return sum;

    if (Number(pos) === BONUS_REWARD_POSITION) {
      return sum + value * (maxBonusSpots || 0);
    }
    return sum + value;
  }, 0);
};

function formatNotificationMessage(listing: ListingWithSponsor): string {
  let priceText: string;

  if (listing.type !== 'project') {
    priceText = listing.rewards
      ? `Reward: ${calculateTotalRewardsForPodium(listing.rewards as Record<string, number>, listing.maxBonusSpots).toLocaleString()} ${listing.token}`
      : 'Reward available';
  } else {
    if (listing.compensationType === 'fixed') {
      priceText = listing.rewards
        ? `Compensation: ${calculateTotalRewardsForPodium(listing.rewards as Record<string, number>).toLocaleString()} ${listing.token}`
        : 'Compensation available';
    } else if (listing.compensationType === 'range') {
      if (listing.minRewardAsk && listing.maxRewardAsk) {
        priceText = `Compensation: ${listing.minRewardAsk.toLocaleString()} - ${listing.maxRewardAsk.toLocaleString()} ${listing.token}`;
      } else if (listing.minRewardAsk) {
        priceText = `Compensation: From ${listing.minRewardAsk.toLocaleString()} ${listing.token}`;
      } else if (listing.maxRewardAsk) {
        priceText = `Compensation: Up to ${listing.maxRewardAsk.toLocaleString()} ${listing.token}`;
      } else {
        priceText = 'Compensation available';
      }
    } else if (listing.compensationType === 'variable') {
      priceText = 'Compensation: Variable';
    } else {
      priceText = listing.rewards
        ? `Compensation: ${calculateTotalRewardsForPodium(listing.rewards as Record<string, number>).toLocaleString()} ${listing.token}`
        : 'Compensation available';
    }
  }

  const formatDeadline = (deadline: Date) => {
    return dayjs.utc(deadline).format('h:mm A on MMM D, YYYY (UTC)');
  };

  const typeEmoji =
    listing.type === 'bounty' ? '⚡' : listing.type === 'project' ? '💼' : '🖥️';

  return (
    `${typeEmoji} <b>New ${listing.type === 'hackathon' ? 'Hackathon' : listing.type.charAt(0).toUpperCase() + listing.type.slice(1)}!</b>\n\n` +
    `<b>${listing.title}</b> by ${listing.sponsor.name}\n\n` +
    `${priceText}\n` +
    `${listing.deadline ? `Deadline: ${formatDeadline(new Date(listing.deadline))}` : 'No deadline specified'}`
  );
}

export async function sendNotification(
  chatId: bigint,
  listing: ListingWithSponsor,
): Promise<boolean> {
  try {
    const message = formatNotificationMessage(listing);
    const listingUrl = generateListingUrl(listing.slug);

    await telegramUserBot.api.sendMessage(chatId.toString(), message, {
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: '🔗 View Listing',
              url: listingUrl,
            },
          ],
        ],
      },
    });

    return true;
  } catch (error: any) {
    console.error(`Failed to send notification to ${chatId}:`, error);
    await logWarn(
      `Failed to send notification to ${chatId}: ${error.message}`,
      {
        chatId: chatId.toString(),
        listingId: listing.id,
        listingTitle: listing.title,
        originalError: error.message,
      },
    );
    return false;
  }
}
