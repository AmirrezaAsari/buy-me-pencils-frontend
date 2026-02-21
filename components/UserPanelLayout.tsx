'use client';

import React, { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface UserPanelLayoutProps {
  children: ReactNode;
}

const icons = {
  profile: (
    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  payments: (
    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
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
    <div className="flex flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 gap-10">
      <aside className="w-64 shrink-0">
        <nav
          className="hero-card sticky top-24 overflow-hidden flex flex-col p-0"
          aria-label="User panel"
        >
          {/* Section header */}
          <div className="px-5 pt-5 pb-3 border-b border-[rgba(0,0,0,0.06)]">
            <p className="font-display text-xs font-semibold uppercase tracking-wider text-[#6b7280]">
              Account
            </p>
            <div className="accent-line-xl mt-3" />
          </div>
          {/* Nav links */}
          <div className="flex flex-col gap-1 p-3 pt-4">
            {navItems.map(({ href, label, icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`group flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#c17f59]/12 text-[#b06d47] border-l-4 border-l-[#c17f59]'
                      : 'text-[#374151] hover:bg-[#f9fafb] hover:text-[#1a1a1a]'
                  }`}
                >
                  <span
                    className={isActive ? 'text-[#c17f59]' : 'text-[#6b7280] group-hover:text-[#4b5563]'}
                    aria-hidden
                  >
                    {icons[icon]}
                  </span>
                  <span className="font-sans">{label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
