'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '../../../lib/api';
import { useAuthMe } from '../../../hooks/use-auth-me';
import {
  useAdminWithdrawals,
  useApproveWithdrawal,
  useRejectWithdrawal,
} from '../../../hooks/use-admin-withdrawals';
import AdminWithdrawalTable from '../../../components/admin/AdminWithdrawalTable';
import { useToast } from '../../../components/Toast';

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const toast = useToast();
  const { token, user, isLoading: authLoading } = useAuthMe();
  const {
    data: withdrawals = [],
    isLoading: listLoading,
    isError: listError,
    error: listErr,
  } = useAdminWithdrawals(token);
  const approveMutation = useApproveWithdrawal(token);
  const rejectMutation = useRejectWithdrawal(token);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!getStoredToken()) router.replace('/user');
  }, [router]);

  useEffect(() => {
    if (typeof window === 'undefined' || authLoading) return;
    if (token && user?.type !== 'admin') {
      router.replace('/user');
    }
  }, [token, user?.type, authLoading, router]);

  const handleApprove = async (id: string) => {
    setApprovingId(id);
    try {
      await approveMutation.mutateAsync(id);
      toast.showSuccess('Withdrawal approved and queued for processing.');
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Approve failed.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setRejectingId(id);
    try {
      await rejectMutation.mutateAsync(id);
      toast.showSuccess('Withdrawal rejected; balance returned to user.');
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Reject failed.');
    } finally {
      setRejectingId(null);
    }
  };

  if (typeof window !== 'undefined' && !token && !authLoading) {
    return null;
  }

  if (user && user.type !== 'admin' && !authLoading) {
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="space-y-8">
        <div>
          <div className="accent-line-xl mb-4" />
          <h1 className="font-display text-2xl font-semibold text-[#1a1a1a]">
            Admin — Withdrawals
          </h1>
          <p className="text-[#6b7280] text-sm mt-1">
            Review and approve or reject pending withdrawal requests.
          </p>
        </div>

        <section>
          <h2 className="font-display text-lg font-semibold text-[#1a1a1a] mb-4">
            All withdrawals
          </h2>
          <AdminWithdrawalTable
            withdrawals={withdrawals}
            isLoading={listLoading}
            isError={listError}
            error={listErr}
            onApprove={handleApprove}
            onReject={handleReject}
            approvingId={approvingId}
            rejectingId={rejectingId}
          />
        </section>
      </div>
    </div>
  );
}
