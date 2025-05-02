import { render } from '@react-email/render';

import { BreakoutSidetracksTemplate } from '../../email-templates/Listing/newHackathonTemplate';
import { prisma } from '../../prisma';

const productOrientedSkills = ['Frontend', 'Backend', 'Blockchain', 'Mobile'];

export async function processCreateHackathon() {
  try {
    const users = await prisma.user.findMany({
      where: {
        isTalentFilled: true,
        OR: [
          ...productOrientedSkills.map((skill) => ({
            skills: {
              path: '$[*].skills',
              array_contains: skill,
            },
          })),
          ...productOrientedSkills.map((skill) => ({
            skills: {
              path: '$[*].subskills',
              array_contains: skill,
            },
          })),
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

    console.log(
      `Found ${users.length} eligible users for hackathon notification`,
    );

    const emailData = await Promise.all(
      users.map(async (user) => {
        const emailHtml = await render(
          BreakoutSidetracksTemplate({
            name: user.firstName || 'there',
          }),
        );

        return {
          from: `Pratik from Earn <${process.env.PRATIK_EMAIL}>`,
          to: user.email,
          subject: `Earn has $300K+ in exclusive sidetracks for Solana Breakout`,
          html: emailHtml,
        };
      }),
    );

    return emailData.filter((data) => data !== null);
  } catch (error) {
    console.error('Error in processHackathon:', error);
    throw error;
  }
}
