import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import ThankYouView from '@/components/order/ThankYouView';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'Thank you · House Of GnanRudh',
  description:
    'Your order has been placed. A confirmation has been sent to your email. Track your order or continue shopping.',
};

export default function ThankYouPage() {
  if (SOFT_LAUNCH) redirect('/home');
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <ThankYouView />
    </Suspense>
  );
}
