'use client';

import React, { Suspense, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Button from '../../components/Button';
import UserPanelLayout from '../../components/UserPanelLayout';
import {
  getStoredToken,
  setStoredToken,
  clearStoredToken,
  signIn,
  fetchAuthMe,
} from '../../lib/api';
import type { AuthMeResponse } from '../../lib/api';

function UserPageContent() {
  const searchParams = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthMeResponse | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [resetSuccess, setResetSuccess] = useState(false);

  const loadAuth = useCallback(() => {
    const stored = getStoredToken();
    setToken(stored);
    if (!stored) {
      setCheckingAuth(false);
      return;
    }
    fetchAuthMe(stored)
      .then((me) => {
        setUser(me);
      })
      .catch(() => {
        clearStoredToken();
        setToken(null);
        setUser(null);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  useEffect(() => {
    if (searchParams.get('reset') === 'success') {
      setResetSuccess(true);
      window.history.replaceState({}, '', '/user');
    }
  }, [searchParams]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter email and password.');
      return;
    }
    try {
      setIsLoading(true);
      const { accessToken } = await signIn(email.trim(), password);
      setStoredToken(accessToken);
      setToken(accessToken);
      const me = await fetchAuthMe(accessToken);
      setUser(me);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = () => {
    clearStoredToken();
    setToken(null);
    setUser(null);
  };

  if (checkingAuth) {
    return (
      <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
        <div className="hero-card w-full max-w-md px-8 py-12 text-center">
          <p className="text-[#6b7280] font-sans">Loading…</p>
        </div>
      </section>
    );
  }

  if (token && user) {
    return (
      <UserPanelLayout>
        <section className="flex-1">
          <div className="hero-card w-full max-w-xl px-8 py-12 sm:px-12 sm:py-16">
            <div className="accent-line-xl mb-6" />
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-2">
              Welcome back
            </h1>
            <p className="text-[#4b5563] text-lg mb-8">
              Signed in as <span className="font-medium text-[#1a1a1a]">{user.email}</span>
            </p>
            <p className="text-[#6b7280] text-base mb-10">
              Use the menu on the left to manage your profile and payment info.
            </p>
            <Button
              variant="outline"
              size="lg"
              onClick={handleSignOut}
              className="btn-modal-outline-xl"
            >
              Sign out
            </Button>
          </div>
        </section>
    );
  }

  return (
    <section className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24">
      <div className="hero-card w-full max-w-[28rem] px-8 py-12 sm:px-10 sm:py-14">
        <div className="accent-line-xl mx-auto mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Sign in
        </h1>
        <p className="text-[#6b7280] text-base mb-8">
          Enter your email and password to access your account.
        </p>

        {resetSuccess && (
          <p className="text-[#4b5563] text-sm mb-4 font-medium" role="status">
            Password reset successfully. You can sign in now.
          </p>
        )}

        <form onSubmit={handleSignIn} className="space-y-5 max-w-[22rem] mx-auto w-full">
          <div>
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-sm text-[#c17f59] font-medium" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            loading={isLoading}
            fullWidth
            className="btn-modal-primary-xl w-full"
          >
            {isLoading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#e5e7eb] flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
          <Link
            href="/user/signup"
            className="text-[#c17f59] font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded"
          >
            Sign up
          </Link>
          <Link
            href="/user/forgot-password"
            className="text-[#6b7280] font-medium hover:text-[#1a1a1a] hover:underline focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded"
          >
            Forgot password
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function UserPage() {
  return (
    <Suspense
      fallback={
        <section className="flex-1 flex flex-col justify-center items-center px-6 py-16">
          <div className="hero-card w-full max-w-md px-8 py-12 text-center">
            <p className="text-[#6b7280] font-sans">Loading…</p>
          </div>
        </section>
      }
    >
      <UserPageContent />
    </Suspense>
  );
}
