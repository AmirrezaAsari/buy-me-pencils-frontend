'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserPanelLayoutProps {
  children: ReactNode;
}

const icons = {
  profile: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  payments: (
    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2h-2m-4-1V7a2 2 0 012-2h2a2 2 0 012 2v1" />
    </svg>
  ),
} as const;

type IconKey = keyof typeof icons;

const navItems: { href: string; label: string; icon: IconKey }[] = [
  { href: '/user/profile', label: 'Profile', icon: 'profile' },
  { href: '/user/payments', label: 'Payments', icon: 'payments' },
];

export default function UserPanelLayout({ children }: UserPanelLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 gap-8">
      <aside className="w-56 shrink-0">
        <nav
          className="hero-card sticky top-24 flex flex-col gap-0.5 p-2"
          aria-label="User panel"
        >
          <div className="px-3 py-2 mb-1">
            <div className="accent-line-xl" />
          </div>
          {navItems.map(({ href, label, icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#c17f59]/14 text-[#c17f59] shadow-[inset_0_0_0_1px_rgba(193,127,89,0.15)]'
                    : 'text-[#4b5563] hover:bg-[#faf9f7] hover:text-[#1a1a1a]'
                }`}
              >
                <span className={isActive ? 'text-[#c17f59]' : 'text-[#9ca3af]'}>
                  {icons[icon]}
                </span>
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
