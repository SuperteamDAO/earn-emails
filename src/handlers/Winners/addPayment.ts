import { render } from '@react-email/render';

import { pratikEmail } from '../../constants/emails';
import { PaymentReceivedTemplate } from '../../email-templates/Winners/paymentReceivedTemplate';
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
        username: submission.user.username,
        amount: rewardAmount,
      }),
    );

    const emailData = {
      from: pratikEmail,
      to: submission?.user.email,
      subject: `Payment Confirmation for ${submission.listing.title}`,
      html: emailHtml,
      checkUnsubscribe: false,
    };
    return emailData;
  }

  return;
}
