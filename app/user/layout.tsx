import React, { ReactNode } from 'react';
import Link from 'next/link';

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen flex flex-col bg-[#faf9f7]">
      <header className="w-full border-b border-black/[0.06] bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2.5 text-[#1a1a1a] no-underline hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 focus:ring-offset-white rounded-lg"
          >
            <span
              className="w-9 h-9 rounded-lg bg-[#c17f59]/12 flex items-center justify-center shrink-0"
              aria-hidden
            >
              <svg
                className="w-5 h-5 text-[#c17f59]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
            </span>
            <span className="font-display font-semibold text-lg tracking-tight">
              Buy me a pencil
            </span>
          </Link>
        </div>
      </header>
      {children}
    </main>
  );
}
