'use client';

import React, { useCallback, useState } from 'react';
import type { WithdrawalResponse } from '../../lib/api';
import StatusBadge from './StatusBadge';

const TRONSCAN_TX_URL = 'https://tronscan.org/#/transaction/';

export interface WithdrawalTableProps {
  withdrawals: WithdrawalResponse[];
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 text-sm text-[#c17f59] hover:underline focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 rounded"
      title={copied ? 'Copied!' : `Copy ${label}`}
    >
      {copied ? (
        'Copied!'
      ) : (
        <>
          <span className="sr-only">Copy </span>
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export default function WithdrawalTable({
  withdrawals,
  isLoading,
  isError,
  error,
}: WithdrawalTableProps) {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Amount</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Wallet</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">TxHash</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3].map((i) => (
              <tr key={i} className="border-b border-[#f3f4f6]">
                <td className="py-4 px-4"><div className="h-5 w-28 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-16 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-40 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-6 w-20 rounded bg-[#e5e7eb] animate-pulse" /></td>
                <td className="py-4 px-4"><div className="h-5 w-24 rounded bg-[#e5e7eb] animate-pulse" /></td>
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
        <p className="text-[#6b7280] font-medium">No withdrawals yet</p>
        <p className="text-sm text-[#9ca3af] mt-1">Your withdrawal history will appear here.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto -mx-2">
      <table className="w-full border-collapse min-w-[600px]">
        <thead>
          <tr className="border-b border-[#e5e7eb]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Date</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Amount</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Wallet</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">Status</th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[#6b7280]">TxHash</th>
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
                {w.txHash ? (
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`${TRONSCAN_TX_URL}${w.txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#c17f59] hover:underline font-medium"
                    >
                      View on TronScan
                    </a>
                    <CopyButton text={w.txHash} label="transaction hash" />
                  </div>
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
