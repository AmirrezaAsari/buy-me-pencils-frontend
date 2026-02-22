'use client';

import React from 'react';
import type { AdminWithdrawalResponse } from '../../lib/api';
import StatusBadge from '../withdrawal/StatusBadge';

const TRONSCAN_TX_URL = 'https://tronscan.org/#/transaction/';

export interface AdminWithdrawalTableProps {
  withdrawals: AdminWithdrawalResponse[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  approvingId: string | null;
  rejectingId: string | null;
}

export default function AdminWithdrawalTable({
  withdrawals,
  isLoading,
  isError,
  error,
  onApprove,
  onReject,
  approvingId,
  rejectingId,
}: AdminWithdrawalTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">User</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Wallet</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-[#f3f4f6]">
                <td className="py-4 px-4"><div className="h-5 w-28 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-32 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-16 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-40 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-6 w-20 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-8 w-24 rounded bg-[#e5e7eb] animate-pulse" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError && error) {
    return (
      <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-6 text-center">
        <p className="text-[#b91c1c] font-medium">Failed to load withdrawals</p>
        <p className="text-sm text-[#6b7280] mt-1">{error.message}</p>
      </div>
    );
  }

  if (!withdrawals.length) {
    return (
      <div className="rounded-xl border border-dashed border-[#e5e7eb] bg-[#faf9f7] p-12 text-center">
        <p className="text-[#6b7280] font-medium">No withdrawals</p>
        <p className="text-sm text-[#9ca3af] mt-1">Pending withdrawal requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full border-collapse min-w-[700px]">
        <thead>
          <tr className="border-b border-[#e5e7eb]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">User</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Wallet</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {withdrawals.map((w) => (
            <tr key={w.id} className="border-b border-[#f3f4f6] hover:bg-[#faf9f7] transition-colors">
              <td className="py-4 px-4 text-sm text-[#1a1a1a]">
                {new Date(w.createdAt).toLocaleString(undefined, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </td>
              <td className="py-4 px-4 text-sm text-[#1a1a1a]">
                {w.user ? (
                  <span title={w.user.email}>
                    {w.user.name}
                    <span className="block text-xs text-[#6b7280] truncate max-w-[160px]">{w.user.email}</span>
                  </span>
                ) : (
                  <span className="text-[#9ca3af]">—</span>
                )}
              </td>
              <td className="py-4 px-4 text-sm font-medium text-[#1a1a1a]">
                {w.amount.toFixed(2)} USDT
              </td>
              <td className="py-4 px-4 text-sm font-mono text-[#4b5563] truncate max-w-[140px]" title={w.walletAddress}>
                {w.walletAddress}
              </td>
              <td className="py-4 px-4">
                <StatusBadge status={w.status} />
              </td>
              <td className="py-4 px-4">
                {w.status === 'pending' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onApprove(w.id)}
                      disabled={!!approvingId || !!rejectingId}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      {approvingId === w.id ? 'Approving…' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onReject(w.id)}
                      disabled={!!approvingId || !!rejectingId}
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-[#6b7280] text-white hover:bg-[#4b5563] disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-[#6b7280] focus:ring-offset-2"
                    >
                      {rejectingId === w.id ? 'Rejecting…' : 'Reject'}
                    </button>
                  </div>
                ) : w.txHash ? (
                  <a
                    href={`${TRONSCAN_TX_URL}${w.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#c17f59] hover:underline font-medium"
                  >
                    View on TronScan
                  </a>
                ) : (
                  <span className="text-sm text-[#9ca3af]">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
