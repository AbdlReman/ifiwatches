import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Terms of Service — IFI Lifestyle",
  description: "Read the Terms of Service for IFI Lifestyle, including our exchange eligibility, no-refund policy, and shipping conditions.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}Terms of Service
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Terms of Service
          </h1>
          <p className="mt-3 text-zinc-400 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">

        {/* Exchange Eligibility */}
        <section>
          <div className="flex items-start gap-4 mb-5">
            <span
              className="flex-none flex items-center justify-center h-9 w-9 rounded-full text-sm font-black text-zinc-950"
              style={{ background: siteConfig.brandGradient }}
            >
              1
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 mt-1">
              Exchange Eligibility
            </h2>
          </div>
          <div className="pl-13 ml-13 space-y-4 text-zinc-600 text-sm leading-relaxed border-l-2 border-zinc-100 pl-6 ml-[3.25rem]">
            <p>
              Customers may request an exchange within <strong className="text-zinc-900">5 days after delivery</strong> if any of the following conditions are met:
            </p>
            <ul className="space-y-2 list-none">
              {[
                "The item received is significantly different from the product description",
                "The wrong item was delivered",
                "The product has an undisclosed issue",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex-none h-1.5 w-1.5 rounded-full"
                    style={{ background: siteConfig.brandColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-zinc-100" />

        {/* No Refund Policy */}
        <section>
          <div className="flex items-start gap-4 mb-5">
            <span
              className="flex-none flex items-center justify-center h-9 w-9 rounded-full text-sm font-black text-zinc-950"
              style={{ background: siteConfig.brandGradient }}
            >
              2
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 mt-1">
              No Refund Policy
            </h2>
          </div>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed border-l-2 border-zinc-100 pl-6 ml-[3.25rem]">
            <p>
              IFI Lifestyle does <strong className="text-zinc-900">not offer cash refunds or full payment returns.</strong>
            </p>
            <ul className="space-y-2 list-none">
              {[
                "Approved requests will only be processed as product exchange",
                "Store exchange option may be available, subject to availability",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex-none h-1.5 w-1.5 rounded-full"
                    style={{ background: siteConfig.brandColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-zinc-100" />

        {/* Shipping Costs */}
        <section>
          <div className="flex items-start gap-4 mb-5">
            <span
              className="flex-none flex items-center justify-center h-9 w-9 rounded-full text-sm font-black text-zinc-950"
              style={{ background: siteConfig.brandGradient }}
            >
              3
            </span>
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 mt-1">
              Shipping Costs
            </h2>
          </div>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed border-l-2 border-zinc-100 pl-6 ml-[3.25rem]">
            <p>For exchange requests, the following shipping conditions apply:</p>
            <ul className="space-y-2 list-none">
              {[
                "Customers are responsible for sending the product back to our address",
                "Return shipping costs must be covered by the customer",
                "We are not responsible for items lost during return shipping",
                "We recommend using a reliable courier service with tracking",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex-none h-1.5 w-1.5 rounded-full"
                    style={{ background: siteConfig.brandColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-zinc-100" />

        {/* Item Condition */}
        <section>
          <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950 mb-5">
            Item Condition for Exchange
          </h2>
          <div className="space-y-4 text-zinc-600 text-sm leading-relaxed">
            <p>To qualify for an exchange, the following conditions must be met:</p>
            <ul className="space-y-2 list-none">
              {[
                "The item must be returned in the same condition as received",
                "The product must not be excessively used, damaged, or altered after delivery",
                "Original packaging, if provided, should be included",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="mt-1.5 flex-none h-1.5 w-1.5 rounded-full"
                    style={{ background: siteConfig.brandColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <div className="border-t border-zinc-100" />

        {/* Contact */}
        <section className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 mb-3">
            Questions?
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed mb-4">
            For any exchange requests or questions about these terms, please reach out to us directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              {siteConfig.contact.email}
            </a>
            <span className="text-zinc-300">·</span>
            <a
              href={siteConfig.contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              WhatsApp
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
