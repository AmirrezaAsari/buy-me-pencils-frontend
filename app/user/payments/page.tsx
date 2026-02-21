'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Button from '../../../components/Button';
import UserPanelLayout from '../../../components/UserPanelLayout';
import {
  getStoredToken,
  fetchAuthMe,
  getCardInfo,
  createCardInfo,
  updateCardInfo,
} from '../../../lib/api';
import type { CardInfoResponse } from '../../../lib/api';

type TabId = 'payments' | 'payment-info';

export default function PaymentsPage() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>('payment-info');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const [cardList, setCardList] = useState<CardInfoResponse[]>([]);
  const [cardNumber, setCardNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadAuth = useCallback(() => {
    const t = getStoredToken();
    setToken(t);
    if (!t) {
      router.replace('/user');
      return;
    }
    fetchAuthMe(t).catch(() => router.replace('/user')).finally(() => setCheckingAuth(false));
  }, [router]);

  useEffect(() => {
    loadAuth();
  }, [loadAuth]);

  const loadCardInfo = useCallback(() => {
    if (!token) return;
    getCardInfo(token)
      .then((list) => {
        setCardList(list);
        const first = list[0];
        if (first) {
          setEditingId(first.id);
          setCardNumber(first.cardNumber);
          setHolderName(first.holderName);
        } else {
          setEditingId(null);
          setCardNumber('');
          setHolderName('');
        }
      })
      .catch(() => setCardList([]));
  }, [token]);

  useEffect(() => {
    if (token && !checkingAuth) loadCardInfo();
  }, [token, checkingAuth, loadCardInfo]);

  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!token) return;
    if (!cardNumber.trim() || !holderName.trim()) {
      setError('Please fill in card number and holder name.');
      return;
    }
    try {
      setIsLoading(true);
      if (editingId) {
        await updateCardInfo(token, editingId, {
          cardNumber: cardNumber.trim(),
          holderName: holderName.trim(),
        });
        setSuccess('Card info updated.');
      } else {
        await createCardInfo(token, {
          cardNumber: cardNumber.trim(),
          holderName: holderName.trim(),
        });
        setSuccess('Card info saved.');
      }
      loadCardInfo();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNew = () => {
    setEditingId(null);
    setCardNumber('');
    setHolderName('');
    setSuccess('');
    setError('');
  };

  if (checkingAuth) {
    return (
      <UserPanelLayout>
        <div className="hero-card w-full max-w-md px-8 py-12 text-center">
          <p className="text-[#6b7280] font-sans">Loading…</p>
        </div>
      </UserPanelLayout>
    );
  }

  if (!token) return null;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'payments', label: 'Payments' },
    { id: 'payment-info', label: 'Payment info' },
  ];

  return (
    <UserPanelLayout>
      <div className="hero-card w-full overflow-hidden">
        <div className="border-b border-[#e5e7eb] px-6 sm:px-8">
          <div className="flex gap-1" role="tablist">
            {tabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={tab === id}
                onClick={() => setTab(id)}
                className={`px-5 py-4 text-sm font-medium border-b-2 -mb-px transition-colors ${
                  tab === id
                    ? 'border-[#c17f59] text-[#c17f59]'
                    : 'border-transparent text-[#6b7280] hover:text-[#1a1a1a]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8">
          {tab === 'payments' && (
            <div className="py-8 text-center text-[#6b7280]">
              <p>Payments history and actions will appear here. (Coming later.)</p>
            </div>
          )}

          {tab === 'payment-info' && (
            <div className="max-w-md">
              <p className="text-[#6b7280] text-sm mb-6">
                Add or update your card details for payments.
              </p>
              <form onSubmit={handleSubmitCard} className="space-y-5">
                <div>
                  <label htmlFor="card-number" className="block text-sm font-medium text-[#4b5563] mb-1">
                    Card number
                  </label>
                  <input
                    id="card-number"
                    type="text"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 24))}
                    placeholder="Card number"
                    className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="holder-name" className="block text-sm font-medium text-[#4b5563] mb-1">
                    Holder name
                  </label>
                  <input
                    id="holder-name"
                    type="text"
                    autoComplete="cc-name"
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="Name on card"
                    className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
                  />
                </div>
                {error && (
                  <p className="text-sm text-[#c17f59] font-medium" role="alert">
                    {error}
                  </p>
                )}
                {success && (
                  <p className="text-sm text-[#059669] font-medium" role="status">
                    {success}
                  </p>
                )}
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="submit"
                    loading={isLoading}
                    className="btn-modal-primary-xl"
                  >
                    {isLoading ? 'Saving…' : editingId ? 'Update card' : 'Save card'}
                  </Button>
                  {cardList.length > 0 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddNew}
                      className="btn-modal-outline-xl"
                    >
                      Add new card
                    </Button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </UserPanelLayout>
  );
}
