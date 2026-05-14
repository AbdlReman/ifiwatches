import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export default function ComparePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
        <Link href="/" className="hover:text-black transition-colors">Home</Link>
        {" / "}Compare
      </p>
      <div className="border border-gray-200 rounded-2xl p-8 md:p-12 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 font-black text-black"
          style={{ background: siteConfig.brandGradient }}
        >
          C
        </div>
        <h1 className="text-4xl font-black uppercase tracking-tight mb-4">Compare</h1>
        <p className="text-gray-500 max-w-xl mx-auto mb-8">
          Compare watches, perfumes, eyewear, accessories, gadgets, and fashion products side by side once comparison actions are added to product cards.
        </p>
        <Link href="/shop" className="btn-primary">
          Browse Products
        </Link>
      </div>
    </div>
  );
}
