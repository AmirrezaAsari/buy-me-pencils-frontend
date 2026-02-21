'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { createPay, createCryptoPayment } from '../lib/api';
import AmountSelector from './AmountSelector';
import SuggestedAmounts from './donation/SuggestedAmounts';
import Button from './Button';

const USDT_DECIMALS = 1e6;

type CryptoSuccess = {
  address: string;
  amountCrypto: string;
  currency: string;
  network: string;
  expiresAt: string;
};

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
  const [cryptoSuccess, setCryptoSuccess] = useState<CryptoSuccess | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setAmount(defaultAmountUSD ?? null);
      setCryptoSuccess(null);
      setQrDataUrl(null);
    }
  }, [isOpen, defaultAmountUSD]);

  useEffect(() => {
    if (!cryptoSuccess?.address) {
      setQrDataUrl(null);
      return;
    }
    let cancelled = false;
    import('qrcode').then((QRCode) => {
      QRCode.toDataURL(cryptoSuccess!.address, { width: 220, margin: 2 }).then(
        (url) => {
          if (!cancelled) setQrDataUrl(url);
        }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [cryptoSuccess?.address]);

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
          network: res.network,
          expiresAt: res.expiresAt,
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
                Send payment
              </h2>
              <p className="text-[#6b7280] text-base">
                Scan the QR code or copy the address. Send exactly {amountUsdtDisplay} {cryptoSuccess.currency} on {cryptoSuccess.network}. Payment will be confirmed on-chain.
              </p>

              {qrDataUrl && (
                <div className="flex justify-center">
                  <img
                    src={qrDataUrl}
                    alt="Payment address QR code"
                    width={220}
                    height={220}
                    className="rounded-xl border border-[#e5e7eb] bg-white"
                  />
                </div>
              )}

              <div className="max-w-[22rem] w-full text-left space-y-4 rounded-xl bg-[#faf9f7] border border-[#e5e7eb] p-4">
                <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
                  <span className="text-[#6b7280] font-medium">Network</span>
                  <span className="font-semibold text-[#1a1a1a]">{cryptoSuccess.network}</span>
                  <span className="text-[#6b7280] font-medium">Currency</span>
                  <span className="font-semibold text-[#1a1a1a]">{cryptoSuccess.currency}</span>
                  <span className="text-[#6b7280] font-medium">Amount</span>
                  <span className="font-mono font-semibold text-[#1a1a1a]">
                    {amountUsdtDisplay} {cryptoSuccess.currency}
                  </span>
                  <span className="text-[#6b7280] font-medium">Expires</span>
                  <span className="text-[#1a1a1a]">
                    {new Date(cryptoSuccess.expiresAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                </div>
                <div>
                  <p className="text-[#6b7280] font-medium text-sm mb-1">Deposit address</p>
                  <code className="block break-all text-sm text-[#1a1a1a] bg-white px-3 py-2 rounded-lg border border-[#e5e7eb]">
                    {cryptoSuccess.address}
                  </code>
                </div>
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
