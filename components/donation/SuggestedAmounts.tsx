'use client';

import React from 'react';
import clsx from 'clsx';

const PRESETS = [1, 5, 10, 50] as const;

export default function SuggestedAmounts({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (amount: number) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {PRESETS.map((amount) => (
        <button
          key={amount}
          type="button"
          onClick={() => onSelect(amount)}
          className={clsx(
            'amount-btn-xl text-center w-full font-display font-semibold',
            selected === amount && 'amount-btn-selected'
          )}
        >
          ${amount}
        </button>
      ))}
    </div>
  );
}
