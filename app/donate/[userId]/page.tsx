'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getPublicUser } from '../../../lib/api';
import DonationPage from '../../../components/donation/DonationPage';

export default function DonatePage() {
  const params = useParams();
  const userId = typeof params.userId === 'string' ? params.userId : '';
  const [name, setName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userId) {
      setError('Invalid link');
      setLoading(false);
      return;
    }
    getPublicUser(userId)
      .then((data) => setName(data.name))
      .catch((err) => setError(err instanceof Error ? err.message : 'Failed to load'))
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <main className="min-h-screen flex flex-col">
      <header className="w-full border-b border-black/[0.06] bg-white/90 backdrop-blur-md sticky top-0 z-40 shadow-[0_1px_0_0_rgba(0,0,0,0.03)]">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/home"
            className="inline-flex items-center gap-2.5 text-[#1a1a1a] no-underline hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded-lg"
          >
            <span className="w-9 h-9 rounded-lg bg-[#c17f59]/12 flex items-center justify-center shrink-0" aria-hidden>
              <svg className="w-5 h-5 text-[#c17f59]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 19l7-7 3 3-7 7-3-3z" />
                <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
              </svg>
            </span>
            <span className="font-display font-semibold text-lg tracking-tight">Buy me a pencil</span>
          </Link>
          <Link
            href="/user"
            className="font-display font-medium text-[#1a1a1a] text-[15px] py-2 px-4 rounded-lg border border-[#e5e7eb] bg-white hover:bg-[#faf9f7] transition-colors"
          >
            Sign in
          </Link>
        </div>
      </header>

      {loading && (
        <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
          <div className="hero-card w-full max-w-md px-8 py-12 text-center">
            <p className="text-[#6b7280] font-sans">Loading…</p>
          </div>
        </section>
      )}

      {!loading && (error || !name) && (
        <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
          <div className="hero-card w-full max-w-md px-8 py-12 text-center">
            <div className="accent-line-xl mx-auto mb-6" />
            <h1 className="font-display text-xl font-semibold text-[#1a1a1a] mb-2">Creator not found</h1>
            <p className="text-[#6b7280] text-sm">
              {error || 'This donation link is invalid or the creator is no longer available.'}
            </p>
          </div>
        </section>
      )}

      {!loading && name && (
        <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
          <DonationPage creatorId={userId} creatorName={name} />
        </section>
      )}
    </main>
  );
}
