'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import clsx from 'clsx';

type ToastType = 'success' | 'error';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [nextId, setNextId] = useState(0);

  const add = useCallback((type: ToastType, message: string) => {
    const id = nextId;
    setNextId((n) => n + 1);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, [nextId]);

  const showSuccess = useCallback((message: string) => add('success', message), [add]);
  const showError = useCallback((message: string) => add('error', message), [add]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      <div
        className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2 max-w-[min(24rem,calc(100vw-3rem))]"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={clsx(
              'rounded-xl px-4 py-3 text-sm font-medium shadow-lg border animate-slide-up',
              t.type === 'success' &&
                'bg-[#059669] text-white border-[#047857]',
              t.type === 'error' &&
                'bg-[#dc2626] text-white border-[#b91c1c]'
            )}
            role="alert"
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
