'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatINR } from '@/lib/sarees';

const REDIRECT_SECONDS = 4;

export default function PaymentSuccessView() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get('order') || params.get('id') || 'TV00000000';
  const ref = params.get('ref') || params.get('txn') || '';
  const amountRaw = params.get('amount') || '';
  const amount = amountRaw ? Number(amountRaw) : null;
  const method = (params.get('method') || 'card').toUpperCase();

  const [remaining, setRemaining] = useState(REDIRECT_SECONDS);

  // Intermediate page — bounce to the order thank-you after a few seconds.
  useEffect(() => {
    const tick = window.setInterval(() => {
      setRemaining((s) => Math.max(s - 1, 0));
    }, 1000);
    const redirect = window.setTimeout(() => {
      const next = new URLSearchParams({ id: orderId });
      router.replace(`/order/thank-you?${next.toString()}`);
    }, REDIRECT_SECONDS * 1000);
    return () => {
      window.clearInterval(tick);
      window.clearTimeout(redirect);
    };
  }, [router, orderId]);

  return (
    <div className="min-h-screen bg-bone text-ink flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[460px]">
        {/* Success medallion */}
        <div className="flex justify-center">
          <div
            aria-hidden
            className="w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_6px_24px_-8px_rgba(5,120,80,0.45)]"
          >
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M4 12.5 10 18 20 6" />
            </svg>
          </div>
        </div>

        <h1 className="mt-5 font-display text-2xl md:text-3xl font-bold text-ink text-center leading-tight">
          Payment received
        </h1>
        <p className="mt-2 text-sm text-ink/65 text-center">
          Paid via <span className="font-semibold text-ink">{method}</span>
        </p>
        <span aria-hidden className="block mx-auto h-px w-10 bg-gold/70 mt-5" />

        {/* Receipt card */}
        <div className="mt-6 bg-white border border-ink/10 rounded-sm overflow-hidden">
          {/* Order + amount headline */}
          <div className="grid grid-cols-2 border-b border-ink/10">
            <div className="p-5">
              <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-ink/55">Order</div>
              <div className="mt-1 text-sm font-bold text-ink tabular-nums font-mono break-all">
                {orderId}
              </div>
            </div>
            <div className="p-5 border-l border-ink/10 text-right">
              <div className="text-[11px] font-semibold tracking-[0.15em] uppercase text-ink/55">Paid</div>
              <div className="mt-1 text-lg font-bold text-ink tabular-nums">
                {amount != null ? formatINR(amount) : '—'}
              </div>
            </div>
          </div>

          <dl className="px-5 py-4 space-y-2.5">
            {ref && (
              <Row label="Reference">
                <span className="font-mono text-xs font-semibold text-ink break-all">{ref}</span>
              </Row>
            )}
            <Row label="Status">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" aria-hidden />
                Authorised
              </span>
            </Row>
          </dl>

          <div className="px-5 pb-5">
            <p className="text-[11px] text-ink/60 tabular-nums text-center mb-3">
              Redirecting to your order confirmation in{' '}
              <span className="font-bold text-ink">{remaining}</span>s…
            </p>
            <Link
              href={`/order/thank-you?id=${orderId}`}
              className="block w-full text-center bg-ink text-white py-3.5 text-xs font-bold tracking-[0.18em] uppercase hover:bg-maroon-deep transition-colors"
            >
              Go to order
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-ink/50 text-center leading-relaxed">
          Keep this reference number — you&apos;ll see it on your statement.
        </p>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-ink/60">{label}</dt>
      <dd className="text-right min-w-0">{children}</dd>
    </div>
  );
}
