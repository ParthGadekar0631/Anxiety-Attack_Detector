"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const links = [
  { href: '/', label: 'Home', public: true },
  { href: '/dashboard', label: 'Dashboard', public: false },
  { href: '/check-in', label: 'Check-in', public: false },
];

export function Navbar() {
  const pathname = usePathname();
  const { status } = useSession();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
          <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">AAD</span>
          <span className="hidden sm:inline">Anxiety Attack Detection</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links
            .filter((link) => link.public || status === 'authenticated')
            .map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium text-slate-600 transition hover:text-slate-900',
                  pathname === link.href && 'text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
        </nav>
        <div className="flex items-center gap-2">
          {status === 'authenticated' ? (
            <Button variant="outline" onClick={() => signOut({ callbackUrl: '/' })}>
              Sign out
            </Button>
          ) : (
            <Button variant="primary" onClick={() => signIn()}>
              Sign in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
