// import { render } from '@react-email/render';
// import dayjs from 'dayjs';
// import utc from 'dayjs/plugin/utc';

// import { basePath } from '../../constants';
// import { pratikEmail } from '../../constants/emails';
// import { prisma } from '../../prisma';

// export async function processRollingProjectUnpublish() {
//   dayjs.extend(utc);

//   const twoMonthsAgoEnd = dayjs.utc().subtract(2, 'month').endOf('day');

//   const listings = await prisma.bounties.findMany({
//     where: {
//       isPublished: true,
//       isActive: true,
//       isArchived: false,
//       status: 'OPEN',
//       publishedAt: {
//         lt: twoMonthsAgoEnd.toISOString(),
//       },
//       isWinnersAnnounced: false,
//       type: 'project',
//       applicationType: 'rolling',
//     },
//     include: {
//       poc: true,
//       sponsor: true,
//     },
//   });
//   // console.log('listing IDs', listings.map((l) => l.id))
//   await prisma.bounties.updateMany({
//     where: {
//       id: {
//         in: listings.map((l) => l.id),
//       },
//     },
//     data: {
//       isPublished: false,
//     },
//   });

//   const emailData = [];

//   for (const listing of listings) {
//     if (!listing.poc?.email) {
//       console.log('POC has no email');
//       continue;
//     }

//     const emailHtml = await render(
//       RollingUnpublishTemplate({
//         name: listing.poc.firstName!,
//         listingName: listing.title,
//         link: `${basePath}/listings/${listing?.type}/${listing?.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
//       }),
//     );

//     await prisma.emailLogs.create({
//       data: {
//         type: 'ROLLING_UNPUBLISH',
//         bountyId: listing.id,
//       },
//     });

//     emailData.push({
//       from: pratikEmail,
//       to: listing.poc.email,
//       subject: 'Unpublishing Your Listing on Earn',
//       html: emailHtml,
//     });
//   }

//   return emailData.filter(Boolean);
// }
