import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata = {
  title: "Cookie Policy — IFI Lifestyle",
  description: "Understand how IFI Lifestyle uses cookies and similar technologies on our platform.",
};

const sections = [
  {
    title: "What Are Cookies",
    body: "Cookies are small text files placed on your device when you visit a website. They help the site remember your preferences, keep you logged in, and understand how you interact with content. Cookies do not contain personal data on their own.",
  },
  {
    title: "Cookies We Use",
    items: [
      {
        name: "Essential Cookies",
        desc: "Required for the platform to function. These include session authentication, shopping cart state, and security tokens. You cannot opt out of these without affecting site functionality.",
      },
      {
        name: "Preference Cookies",
        desc: "Remember your settings such as currency, language, and filter preferences so you don't have to re-enter them on each visit.",
      },
      {
        name: "Analytics Cookies",
        desc: "Help us understand how visitors use our platform — which pages are visited most, where users drop off, and how we can improve the experience. Data is aggregated and anonymous.",
      },
      {
        name: "Marketing Cookies",
        desc: "Used to show you relevant products and promotions based on your browsing behaviour. These may be set by third-party advertising partners.",
      },
    ],
  },
  {
    title: "Third-Party Cookies",
    body: "Some cookies are placed by third-party services we use, such as payment gateways, analytics providers, and social media platforms. These third parties have their own privacy and cookie policies, which we encourage you to review.",
  },
  {
    title: "Managing Cookies",
    body: "You can control and delete cookies through your browser settings. Most browsers allow you to block or delete cookies, though doing so may affect your experience on our platform. Disabling essential cookies will prevent you from logging in or completing purchases.",
  },
  {
    title: "Cookie Retention",
    body: "Session cookies expire when you close your browser. Persistent cookies remain on your device for a set period — typically between 30 days and 2 years — or until you manually delete them.",
  },
];

export default function CookiePolicyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-zinc-950 text-white border-b border-zinc-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}Cookie Policy
          </p>
          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            Cookie Policy
          </h1>
          <p className="mt-3 text-zinc-400 text-sm">Last updated: June 2025</p>
        </div>
      </section>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <p className="text-zinc-600 text-sm leading-relaxed max-w-2xl">
          This Cookie Policy explains how <strong className="text-zinc-900">IFI Lifestyle</strong> uses cookies
          and similar tracking technologies on <span className="text-zinc-900 font-semibold">{siteConfig.domain}</span>.
          By continuing to use our platform, you consent to our use of cookies as described here.
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

            <div className="border-l-2 border-zinc-100 pl-6 ml-[3rem]">
              {"body" in section && (
                <p className="text-zinc-600 text-sm leading-relaxed">{section.body}</p>
              )}
              {"items" in section && (
                <div className="space-y-5">
                  {section.items!.map((item) => (
                    <div key={item.name}>
                      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: siteConfig.brandColor }}>
                        {item.name}
                      </p>
                      <p className="text-zinc-600 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {i < sections.length - 1 && <div className="border-t border-zinc-100 mt-10" />}
          </section>
        ))}

        {/* Contact */}
        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8 mt-6">
          <h2 className="text-sm font-black uppercase tracking-widest text-zinc-950 mb-3">
            Questions About Cookies?
          </h2>
          <p className="text-zinc-600 text-sm leading-relaxed mb-4">
            If you have questions about our use of cookies, please get in touch with us.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              {siteConfig.contact.email}
            </a>
            <span className="text-zinc-300">·</span>
            <Link
              href="/privacy-policy"
              className="text-xs font-bold uppercase tracking-widest text-zinc-700 underline decoration-1 underline-offset-4 hover:text-zinc-950"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
