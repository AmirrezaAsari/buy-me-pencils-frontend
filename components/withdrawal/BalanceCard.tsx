'use client';

import React from 'react';

interface BalanceCardProps {
  balance: number;
  isLoading?: boolean;
  currency?: string;
}

export default function BalanceCard({
  balance,
  isLoading,
  currency = 'USDT',
}: BalanceCardProps) {
  if (isLoading) {
    return (
      <div className="hero-card p-6 sm:p-8">
        <div className="h-5 w-24 rounded bg-[#e5e7eb] animate-pulse mb-2" />
        <div className="h-10 w-36 rounded bg-[#e5e7eb] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="hero-card p-6 sm:p-8">
      <p className="text-sm font-medium text-[#6b7280] uppercase tracking-wider mb-1">
        Available balance
      </p>
      <p className="font-display text-3xl font-bold text-[#1a1a1a]">
        {balance.toFixed(2)} <span className="text-xl font-semibold text-[#6b7280]">{currency}</span>
      </p>
    </div>
  );
}
