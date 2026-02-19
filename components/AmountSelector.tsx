'use client';

import React, { useState } from 'react';
import clsx from 'clsx';

const PRESET_AMOUNTS_IRT = [30000, 50000, 100000, 200000];

function formatIrt(n: number) {
  return n.toLocaleString('en-US') + ' IRT';
}

export default function AmountSelector({
  selected,
  onSelect,
}: {
  selected: number | null;
  onSelect: (amount: number) => void;
}) {
  const [customAmount, setCustomAmount] = useState('');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRESET_AMOUNTS_IRT.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => {
              setCustomAmount(String(amount));
              onSelect(amount);
            }}
            className={clsx(
              'amount-btn-xl text-left sm:text-center',
              selected === amount && 'amount-btn-selected'
            )}
          >
            {formatIrt(amount)}
          </button>
        ))}
      </div>

      <div>
        <input
          type="number"
          placeholder="Custom amount (IRT)"
          value={customAmount}
          onChange={(e) => {
            const val = e.target.value;
            setCustomAmount(val);
            onSelect(Number(val) || 0);
          }}
          className="input-rich-xl w-full text-[#1a1a1a] placeholder:text-[#9ca3af] focus:outline-none"
          min="1"
        />
      </div>
    </div>
  );
}
