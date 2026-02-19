'use client';

import { useState } from 'react';
import Button from '../../components/Button';
import DonationModal from '../../components/DonationModal';
import TypingText from '../../components/TypingText';

const DESCRIPTION =
  'Your support fuels my creative journey. Every donation helps me make more art, guides, and resources for the community.';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col justify-center items-center px-6 py-20">
      {/* Soft organic background shapes with subtle motion */}
      <div className="hero-blob hero-blob-1 absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#e8e4dc] opacity-60 blur-3xl" />
      <div className="hero-blob hero-blob-2 absolute -bottom-40 -right-40 w-[400px] h-[400px] bg-[#e8e4dc] opacity-50 blur-3xl" />
      <div className="hero-blob hero-blob-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#f0ebe3] opacity-40 blur-2xl" />

      {/* Content */}
      <div className="relative z-10 max-w-2xl w-full flex flex-col items-center text-center">
        <div className="hero-card relative px-10 py-14 sm:px-16 sm:py-20 w-full">
          <h1 className="hero-title font-display text-5xl sm:text-7xl font-semibold text-[#2c2c2c] tracking-tight leading-[1.1] mb-8">
            Buy me a pencil
          </h1>

          <p className="text-[#4a4a4a] text-lg sm:text-xl leading-relaxed mb-12 max-w-lg mx-auto min-h-[1.5em]">
            <TypingText text={DESCRIPTION} className="inline" />
          </p>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsModalOpen(true)}
              variant="primary"
              size="lg"
              className="btn-cta-xl"
            >
              Donate Now
            </Button>
          </div>
        </div>
      </div>

      <DonationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
