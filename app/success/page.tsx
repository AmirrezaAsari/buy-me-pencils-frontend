import Link from 'next/link';
import Button from '../../components/Button';

export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Success icon */}
        <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[#8b9a7d]/20 flex items-center justify-center">
          <span className="text-4xl" aria-hidden>
            ✓
          </span>
        </div>

        <div className="w-12 h-px bg-[#8b9a7d] mx-auto mb-8" />

        <h1
          className="font-serif text-4xl sm:text-5xl font-semibold text-[#2c2c2c] tracking-tight mb-4"
        >
          Thank You
        </h1>

        <p className="text-[#4a4a4a] text-lg leading-relaxed mb-12">
          Your support means the world. Your contribution helps me continue creating art, guides,
          and resources for everyone.
        </p>

        <Link href="/home">
          <Button variant="primary" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </main>
  );
}
