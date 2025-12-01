import { render } from '@react-email/render';
import dayjs from 'dayjs';
import { prisma } from 'src/prisma';

import { type User } from '@/prisma/client';

import { basePath } from '../../constants/basePath';
import { pratikEmail } from '../../constants/emails';
import { ProListingTemplate } from '../../email-templates/Listing/proListingTemplate';
import {
  developmentSkills,
  nonDevelopmentSubSkills,
  type Skills,
} from '../../types/Skills';
import { getCombinedRegion } from '../../utils/region';

export async function processCreateProListing() {
  try {
    const eighteenHoursAgo = dayjs().subtract(18, 'hours').toISOString();
    const lastWeek = dayjs().subtract(7, 'days').toISOString();
    const now = dayjs().toISOString();

    console.log(eighteenHoursAgo);

    const listings = await prisma.bounties.findMany({
      where: {
        isPublished: true,
        isPrivate: false,
        isWinnersAnnounced: false,
        isPro: true,
        deadline: {
          gt: now,
        },
        type: {
          not: 'hackathon',
        },
        publishedAt: {
          gte: lastWeek,
          lt: eighteenHoursAgo,
        },
        shouldSendEmail: true,
      },
      select: {
        id: true,
        title: true,
        region: true,
        skills: true,
        type: true,
        slug: true,
        rewardAmount: true,
        token: true,
        isPro: true,
        usdValue: true,
        sponsor: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        publishedAt: 'asc',
      },
    });

    if (listings.length === 0) {
      console.error('No Pro listing found');
      return;
    }

    let selectedListing = null;

    for (const listing of listings) {
      const emailLogExists = await prisma.emailLogs.findFirst({
        where: {
          bountyId: listing.id,
          type: 'NEW_LISTING',
        },
      });

      if (!emailLogExists) {
        selectedListing = listing;
        break;
      }
    }

    if (!selectedListing) {
      console.error('All Pro listings already have email logs');
      return;
    }

    const regionObject = getCombinedRegion(selectedListing.region);
    const countries = regionObject?.country || [];

    const listingSkills = selectedListing.skills as Skills;
    const listingMainSkills = listingSkills.map((skill) => skill.skills);
    const listingSubSkills = listingSkills.flatMap((skill) => skill.subskills);

    const eligibleUsersResult = await prisma.$queryRaw<
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
        OR u.superteamLevel LIKE '%Superteam%'
        OR (COALESCE(submission_stats.listing_winnings, 0) + COALESCE(grant_stats.grant_winnings, 0)) > 1000
      )
    `;

    const eligibleUserIds = eligibleUsersResult.map((r) => r.userId);

    if (eligibleUserIds.length === 0) {
      console.error('No eligible Pro users found');
      return;
    }

    const listingDevelopmentSkills = listingMainSkills.filter((skill) =>
      developmentSkills.includes(skill),
    );
    const listingNonDevelopmentSubSkills = listingSubSkills.filter((subskill) =>
      nonDevelopmentSubSkills.includes(subskill),
    );

    const developmentSkillConditions = listingDevelopmentSkills.map(
      (skill) => ({
        skills: {
          path: '$[*].skills',
          array_contains: skill,
        },
      }),
    );

    const nonDevelopmentSubSkillConditions = listingNonDevelopmentSubSkills.map(
      (subskill) => ({
        skills: {
          path: '$[*].subskills',
          array_contains: subskill,
        },
      }),
    );

    type UserSelect = Pick<User, 'id' | 'firstName' | 'email' | 'skills'>;
    const users: UserSelect[] = await prisma.user.findMany({
      where: {
        id: { in: eligibleUserIds },
        isTalentFilled: true,
        ...(selectedListing.region !== 'Global' && {
          location: { in: countries },
        }),
        OR: [
          ...developmentSkillConditions,
          ...nonDevelopmentSubSkillConditions,
        ],
        emailSettings: {
          some: {
            category: 'createListing',
          },
        },
      },
      select: {
        id: true,
        firstName: true,
        email: true,
        skills: true,
      },
    });

    const emailData = await Promise.all(
      users.map(async (user) => {
        let userSkills: Skills | null = null;

        if (typeof user.skills === 'string') {
          try {
            userSkills = JSON.parse(user.skills);
          } catch (error) {
            console.error(`Failed to parse skills for user ${user.id}:`, error);
            return null;
          }
        } else {
          userSkills = user.skills as Skills;
        }

        if (!userSkills) return null;

        const listingLink = `${basePath}/listing/${selectedListing.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`;

        const roundedAmount =
          Math.round((selectedListing.usdValue ?? 0) / 10) * 10;

        const emailHtml = await render(
          ProListingTemplate({
            name: user.firstName!,
            link: listingLink,
            listing: selectedListing,
            roundedAmount,
          }),
        );

        const subject = `New Pro-only Opportunity by ${selectedListing.sponsor.name}`;

        return {
          from: pratikEmail,
          to: user.email,
          subject,
          html: emailHtml,
        };
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'NEW_LISTING',
        bountyId: selectedListing.id,
      },
    });

    return emailData.filter((data) => data !== null);
  } catch (error) {
    console.error('Error in processCreateProListing:', error);
    throw error;
  }
}
