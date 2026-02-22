'use client';

import React from 'react';
import clsx from 'clsx';
import type { WithdrawalStatus } from '../../lib/api';

const statusStyles: Record<
  WithdrawalStatus,
  string
> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
  rejected: 'bg-gray-100 text-gray-700 border-gray-200',
};

interface StatusBadgeProps {
  status: WithdrawalStatus;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize',
        statusStyles[status],
        className
      )}
    >
      {status}
    </span>
  );
}
