'use client';

import React, { useState, useMemo } from 'react';
import Button from '../Button';
import { useToast } from '../Toast';
import { isValidTronAddress } from '../../lib/validation';
import ConfirmWithdrawModal from './ConfirmWithdrawModal';

const ESTIMATED_FEE = 1; // static value

export interface WithdrawFormProps {
  balance: number;
  onSubmit: (payload: { amount: number; walletAddress: string }) => Promise<unknown>;
  isSubmitting: boolean;
}

export default function WithdrawForm({
  balance,
  onSubmit,
  isSubmitting,
}: WithdrawFormProps) {
  const toast = useToast();
  const [amountStr, setAmountStr] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);

  const amount = useMemo(() => parseFloat(amountStr) || 0, [amountStr]);

  const errors = useMemo(() => {
    const list: string[] = [];
    if (amount <= 0) list.push('Amount must be greater than 0.');
    else if (amount > balance) list.push('Amount cannot exceed your balance.');
    const trimmed = (walletAddress ?? '').trim();
    if (!trimmed) list.push('Wallet address is required.');
    else if (!isValidTronAddress(trimmed)) list.push('Enter a valid TRON address (starts with T, 34 characters).');
    return list;
  }, [amount, balance, walletAddress]);

  const isValid = errors.length === 0;
  const isDisabled = isSubmitting || !isValid || balance <= 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    const trimmed = walletAddress.trim();
    try {
      await onSubmit({ amount, walletAddress: trimmed });
      toast.showSuccess('Withdrawal requested successfully.');
      setConfirmOpen(false);
      setAmountStr('');
      setWalletAddress('');
    } catch (err) {
      toast.showError(err instanceof Error ? err.message : 'Withdrawal failed.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="withdraw-amount" className="block text-sm font-medium text-[#4b5563] mb-1">
            Amount (USDT)
          </label>
          <input
            id="withdraw-amount"
            type="number"
            min="0"
            step="0.01"
            inputMode="decimal"
            value={amountStr}
            onChange={(e) => setAmountStr(e.target.value)}
            placeholder="0.00"
            disabled={balance <= 0}
            className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
          />
          <p className="text-xs text-[#6b7280] mt-1">
            Available: {balance.toFixed(2)} USDT · Estimated fee: {ESTIMATED_FEE} USDT
          </p>
        </div>
        <div>
          <label htmlFor="withdraw-wallet" className="block text-sm font-medium text-[#4b5563] mb-1">
            TRON wallet address
          </label>
          <input
            id="withdraw-wallet"
            type="text"
            autoComplete="off"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="T..."
            disabled={balance <= 0}
            className="input-rich-xl w-full font-mono text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none disabled:bg-[#f3f4f6] disabled:cursor-not-allowed"
          />
        </div>
        {errors.length > 0 && (
          <ul className="text-sm text-[#dc2626] font-medium" role="alert">
            {errors.map((msg, i) => (
              <li key={i}>{msg}</li>
            ))}
          </ul>
        )}
        <Button
          type="submit"
          disabled={isDisabled}
          loading={isSubmitting}
          className="btn-modal-primary-xl"
        >
          {balance <= 0 ? 'No balance to withdraw' : isSubmitting ? 'Withdrawing…' : 'Withdraw'}
        </Button>
      </form>

      <ConfirmWithdrawModal
        open={confirmOpen}
        amount={amount}
        walletAddress={walletAddress.trim()}
        estimatedFee={ESTIMATED_FEE}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmOpen(false)}
        isLoading={isSubmitting}
      />
    </>
  );
}
