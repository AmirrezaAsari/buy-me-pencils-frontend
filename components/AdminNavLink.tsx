'use client';

import Link from 'next/link';
import { useAuthMe } from '../hooks/use-auth-me';

export default function AdminNavLink() {
  const { user, isLoading } = useAuthMe();

  if (isLoading || !user || user.type !== 'admin') {
    return null;
  }

  return (
    <Link
      href="/admin/withdrawals"
      className="text-sm font-medium text-[#6b7280] hover:text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#c17f59]/30 rounded px-2 py-1"
    >
      Admin
    </Link>
  );
}
