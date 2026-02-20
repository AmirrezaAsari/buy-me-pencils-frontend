'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import DonationModal from '../../components/DonationModal';
import TypingText from '../../components/TypingText';

const DESCRIPTION =
  'Your support fuels my creative journey. Every donation helps me make more art, guides, and resources for the community.';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen flex flex-col">
      {/* Header: brand + subtle emphasis */}
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
          <Link
            href="/user"
            className="font-display font-medium text-[#1a1a1a] text-[15px] py-2 px-4 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#faf9f7] hover:border-[#d1d5db] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* Hero: centered, lots of space */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24">
        <div className="hero-card w-full max-w-xl px-8 py-12 sm:px-12 sm:py-16 text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[#1a1a1a] tracking-tight leading-[1.15] mb-6">
            Support my work
          </h1>

          <p className="text-[#4b5563] text-lg sm:text-xl leading-relaxed mb-10 max-w-md mx-auto min-h-[1.5em]">
            <TypingText text={DESCRIPTION} className="inline" />
          </p>

          <Button
            onClick={() => setIsModalOpen(true)}
            variant="primary"
            size="lg"
            className="btn-cta-xl"
          >
            Donate now
          </Button>
        </div>
      </section>

      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
