'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import UserPanelLayout from '../../../components/UserPanelLayout';
import {
  getStoredToken,
  fetchAuthMe,
  updateProfile,
  getAppBaseUrl,
} from '../../../lib/api';
import type { AuthMeResponse } from '../../../lib/api';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [name, setName] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copyDone, setCopyDone] = useState(false);

  const loadUser = useCallback(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace('/user');
      return;
    }
    fetchAuthMe(token)
      .then((me) => {
        setUser(me);
        setName(me.name);
      })
      .catch(() => router.replace('/user'))
      .finally(() => setCheckingAuth(false));
  }, [router]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const token = getStoredToken();
    if (!token || !name.trim()) return;
    try {
      setIsLoading(true);
      const updated = await updateProfile(token, { name: name.trim() });
      setUser(updated);
      setSuccess('Profile updated.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.');
    } finally {
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <UserPanelLayout>
        <div className="hero-card w-full max-w-md px-8 py-12 text-center">
          <p className="text-[#6b7280] font-sans">Loading…</p>
        </div>
      </UserPanelLayout>
    );
  }

  if (!user) return null;

  const donationLink = `${getAppBaseUrl()}/donate/${user.id}`;

  const handleCopyDonationLink = async () => {
    try {
      await navigator.clipboard.writeText(donationLink);
      setCopyDone(true);
      setTimeout(() => setCopyDone(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  };

  return (
    <UserPanelLayout>
      <div className="hero-card w-full max-w-lg px-8 py-10 sm:px-10 sm:py-12">
        <div className="accent-line-xl mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Profile
        </h1>

        <div className="mb-8 p-5 rounded-xl bg-[#faf9f7] border border-[#e5e7eb]">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wider text-[#6b7280] mb-3">
            My Donation Link
          </h2>
          <p className="text-[#4b5563] text-sm mb-3">
            Share this link so others can send you USDT donations.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="flex-1 min-w-0 text-sm text-[#1a1a1a] bg-white px-3 py-2 rounded-lg border border-[#e5e7eb] truncate">
              {donationLink}
            </code>
            <Button
              type="button"
              variant="outline"
              onClick={handleCopyDonationLink}
              className="btn-modal-outline-xl shrink-0"
            >
              {copyDone ? 'Copied!' : 'Copy'}
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 rounded-xl bg-[#faf9f7] border border-[#e5e7eb]">
          <p className="text-[#6b7280] text-sm mb-0.5">USDT balance</p>
          <p className="font-display text-xl font-semibold text-[#1a1a1a]">
            {parseFloat(user.cryptoBalance || '0').toFixed(2)} USDT
          </p>
        </div>
        <p className="text-[#6b7280] text-base mb-8">
          Edit your name or change your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5 max-w-sm">
          <div>
            <label htmlFor="profile-email" className="block text-sm font-medium text-[#4b5563] mb-1">
              Email
            </label>
            <input
              id="profile-email"
              type="email"
              value={user.email}
              readOnly
              className="input-rich-xl w-full text-[#6b7280] bg-[#f9fafb] cursor-not-allowed"
            />
          </div>
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-[#4b5563] mb-1">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-[#c17f59] font-medium" role="alert">
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-[#059669] font-medium" role="status">
              {success}
            </p>
          )}
          <Button
            type="submit"
            loading={isLoading}
            className="btn-modal-primary-xl"
          >
            {isLoading ? 'Saving…' : 'Save name'}
          </Button>
        </form>

        <div className="mt-10 pt-8 border-t border-[#e5e7eb]">
          <p className="text-sm text-[#6b7280] mb-2">Change your password</p>
          <Link
            href="/user/forgot-password"
            className="text-[#c17f59] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded"
          >
            Use forgot-password flow →
          </Link>
        </div>
      </div>
    </UserPanelLayout>
  );
}
