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

export default function Worldwide() {
  return (
    <section className="bg-white border-t border-ink/10">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-10 md:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 md:gap-6">
          {promises.map(({ Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center px-4"
            >
              <Icon
                className="text-ink mb-3"
                size={28}
                strokeWidth={1.3}
                aria-hidden
              />
              <div className="font-sans text-base md:text-lg font-bold text-ink leading-tight">
                {title}
              </div>
              <div className="text-xs md:text-sm text-ink/60 mt-1.5">
                {body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
