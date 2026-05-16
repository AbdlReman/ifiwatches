"use client";

import dynamic from "next/dynamic";
import { Toaster } from "sonner";

const Navbar = dynamic(() => import("@/components/Navbar"), {
  ssr: false,
  loading: () => (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-200">
      <div className="bg-zinc-50 text-center py-2 text-xs font-bold tracking-widest uppercase min-h-[36px]" />
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" />
    </header>
  ),
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: false,
  loading: () => <footer className="bg-zinc-50 min-h-[280px]" aria-hidden />,
});

export default function PublicChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Toaster position="top-center" richColors closeButton duration={3000} />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
