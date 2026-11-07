'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  LuUser,
  LuCreditCard,
  LuPackage,
  LuMapPin,
  LuHeart,
  LuLogOut,
} from 'react-icons/lu';
import { useAuth } from '@/lib/auth';
import { useLoginModal } from '@/lib/login-modal';

// Soft-launch gate — mirrors the flag in `components/Nav.tsx`. When
// true, the account icon still renders (same look) but clicks do
// nothing: no login modal, no dropdown, no sign-out. Flip to false to
// restore full behaviour. See memory: project_pages_unlinked_soft_launch.
const SOFT_LAUNCH = true;

/**
 * AccountMenu — the user icon in the nav.
 *
 * Signed out: a single button that opens the LoginModal (sign-in / sign-up).
 * Signed in: the same icon becomes the trigger for a dropdown showing
 * "Welcome <FirstName>!", Account Details, Order History, Wishlist, Sign Out.
 *
 * Until the auth provider has hydrated we render the signed-out variant so
 * the initial server-rendered HTML matches what the client paints — no
 * "Sign In flashes then becomes Account" flicker on hard reload.
 */
export default function AccountMenu() {
  const { user, hydrated, signOut } = useAuth();
  const { openLogin } = useLoginModal();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Soft-launch: render an inert account button that keeps the same
  // hover animation as the cart/wishlist icons, so the utility row
  // reads consistently. onClick is a no-op; the login modal stays
  // mounted globally in SiteShell but no trigger reaches it from here.
  if (SOFT_LAUNCH) {
    return (
      <button
        type="button"
        aria-label="Account"
        className="group p-2 text-ink hover:text-scarlet transition-colors cursor-default"
      >
        <span className="inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 origin-center">
          <IconUser />
        </span>
      </button>
    );
  }

  // Close on outside click / Escape so the menu behaves like a real popover.
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const signedIn = hydrated && user !== null;

  if (!signedIn) {
    return (
      <button
        type="button"
        onClick={() => openLogin()}
        aria-label="Account · login or sign up"
        className="group p-2 text-ink hover:text-scarlet transition-colors"
      >
        <span className="inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 origin-center">
          <IconUser />
        </span>
      </button>
    );
  }

  const firstName = user!.name.split(' ')[0] || user!.name;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Account menu for ${user!.name}`}
        className="group relative p-2 text-ink hover:text-scarlet transition-colors"
      >
        <span
          className={`inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 origin-center ${
            open ? 'text-maroon scale-110 -translate-y-0.5' : ''
          }`}
        >
          <IconUser />
        </span>
        {/* Signed-in dot — quiet peacock indicator that pulses on first
            paint, then stays as a static presence chip. */}
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-peacock animate-badge-pop"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-60 bg-ivory no-pattern border border-ink/10 shadow-lg py-2 z-50 origin-top-right animate-menu-in"
        >
          <div className="px-4 py-3 text-base text-ink">
            Welcome {firstName}!
          </div>

          <MenuItem href="/account" onClick={() => setOpen(false)} icon={<IconCard />}>
            Account Details
          </MenuItem>
          <MenuItem
            href="/account/orders"
            onClick={() => setOpen(false)}
            icon={<IconBox />}
          >
            Orders
          </MenuItem>
          <MenuItem
            href="/account/addresses"
            onClick={() => setOpen(false)}
            icon={<IconPin />}
          >
            Addresses
          </MenuItem>
          <MenuItem
            href="/shop?wishlist=1"
            onClick={() => setOpen(false)}
            icon={<IconHeart />}
          >
            Wishlist
          </MenuItem>

          <button
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="w-full px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  onClick,
  icon,
  children,
}: {
  href: string;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink hover:bg-ink/5 transition-colors"
    >
      <span className="text-ink/55">{icon}</span>
      {children}
    </Link>
  );
}

// Icon set — Lucide via react-icons. See the matching note in Nav.tsx
// about why we use a real library instead of hand-drawn paths.
function IconUser() {
  return <LuUser size={20} strokeWidth={2} aria-hidden />;
}

function IconCard() {
  return <LuCreditCard size={16} strokeWidth={1.7} aria-hidden />;
}

function IconBox() {
  return <LuPackage size={16} strokeWidth={1.7} aria-hidden />;
}

function IconPin() {
  return <LuMapPin size={16} strokeWidth={1.7} aria-hidden />;
}

function IconHeart() {
  return <LuHeart size={16} strokeWidth={1.7} aria-hidden />;
}

function IconSignOut() {
  return <LuLogOut size={16} strokeWidth={1.7} aria-hidden />;
}
