import type { Metadata } from "next";
import "../globals.css";
import SellerSidebar from "./_components/SellerSidebar";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Seller - ${siteConfig.brandName}`,
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-950 text-slate-100 antialiased">
        <div className="min-h-full flex bg-slate-950 text-slate-100">
          <SellerSidebar />
          <div className="flex-1 flex flex-col min-h-screen overflow-auto bg-slate-950">
            <main className="flex-1 p-6 lg:p-8 bg-slate-950">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
