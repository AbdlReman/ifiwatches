import type { Metadata } from "next";
import "../globals.css";
import PublicChrome from "@/components/PublicChrome";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `${siteConfig.brandName} | Multi-Vendor Lifestyle Marketplace`,
  description:
    "Shop watches, watch straps, perfumes, eyewear, rings, accessories, mobile gadgets, and fashion at ifilifestyle.",
  metadataBase: new URL(siteConfig.url),
};

export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-PK" className="h-full" suppressHydrationWarning>
      <body className="min-h-full flex flex-col antialiased bg-white text-zinc-900" suppressHydrationWarning>
        <PublicChrome>{children}</PublicChrome>
      </body>
    </html>
  );
}
