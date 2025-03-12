import { render } from '@react-email/render';

import { MobiusHackathonTemplate } from '../../email-templates/Listing/newHackathonTemplate';
import { prisma } from '../../prisma';

// Product-oriented skills to target
const productOrientedSkills = [
  'Blockchain',
  'Frontend',
  'Backend',
  'Mobile',
  'UI/UX Design',
  'Product Manager',
];

export async function processCreateHackathon() {
  try {
    // Find users with product-oriented skills who haven't unsubscribed
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
        email: {
          in: ['jayeshpotlabattini@gmail.com'],
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

    // Prepare email data for each user
    const emailData = await Promise.all(
      users.map(async (user) => {
        const emailHtml = await render(
          MobiusHackathonTemplate({
            name: user.firstName || 'there',
          }),
        );

        return {
          from: `Pratik from Earn <${process.env.PRATIK_EMAIL}>`,
          to: user.email,
          subject: 'Mobius Hackathon Submissions Are LIVE!',
          html: emailHtml,
        };
      }),
    );

    console.log(emailData);
    return emailData.filter((data) => data !== null);
  } catch (error) {
    console.error('Error in processHackathon:', error);
    throw error;
  }
}
