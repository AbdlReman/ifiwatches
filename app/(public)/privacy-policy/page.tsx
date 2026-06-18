import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Privacy Policy — IFI Lifestyle",
  description: "Learn how IFI Lifestyle collects, uses, and protects your personal information.",
};

const sections = [
  {
    title: "Information We Collect",
    items: [
      "Name, email address, and phone number when you register or place an order",
      "Delivery address and billing information for order processing",
      "Browsing behavior and product interactions on our platform",
      "Device information and IP address for security and analytics",
    ],
  },
  {
    title: "How We Use Your Information",
    items: [
      "To process and fulfill your orders",
      "To communicate order updates, shipping notifications, and customer support",
      "To send newsletters and promotional offers (you may unsubscribe at any time)",
      "To improve our platform, detect fraud, and ensure security",
      "To comply with legal obligations",
    ],
  },
  {
    title: "Information Sharing",
    items: [
      "We share your delivery details with verified sellers only to fulfill your order",
      "We do not sell, rent, or trade your personal information to third parties",
      "We may disclose information if required by law or to protect our rights",
      "Payment processing is handled by secure third-party payment providers",
    ],
  },
  {
    title: "Data Security",
    items: [
      "We use industry-standard encryption to protect your data in transit and at rest",
      "Access to personal data is restricted to authorised personnel only",
      "We regularly review our security practices to protect against breaches",
      "Despite our efforts, no method of transmission over the internet is 100% secure",
    ],
  },
  {
    title: "Your Rights",
    items: [
      "You may request access to the personal data we hold about you",
      "You may request correction of inaccurate or incomplete data",
      "You may request deletion of your account and associated data",
      "You may opt out of marketing communications at any time",
    ],
  },
  {
    title: "Data Retention",
    items: [
      "We retain your account data for as long as your account is active",
      "Order records are kept for up to 5 years for legal and accounting purposes",
      "You may request early deletion by contacting our support team",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}Privacy Policy
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Privacy Policy
          </h1>
          <p className="mt-3 text-zinc-400 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl">
          At <strong className="text-zinc-900">IFI Lifestyle</strong>, your privacy is important to us. This Privacy Policy explains
          how we collect, use, and protect your personal information when you use our platform at{" "}
          <span className="text-zinc-900 font-semibold">{siteConfig.domain}</span>.
        </p>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {sections.map((section, i) => (
          <section key={section.title}>
            <div className="flex items-start gap-4 mb-4">
              <span
                className="flex-none flex items-center justify-center h-8 w-8 rounded-full text-xs font-black text-zinc-950"
                style={{ background: siteConfig.brandGradient }}
              >
                {i + 1}
              </span>
              <h2 className="text-lg font-black uppercase tracking-tight text-zinc-950 mt-0.5">
                {section.title}
              </h2>
            </div>
            <ul className="space-y-2 border-l-2 border-zinc-100 pl-6 ml-[3rem]">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-600 text-sm leading-relaxed">
                  <span
                    className="mt-1.5 flex-none h-1.5 w-1.5 rounded-full"
                    style={{ background: siteConfig.brandColor }}
                  />
                  {item}
                </li>
              ))}
            </ul>
            {i < sections.length - 1 && <div className="border-t border-zinc-100 mt-10" />}
          </section>
        ))}

        {/* Contact */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mt-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 mb-3">
            Contact Us About Privacy
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed mb-4">
            If you have any questions or concerns about this Privacy Policy or how we handle your data,
            please contact us.
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
        </div>
      </div>
    </div>
  );
}
