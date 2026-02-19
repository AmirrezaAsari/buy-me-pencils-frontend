'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { createPay } from '../lib/api';
import AmountSelector from './AmountSelector';
import Button from './Button';

export default function DonationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePayment = async () => {
    if (!amount || amount <= 0) {
      setError('Please select a valid amount');
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
    onClose();
  };

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

          <h2
            id="donation-modal-title"
            className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight"
          >
            Choose amount
          </h2>
          <p className="text-[#6b7280] text-base">
            Pick a preset or enter a custom amount (IRT).
          </p>

          <div className="max-w-[22rem] w-full">
            <AmountSelector selected={amount} onSelect={setAmount} />
          </div>

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
              {isLoading ? 'Processing…' : 'Pay now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  if (typeof document === 'undefined') return null;
  return createPortal(modalContent, document.body);
}
