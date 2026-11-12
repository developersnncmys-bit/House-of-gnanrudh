'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  LuCircleUser,
  LuUser,
  LuPackage,
  LuHeart,
  LuLogOut,
} from 'react-icons/lu';
import { useAuth } from '@/lib/auth';
import { useLoginModal } from '@/lib/login-modal';
import { navHref } from '@/lib/soft-launch';

// Soft-launch gate — mirrors the flag in `components/Nav.tsx`. When
// true, the account icon renders inert.
const SOFT_LAUNCH = false;

/**
 * AccountMenu — the user icon in the nav.
 *
 * Signed out: a single button that opens the LoginModal.
 * Signed in: a tight popover anchored under the icon with
 * "Welcome {name}!", a short list of account links, and Sign Out.
 */
export default function AccountMenu() {
  const { user, hydrated, signOut } = useAuth();
  const { openLogin } = useLoginModal();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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
          className={clsx(
            'inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 origin-center',
            open && 'text-maroon scale-110 -translate-y-0.5',
          )}
        >
          <IconUser />
        </span>
        <span
          aria-hidden
          className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-peacock animate-badge-pop"
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-[220px] bg-white border border-ink/10 shadow-lg py-2 z-50 animate-menu-in"
        >
          <div className="px-4 py-2 text-sm text-ink">
            Welcome {firstName}!
          </div>

          <MenuItem
            href={navHref('/account')}
            onClick={() => setOpen(false)}
            icon={<LuUser size={16} strokeWidth={1.7} aria-hidden />}
          >
            Account Details
          </MenuItem>
          <MenuItem
            href={navHref('/account/orders')}
            onClick={() => setOpen(false)}
            icon={<LuPackage size={16} strokeWidth={1.7} aria-hidden />}
          >
            Order History
          </MenuItem>
          <MenuItem
            href={navHref('/shop?wishlist=1')}
            onClick={() => setOpen(false)}
            icon={<LuHeart size={16} strokeWidth={1.7} aria-hidden />}
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
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-ink/5 transition-colors text-left"
          >
            <span className="text-ink/60">
              <LuLogOut size={16} strokeWidth={1.7} aria-hidden />
            </span>
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
  href: string | undefined;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const cls =
    'flex items-center gap-3 px-4 py-2 text-sm text-ink hover:bg-ink/5 transition-colors';
  const body = (
    <>
      <span className="text-ink/60">{icon}</span>
      {children}
    </>
  );
  if (!href) {
    return (
      <span role="menuitem" className={clsx(cls, 'cursor-default opacity-60')}>
        {body}
      </span>
    );
  }
  return (
    <Link href={href} role="menuitem" onClick={onClick} className={cls}>
      {body}
    </Link>
  );
}

function IconUser() {
  return <LuCircleUser size={22} strokeWidth={1.8} aria-hidden />;
}
