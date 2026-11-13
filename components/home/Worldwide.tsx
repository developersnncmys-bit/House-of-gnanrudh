'use client';

import { LuTruck, LuShieldCheck, LuLock } from 'react-icons/lu';

const promises = [
  {
    Icon: LuTruck,
    title: 'Free Shipping Across India',
    body: 'On every order, no minimum',
  },
  {
    Icon: LuShieldCheck,
    title: 'Insured Worldwide Delivery',
    body: 'Every parcel tracked and signed for',
  },
  {
    Icon: LuLock,
    title: 'Secure Checkout',
    body: 'All major cards · UPI · COD',
  },
];

/**
 * Worldwide — trust strip at the bottom of the home page. Reworked
 * as a deep-wine band with gold icons and ivory text — gives the home
 * page a confident dark brand moment before the footer, with hairline
 * gold dividers separating each promise.
 */
export default function Worldwide() {
  return (
    <section className="relative bg-maroon-deep text-ivory overflow-hidden">
      {/* Thin gold rules at the top and bottom of the band — reads as
          a framed brand ribbon rather than a plain color block. */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/40" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold/40" />

      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-0 sm:divide-x sm:divide-ivory/15">
          {promises.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex items-center justify-center gap-4 md:gap-5 sm:px-6 md:px-8"
            >
              {/* Icon — plain glyph in gold, a step up from the earlier
                  muted ink icon. */}
              <Icon
                className="shrink-0 text-gold"
                size={30}
                strokeWidth={1.4}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="text-sm md:text-[0.95rem] font-bold tracking-[0.03em] text-ivory leading-tight uppercase">
                  {title}
                </div>
                <div className="text-xs md:text-sm text-ivory/65 mt-1 leading-snug">
                  {body}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
