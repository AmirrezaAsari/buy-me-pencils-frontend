'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import {
  requestForgotPasswordOtp,
  resetPassword,
} from '../../../lib/api';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
      const { message } = await requestForgotPasswordOtp(email.trim());
      setSuccessMessage(message);
      setStep('reset');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!code.trim() || !newPassword || !confirmPassword) {
      setError('Please fill in the code and both password fields.');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setIsLoading(true);
      await resetPassword(email.trim(), code.trim(), newPassword);
      router.push('/user?reset=success');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reset failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24">
      <div className="hero-card w-full max-w-[28rem] px-8 py-12 sm:px-10 sm:py-14">
        <div className="accent-line-xl mx-auto mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Forgot password
        </h1>

        {step === 'email' && (
          <>
            <p className="text-[#6b7280] text-base mb-8">
              Enter your email and we&apos;ll send you a verification code to reset your password.
            </p>
            <form onSubmit={handleRequestOtp} className="space-y-5 max-w-[22rem] mx-auto w-full">
              <div>
                <label htmlFor="forgot-email" className="sr-only">
                  Email
                </label>
                <input
                  id="forgot-email"
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

        {step === 'reset' && (
          <>
            {successMessage && (
              <p className="text-[#4b5563] text-sm mb-4" role="status">
                {successMessage}
              </p>
            )}
            <p className="text-[#6b7280] text-base mb-8">
              Enter the code we sent to <span className="font-medium text-[#1a1a1a]">{email}</span> and your new password.
            </p>
            <form onSubmit={handleResetPassword} className="space-y-5 max-w-[22rem] mx-auto w-full">
              <div>
                <label htmlFor="forgot-code" className="sr-only">
                  Verification code
                </label>
                <input
                  id="forgot-code"
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
                <label htmlFor="forgot-new-password" className="sr-only">
                  New password
                </label>
                <input
                  id="forgot-new-password"
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password (min 8 characters)"
                  className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="forgot-confirm-password" className="sr-only">
                  Confirm new password
                </label>
                <input
                  id="forgot-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
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
                {isLoading ? 'Resetting…' : 'Reset password'}
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
