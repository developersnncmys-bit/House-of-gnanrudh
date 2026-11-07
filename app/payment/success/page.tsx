import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import PaymentSuccessView from '@/components/payment/PaymentSuccessView';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'Payment successful · House Of GnanRudh',
  description: 'Your payment has been received. Redirecting to your order confirmation.',
};

export default function PaymentSuccessPage() {
  if (SOFT_LAUNCH) redirect('/home');
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <PaymentSuccessView />
    </Suspense>
  );
}
