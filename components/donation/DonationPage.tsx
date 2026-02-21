'use client';

import React, { useState } from 'react';
import Button from '../Button';
import SuggestedAmounts from './SuggestedAmounts';
import DonationModal from '../DonationModal';

interface DonationPageProps {
  creatorId: string;
  creatorName: string;
}

export default function DonationPage({ creatorId, creatorName }: DonationPageProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleDonateClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <div className="hero-card w-full max-w-lg mx-auto px-8 py-10 sm:px-10 sm:py-12 text-center">
        <div className="accent-line-xl mx-auto mb-6" />
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a] tracking-tight mb-2">
          Support {creatorName}
        </h1>
        <p className="text-[#6b7280] text-base mb-8">
          Send a donation to support this creator.
        </p>

        <div className="max-w-sm mx-auto mb-6">
          <p className="text-sm font-medium text-[#4b5563] mb-3 text-left">
            Suggested amount (USD)
          </p>
          <SuggestedAmounts selected={selectedAmount} onSelect={setSelectedAmount} />
        </div>

        <Button
          onClick={handleDonateClick}
          className="btn-cta-xl w-full max-w-sm"
        >
          Donate
        </Button>
      </div>

      <DonationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultAmountUSD={selectedAmount ?? undefined}
        creatorId={creatorId}
      />
    </>
  );
}
