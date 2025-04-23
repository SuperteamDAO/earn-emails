import { render } from '@react-email/render';

import { RedactedHackathonTemplate } from '../../email-templates/Listing/newHackathonTemplate';
import { prisma } from '../../prisma';

const productOrientedSkills = [
  'Python',
  'Postgres',
  'MongoDB',
  'MySQL',
  'Rust',
  'Data Analytics',
  'Research',
  'Writing',
];

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
      users
        .filter((s) => s.email === 'jayeshpotlabattini@gmail.com')
        .map(async (user) => {
          const emailHtml = await render(
            RedactedHackathonTemplate({
              name: user.firstName || 'there',
            }),
          );

          return {
            from: `Pratik from Earn <${process.env.PRATIK_EMAIL}>`,
            to: user.email,
            subject: `You're 7 days away from missing out on $170K from [REDACTED]`,
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
