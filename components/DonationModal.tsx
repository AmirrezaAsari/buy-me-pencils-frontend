'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPay, createCryptoPayment } from '../lib/api';
import AmountSelector from './AmountSelector';
import SuggestedAmounts from './donation/SuggestedAmounts';
import Button from './Button';

const USDT_DECIMALS = 1e6;

export default function DonationModal({
  isOpen,
  onClose,
  defaultAmountUSD,
  creatorId,
}: {
  isOpen: boolean;
  onClose: () => void;
  defaultAmountUSD?: number;
  creatorId?: string;
}) {
  const isCrypto = Boolean(creatorId);

  const [amount, setAmount] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [cryptoSuccess, setCryptoSuccess] = useState<{
    address: string;
    amountCrypto: string;
    currency: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmountUSD ?? null);
      setCryptoSuccess(null);
    }
  }, [isOpen, defaultAmountUSD]);

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError('Please select a valid amount');
      return;
    }

    if (isCrypto && creatorId) {
      try {
        setIsLoading(true);
        setError('');
        const res = await createCryptoPayment(creatorId, amount);
        setCryptoSuccess({
          address: res.address,
          amountCrypto: res.amountCrypto,
          currency: res.currency,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      } finally {
        setIsLoading(false);
      }
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      const { checkoutUrl } = await createPay(amount * 10, {
        userName: userName.trim() || undefined,
        message: message.trim() || undefined,
      });
      window.location.href = checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setError('');
    setAmount(null);
    setUserName('');
    setMessage('');
    setCryptoSuccess(null);
    onClose();
  };

  const handleCopyAddress = async () => {
    if (!cryptoSuccess) return;
    try {
      await navigator.clipboard.writeText(cryptoSuccess.address);
    } catch {
      setError('Could not copy address');
    }
  };

  const amountUsdtDisplay =
    cryptoSuccess &&
    (parseFloat(cryptoSuccess.amountCrypto) / USDT_DECIMALS).toFixed(2);

  const modalContent = (
    <div
      className="modal-backdrop-rich z-50 p-4 sm:p-6"
      style={{ width: '100vw', height: '100vh' }}
      onClick={handleClose}
      role="dialog"
      aria-modal
      aria-labelledby="donation-modal-title"
    >
      <div
        className="modal-panel-xl relative w-full max-w-[28rem]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-6">
          <div className="accent-line-xl mx-auto" />

          {cryptoSuccess ? (
            <>
              <h2
                id="donation-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight"
              >
                Send USDT
              </h2>
              <p className="text-[#6b7280] text-base">
                Send {amountUsdtDisplay} {cryptoSuccess.currency} to this TRON (TRC20) address. Payment will be confirmed on-chain.
              </p>
              <div className="max-w-[22rem] w-full text-left space-y-2">
                <p className="text-sm font-medium text-[#4b5563]">Amount</p>
                <p className="font-mono text-lg font-semibold text-[#1a1a1a]">
                  {amountUsdtDisplay} {cryptoSuccess.currency}
                </p>
                <p className="text-sm font-medium text-[#4b5563] mt-3">Address (TRC20)</p>
                <code className="block break-all text-sm text-[#1a1a1a] bg-[#f9fafb] px-3 py-2 rounded-lg border border-[#e5e7eb]">
                  {cryptoSuccess.address}
                </code>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCopyAddress}
                  className="btn-modal-outline-xl w-full mt-2"
                >
                  Copy address
                </Button>
              </div>
              <Button onClick={handleClose} className="btn-modal-primary-xl w-full max-w-[22rem]">
                Done
              </Button>
            </>
          ) : (
            <>
              <h2
                id="donation-modal-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight"
              >
                Choose amount
              </h2>
              <p className="text-[#6b7280] text-base">
                {isCrypto
                  ? 'Pick a preset or enter a custom amount (USD). You will send USDT (TRC20) to the creator.'
                  : 'Pick a preset or enter a custom amount (IRT). (you will be redirected to another website to donate.)'}
              </p>

              <div className="max-w-[22rem] w-full">
                {isCrypto ? (
                  <>
                    <SuggestedAmounts selected={amount} onSelect={setAmount} />
                    <div className="mt-4">
                      <label htmlFor="custom-usd" className="sr-only">
                        Custom amount (USD)
                      </label>
                      <input
                        id="custom-usd"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="Or custom amount (USD)"
                        value={amount != null && ![1, 5, 10, 50].includes(amount) ? amount : ''}
                        onChange={(e) => {
                          const v = e.target.value;
                          setAmount(v === '' ? null : Math.max(0, parseFloat(v) || 0));
                        }}
                        className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                      />
                    </div>
                  </>
                ) : (
                  <AmountSelector selected={amount} onSelect={setAmount} />
                )}
              </div>

              {!isCrypto && (
                <div className="space-y-5 max-w-[22rem] w-full">
                  <div>
                    <label htmlFor="userName" className="sr-only">
                      Your name
                    </label>
                    <input
                      id="userName"
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name (optional)"
                      className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="message" className="sr-only">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Add a message (optional)"
                      rows={3}
                      className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] resize-none focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-sm text-[#c17f59] font-medium max-w-[22rem] mx-auto" role="alert">
                  {error}
                </p>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-center max-w-[22rem] w-full">
                <Button variant="outline" onClick={handleClose} className="btn-modal-outline-xl">
                  Cancel
                </Button>
                <Button
                  onClick={handlePayment}
                  loading={isLoading}
                  className="btn-modal-primary-xl"
                >
                  {isLoading ? 'Processing…' : isCrypto ? 'Get payment details' : 'Pay now'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
