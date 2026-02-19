'use client';

import React, { useState } from 'react';
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

  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop-rich fixed inset-0 z-50 flex items-center justify-center animate-fade-in"
      style={{ padding: '2rem 4rem', boxSizing: 'border-box' }}
      onClick={handleClose}
      role="dialog"
      aria-modal
      aria-labelledby="donation-modal-title"
    >
      <div
        className="modal-panel-xl relative w-full overflow-hidden"
        style={{ maxWidth: '72rem', marginLeft: '1.5rem', marginRight: '1.5rem' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 p-10 sm:p-14">
          <div className="accent-line-xl w-16 mb-6" />

          <h2
            id="donation-modal-title"
            className="font-display text-3xl sm:text-4xl font-semibold text-[#2c2c2c] mb-2 tracking-tight"
          >
            Choose amount
          </h2>
          <p className="text-[#6a6a6a] text-lg mb-6">
            Pick a preset or enter a custom amount in IRT.
          </p>

          <AmountSelector selected={amount} onSelect={setAmount} />

          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="userName" className="block text-base font-semibold text-[#2c2c2c] mb-2">
              </label>
              <input
                id="userName"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Your name"
                className="input-rich-xl w-full text-[#2c2c2c] placeholder:text-[#8a8a8a] focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-base font-semibold text-[#2c2c2c] mb-2">
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add a message..."
                rows={3}
                className="input-rich-xl w-full text-[#2c2c2c] placeholder:text-[#8a8a8a] resize-none focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="mt-6 text-lg text-[#c17f59] font-semibold" role="alert">
              {error}
            </p>
          )}

          <div className="mt-8 flex flex-col-reverse sm:flex-row gap-4 justify-end">
            <Button variant="outline" onClick={handleClose} className="btn-modal-outline-xl">
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              loading={isLoading}
              className="btn-modal-primary-xl"
            >
              {isLoading ? 'Processing...' : 'Pay now'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
