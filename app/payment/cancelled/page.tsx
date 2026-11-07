import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentCancelledView from '@/components/payment/PaymentCancelledView';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'Payment cancelled · House Of GnanRudh',
  description:
    'Your payment was not completed. Your bag is still saved — retry with a different method or contact us for help.',
};

export default function PaymentCancelledPage() {
  if (SOFT_LAUNCH) redirect('/home');
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <PaymentCancelledView />
    </Suspense>
  );
}
