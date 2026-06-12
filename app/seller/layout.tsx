import type { Metadata } from "next";
import { redirect } from "next/navigation";
import "../globals.css";
import SellerSidebar from "./_components/SellerSidebar";
import { siteConfig } from "@/lib/siteConfig";
import { getSession } from "@/lib/auth/session";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: `Seller - ${siteConfig.brandName}`,
};

export default async function SellerLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session || session.role !== "seller") {
    redirect("/login?next=/seller");
  }

  await connectDB();
  const sellerDoc = await User.findById(session.sub)
    .select("sellerEnabled")
    .lean() as { sellerEnabled?: boolean } | null;

  if (!sellerDoc || sellerDoc.sellerEnabled === false) {
    redirect("/login?disabled=1");
  }

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
