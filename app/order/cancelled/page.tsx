import type { Metadata } from 'next';
import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import OrderCancelledView from '@/components/order/OrderCancelledView';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'Order cancelled · House Of GnanRudh',
  description:
    'Your order has been cancelled. Any payment will be refunded to the original payment method within 5–7 working days.',
};

export default function OrderCancelledPage() {
  if (SOFT_LAUNCH) redirect('/home');
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <OrderCancelledView />
    </Suspense>
  );
}
