import { render } from '@react-email/render';

import { CypherpunkSidetracksTemplate } from '../../email-templates/Listing/newHackathonTemplate';
import { prisma } from '../../prisma';

const productOrientedSkills = ['Frontend', 'Backend', 'Blockchain', 'Mobile'];

// const testEmails = [
//   'jayeshpotlabattini@gmail.com',
//   // 'pratik.dholani1@gmail.com',
// ];

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
        // email: {
        //   in: testEmails,
        // },
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
          CypherpunkSidetracksTemplate({
            name: user.firstName || 'there',
          }),
        );

        return {
          from: `Pratik from Earn <${process.env.PRATIK_EMAIL}>`,
          to: user.email,
          subject: `$50,000 in Security Audit Credits for Cypherpunk Builders`,
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
