import { render } from '@react-email/render';

import { kashEmail } from '../../constants';
import { PaymentReceivedTemplate } from '../../email-templates';
import { prisma } from '../../prisma';

export async function processAddPayment(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: { listing: true, user: true },
  });

  if (submission && submission.listing.rewards) {
    const winnerPosition = submission.winnerPosition;

    const rewardAmount = (submission?.listing?.rewards as any)[winnerPosition!];

    const emailHtml = await render(
      PaymentReceivedTemplate({
        name: submission.user.firstName!,
        tokenName: submission.listing.token,
        walletAddress: submission.user.publicKey,
        username: submission.user.username,
        amount: rewardAmount,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: submission?.user.email,
      subject: `Payment Confirmation for ${submission.listing.title}`,
      html: emailHtml,
      checkUnsubscribe: false,
    };
    return emailData;
  }

  return;
}
