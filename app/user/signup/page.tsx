'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import {
  requestSignUpOtp,
  verifySignUp,
  setStoredToken,
  fetchAuthMe,
} from '../../../lib/api';

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'verify'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }
    try {
      setIsLoading(true);
      const { message } = await requestSignUpOtp(email.trim());
      setSuccessMessage(message);
      setStep('verify');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim() || !name.trim() || !password) {
      setError('Please fill in code, name, and password.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    try {
      setIsLoading(true);
      const { accessToken } = await verifySignUp(
        email.trim(),
        code.trim(),
        name.trim(),
        password,
      );
      setStoredToken(accessToken);
      await fetchAuthMe(accessToken);
      router.push('/user');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24">
      <div className="hero-card w-full max-w-[28rem] px-8 py-12 sm:px-10 sm:py-14">
        <div className="accent-line-xl mx-auto mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Sign up
        </h1>

        {step === 'email' && (
          <>
            <p className="text-[#6b7280] text-base mb-8">
              Enter your email and we&apos;ll send you a verification code.
            </p>
            <form onSubmit={handleRequestOtp} className="space-y-5 max-w-[22rem] mx-auto w-full">
              <div>
                <label htmlFor="signup-email" className="sr-only">
                  Email
                </label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
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
                {isLoading ? 'Sending code…' : 'Send verification code'}
              </Button>
            </form>
          </>
        )}

        {step === 'verify' && (
          <>
            {successMessage && (
              <p className="text-[#4b5563] text-sm mb-4" role="status">
                {successMessage}
              </p>
            )}
            <p className="text-[#6b7280] text-base mb-8">
              Enter the code we sent to <span className="font-medium text-[#1a1a1a]">{email}</span>, your name, and choose a password.
            </p>
            <form onSubmit={handleVerifyAndSignUp} className="space-y-5 max-w-[22rem] mx-auto w-full">
              <div>
                <label htmlFor="signup-code" className="sr-only">
                  Verification code
                </label>
                <input
                  id="signup-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Verification code"
                  className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="signup-name" className="sr-only">
                  Name
                </label>
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name"
                  className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="signup-password" className="sr-only">
                  Password
                </label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password (min 8 characters)"
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
                {isLoading ? 'Creating account…' : 'Create account'}
              </Button>
              <button
                type="button"
                onClick={() => setStep('email')}
                className="text-sm text-[#6b7280] hover:text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded"
              >
                Use a different email
              </button>
            </form>
          </>
        )}

        <div className="mt-8 pt-6 border-t border-[#e5e7eb] text-center text-sm">
          <Link
            href="/user"
            className="text-[#6b7280] font-medium hover:text-[#1a1a1a] hover:underline focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 focus:ring-offset-2 rounded"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
