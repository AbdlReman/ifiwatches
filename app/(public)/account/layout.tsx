import Link from "next/link";
import type { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <nav className="flex flex-wrap gap-6 border-b border-zinc-200 pb-4 mb-8 text-sm font-semibold uppercase tracking-widest">
        <Link href="/account" className="text-zinc-600 hover:text-zinc-950">
          Profile
        </Link>
        <Link href="/account/orders" className="text-zinc-600 hover:text-zinc-950">
          My orders
        </Link>
      </nav>
      {children}
    </div>
  );
}
