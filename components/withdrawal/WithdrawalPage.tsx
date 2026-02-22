'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '../../lib/api';
import { useAuthMe } from '../../hooks/use-auth-me';
import { useWithdrawals, useCreateWithdrawal } from '../../hooks/use-withdrawals';
import BalanceCard from './BalanceCard';
import WithdrawForm from './WithdrawForm';
import WithdrawalTable from './WithdrawalTable';
import UserPanelLayout from '../UserPanelLayout';

export default function WithdrawalPage() {
  const router = useRouter();
  const { token, balanceNum, isLoading: authLoading } = useAuthMe();
  const {
    data: withdrawals = [],
    isLoading: withdrawalsLoading,
    isError: withdrawalsError,
    error: withdrawalsErr,
  } = useWithdrawals(token);
  const createMutation = useCreateWithdrawal(token);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getStoredToken()) router.replace('/user');
  }, [router]);

  if (typeof window !== 'undefined' && !token && !authLoading) {
    return null;
  }

  return (
    <UserPanelLayout>
      <div className="space-y-8">
        <div>
          <div className="accent-line-xl mb-4" />
          <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
            Withdraw
          </h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Withdraw your USDT balance to your TRON (TRC20) wallet.
          </p>
        </div>

        <BalanceCard balance={balanceNum} isLoading={authLoading} />

        <section>
          <h2 className="font-display text-lg font-semibold text-[#1a1a1a] mb-4">
            New withdrawal
          </h2>
          <WithdrawForm
            balance={balanceNum}
            onSubmit={(payload) => createMutation.mutateAsync(payload)}
            isSubmitting={createMutation.isPending}
          />
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-[#1a1a1a] mb-4">
            Withdrawal history
          </h2>
          <WithdrawalTable
            withdrawals={withdrawals}
            isLoading={withdrawalsLoading}
            isError={withdrawalsError}
            error={withdrawalsErr}
          />
        </section>
      </div>
    </UserPanelLayout>
  );
}
