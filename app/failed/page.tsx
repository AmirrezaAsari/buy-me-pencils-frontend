import Link from 'next/link';
import Button from '../../components/Button';

export default function FailedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#faf9f7]">
      <div className="max-w-md w-full text-center">
        <div
          className="w-12 h-12 mx-auto mb-6 rounded-full bg-[#c17f59]/10 flex items-center justify-center shrink-0 flex-shrink-0"
          aria-hidden
        >
          <svg
            className="w-6 h-6 text-[#c17f59] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-3">
          Payment unsuccessful
        </h1>

        <p className="text-[#4b5563] text-lg leading-relaxed mb-10">
          Something went wrong while processing your payment. Please try again—your support is
          really appreciated.
        </p>

        <Link href="/home">
          <Button variant="primary" size="lg" className="btn-cta-xl">
            Try again
          </Button>
        </Link>
      </div>
    </main>
  );
}
