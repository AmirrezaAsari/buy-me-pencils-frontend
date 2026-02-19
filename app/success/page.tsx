import Link from 'next/link';
import Button from '../../components/Button';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-[#faf9f7]">
      <div className="max-w-md w-full text-center">
        <div
          className="mx-auto mb-6 rounded-full bg-[#c17f59]/10 flex items-center justify-center shrink-0 overflow-hidden"
          style={{ width: 48, height: 48, minWidth: 48, maxWidth: 48, minHeight: 48, maxHeight: 48 }}
          aria-hidden
        >
          <svg
            className="text-[#c17f59] shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            style={{ width: 24, height: 24, minWidth: 24, maxWidth: 24, minHeight: 24, maxHeight: 24 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a] tracking-tight mb-3">
          Thank you
        </h1>

        <p className="text-[#4b5563] text-lg leading-relaxed mb-10">
          Your support means a lot. Your contribution helps me keep creating art, guides, and
          resources for everyone.
        </p>

        <Link href="/home">
          <Button variant="primary" size="lg" className="btn-cta-xl">
            Return home
          </Button>
        </Link>
      </div>
    </main>
  );
}
