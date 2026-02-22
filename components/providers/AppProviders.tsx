'use client';

import { ReactNode } from 'react';
import QueryProvider from './QueryProvider';
import { ToastProvider } from '../Toast';

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <ToastProvider>{children}</ToastProvider>
    </QueryProvider>
  );
}
