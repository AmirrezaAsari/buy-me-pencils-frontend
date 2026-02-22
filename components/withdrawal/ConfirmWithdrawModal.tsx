'use client';

import React from 'react';
import Button from '../Button';

export interface ConfirmWithdrawModalProps {
  open: boolean;
  amount: number;
  walletAddress: string;
  estimatedFee: number;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmWithdrawModal({
  open,
  amount,
  walletAddress,
  estimatedFee,
  onConfirm,
  onCancel,
  isLoading,
}: ConfirmWithdrawModalProps) {
  if (!open) return null;

  const youReceive = Math.max(0, amount - estimatedFee);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop-rich"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-withdraw-title"
    >
      <div
        className="hero-card w-full max-w-md p-6 sm:p-8 animate-slide-up shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="confirm-withdraw-title"
          className="font-display text-xl font-semibold text-[#1a1a1a] mb-4"
        >
          Confirm withdrawal
        </h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Amount</span>
            <span className="font-medium text-[#1a1a1a]">{amount.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#6b7280]">Estimated fee</span>
            <span className="font-medium text-[#1a1a1a]">{estimatedFee.toFixed(2)} USDT</span>
          </div>
          <div className="flex justify-between pt-2 border-t border-[#e5e7eb]">
            <span className="text-[#6b7280]">You receive</span>
            <span className="font-semibold text-[#1a1a1a]">{youReceive.toFixed(2)} USDT</span>
          </div>
          <div className="pt-2">
            <span className="text-[#6b7280] block mb-1">Wallet (TRON)</span>
            <p className="font-mono text-[#1a1a1a] break-all bg-[#f9fafb] rounded-lg px-3 py-2">
              {walletAddress}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
            className="btn-modal-outline-xl flex-1 min-w-[120px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            loading={isLoading}
            disabled={isLoading}
            className="btn-modal-primary-xl flex-1 min-w-[120px]"
          >
            {isLoading ? 'Withdrawing…' : 'Confirm'}
          </Button>
        </div>
      </div>
    </div>
  );
}
