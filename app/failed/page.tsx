import Link from 'next/link';
import Button from '../../components/Button';

export default function FailedPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Error icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#c17f59]/15 flex items-center justify-center">
          <span className="text-3xl text-[#c17f59]" aria-hidden>
            ×
          </span>
        </div>

        <div className="w-12 h-px bg-[#c17f59]/50 mx-auto mb-8" />

        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c2c2c] tracking-tight mb-4"
        >
          Payment Unsuccessful
        </h1>

        <p className="text-[#4a4a4a] text-lg leading-relaxed mb-12">
          Something went wrong while processing your payment. Please try again—your support is
          deeply appreciated.
        </p>

        <Link href="/home">
          <Button variant="primary" size="lg">
            Try Again
          </Button>
        </Link>
      </div>
    </main>
  );
}
