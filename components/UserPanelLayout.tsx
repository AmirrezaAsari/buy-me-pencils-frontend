'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserPanelLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/user/profile', label: 'Profile' },
  { href: '/user/payments', label: 'Payments' },
];

export default function UserPanelLayout({ children }: UserPanelLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 gap-8">
      <aside className="w-56 shrink-0">
        <nav
          className="sticky top-24 flex flex-col gap-1 rounded-xl border border-black/[0.06] bg-white/90 p-2 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]"
          aria-label="User panel"
        >
          {navItems.map(({ href, label }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[#c17f59]/12 text-[#c17f59]'
                    : 'text-[#4b5563] hover:bg-black/[0.04] hover:text-[#1a1a1a]'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
