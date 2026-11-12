'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import clsx from 'clsx';
import {
  LuUser,
  LuPackage,
  LuMapPin,
  LuHeart,
  LuLogOut,
} from 'react-icons/lu';
import { useAuth } from '@/lib/auth';
import { useLoginModal } from '@/lib/login-modal';

// Shared chrome for the /account/* section. A single left-column panel
// holds the signed-in user chip, the section nav, and Sign Out; the
// right column is a slot each page fills with its own form / list.
//
// Auth gate: pages under /account/* are visitor-only. If the auth
// provider has hydrated and there is no user, we bounce back to `/`
// and open the login modal so they can sign in from there.

const NAV = [
  {
    href: '/account',
    label: 'Account Details',
    icon: <LuUser size={16} strokeWidth={1.7} aria-hidden />,
  },
  {
    href: '/account/orders',
    label: 'Orders',
    icon: <LuPackage size={16} strokeWidth={1.7} aria-hidden />,
  },
  {
    href: '/account/addresses',
    label: 'Addresses',
    icon: <LuMapPin size={16} strokeWidth={1.7} aria-hidden />,
  },
  {
    href: '/shop?wishlist=1',
    label: 'Wishlist',
    icon: <LuHeart size={16} strokeWidth={1.7} aria-hidden />,
  },
];

export default function AccountShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, signOut } = useAuth();
  const { openLogin } = useLoginModal();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace('/');
      openLogin();
    }
  }, [hydrated, user, router, openLogin]);

  if (!hydrated || !user) {
    return <div className="min-h-screen bg-white" />;
  }

  const initial = (user.name?.[0] || user.email[0] || '?').toUpperCase();
  const firstName = user.name?.split(' ')[0] || user.name;

  return (
    // Extra top padding compensates for Nav Row 3 (the centred link
    // bar). SiteShell's own pt-[109px] was computed before that
    // sub-row returned. Same pattern as NewArrivalsIntro.
    <div className="bg-white min-h-screen pt-12 md:pt-16 lg:pt-20">
      <div className="max-w-[1180px] mx-auto px-4 md:px-6 lg:px-8 pb-16">
        {/* Section header — micro eyebrow + serif title. */}
        <header className="mb-10 md:mb-12">
          <div className="text-[0.65rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
            My Account
          </div>
          <h1 className="font-display text-[2rem] md:text-[2.5rem] text-ink leading-none">
            {title}
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 md:gap-12">
          {/* Sidebar — one unified panel. */}
          <aside className="md:border-r md:border-ink/10 md:pr-6">
            <div className="flex items-center gap-3 pb-5 mb-4 border-b border-ink/10">
              <span
                aria-hidden
                className="w-9 h-9 rounded-full bg-ivory text-ink flex items-center justify-center font-display text-base leading-none shrink-0 ring-1 ring-gold-deep/40"
              >
                {initial}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-ink truncate leading-tight">
                  {firstName}
                </div>
                <div className="text-xs text-ink/55 truncate mt-0.5">
                  {user.email}
                </div>
              </div>
            </div>

            <nav className="flex flex-col">
              {NAV.map((item) => {
                const active = matchesActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={clsx(
                      'flex items-center gap-3 py-2.5 text-sm transition-colors group',
                      active
                        ? 'text-ink font-semibold'
                        : 'text-ink/70 hover:text-ink',
                    )}
                  >
                    <span
                      className={clsx(
                        'shrink-0 transition-colors',
                        active
                          ? 'text-gold-deep'
                          : 'text-ink/45 group-hover:text-gold-deep',
                      )}
                    >
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                    {active && (
                      <span
                        aria-hidden
                        className="ml-auto w-1 h-4 bg-gold-deep"
                      />
                    )}
                  </Link>
                );
              })}
              <button
                type="button"
                onClick={signOut}
                className="flex items-center gap-3 py-2.5 mt-4 pt-4 border-t border-ink/10 text-sm text-ink/60 hover:text-ink transition-colors text-left group"
              >
                <span className="text-ink/45 group-hover:text-ink shrink-0 transition-colors">
                  <LuLogOut size={16} strokeWidth={1.7} aria-hidden />
                </span>
                <span>Sign Out</span>
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main className="min-w-0">{children}</main>
        </div>
      </div>
    </div>
  );
}

function matchesActive(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  // /shop?wishlist=1 lives outside the account section — don't highlight
  // it based on the bare pathname matching the link target.
  if (href.startsWith('/shop')) return false;
  if (href === '/account') return pathname === '/account';
  return pathname === href || pathname.startsWith(href + '/');
}
