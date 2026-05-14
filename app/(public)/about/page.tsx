import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const team = [
  { name: "Vendor Network", role: "Multi-vendor marketplace", badge: "V" },
  { name: "Customer Care", role: "Support across Pakistan", badge: "C" },
  { name: "Product Team", role: "Lifestyle category curation", badge: "P" },
  { name: "Operations", role: "Shipping and discreet packaging", badge: "O" },
];

const milestones = [
  { year: "2024", event: "Built a lifestyle marketplace for Pakistani shoppers" },
  { year: "2025", event: "Expanded into watches, perfumes, eyewear, fashion, and gadgets" },
  { year: "2026", event: "Opened seller tools for multi-vendor growth" },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-black text-white min-h-[60vh] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            {" / "}About
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tight leading-none mb-8">
                Our
                <br />
                <span style={{ color: siteConfig.brandColor }}>Story</span>
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed max-w-lg">
                {siteConfig.brandName} is a multi-vendor lifestyle marketplace for shoppers who want premium everyday products in one trusted place.
                We connect customers with sellers across watches, perfumes, eyewear, accessories, mobile gadgets, and fashion.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[["7", "Top Categories"], ["2", "Payment Wallets"], ["1", "Raast Option"], ["PK", "Pakistan Delivery"]].map(([num, label]) => (
                <div key={label} className="border border-gray-800 p-6">
                  <p className="text-4xl font-black mb-2">{num}</p>
                  <p className="text-gray-500 text-xs uppercase tracking-widest">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Our Mission</p>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-6">
              A Marketplace For Lifestyle Essentials
            </h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Our mission is to make shopping easier for customers while giving sellers a focused platform for lifestyle products.
              Customers can browse multiple categories, checkout quickly, and contact support when they need help.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              Orders above Rs. 3000 qualify for free shipping across Pakistan, and each parcel is shipped in discreet packaging for customer privacy.
            </p>
            <Link href="/shop" className="btn-primary">
              Shop the Collection
            </Link>
          </div>

          {/* Values */}
          <div className="space-y-6">
            {[
              { title: "Multi-Vendor Range", desc: "Sellers can list products across watches, straps, perfumes, eyewear, accessories, gadgets, and fashion." },
              { title: "Private Delivery", desc: "Plain packaging keeps every order discreet from checkout to delivery." },
              { title: "Local Support", desc: `Reach us at ${siteConfig.contact.phone} or ${siteConfig.contact.email}.` },
            ].map(({ title, desc }, i) => (
              <div key={title} className="flex gap-5">
                <div
                  className="w-10 h-10 text-black rounded-full flex-shrink-0 flex items-center justify-center font-black text-sm"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tight text-lg mb-1">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Our Journey</p>
            <h2 className="text-4xl font-black uppercase tracking-tight">Milestones</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-gray-300" />
            <div className="space-y-8">
              {milestones.map(({ year, event }) => (
                <div key={year} className="flex gap-8 items-start">
                  <div className="w-32 flex-shrink-0 text-right">
                    <span className="font-black text-lg">{year}</span>
                  </div>
                  <div className="relative flex-shrink-0">
                  <div className="w-3 h-3 rounded-full mt-1.5" style={{ background: siteConfig.brandColor }} />
                  </div>
                  <p className="text-gray-600 pt-0.5">{event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">The People</p>
          <h2 className="text-4xl font-black uppercase tracking-tight">Meet the Marketplace</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {team.map(({ name, role, badge }) => (
            <div key={name} className="text-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-black"
                style={{ background: siteConfig.brandGradient }}
              >
                {badge}
              </div>
              <h3 className="font-black uppercase tracking-tight text-sm mb-1">{name}</h3>
              <p className="text-gray-500 text-xs">{role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black text-white py-20 text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tight mb-6">
          Ready to Shop?
        </h2>
        <p className="text-gray-400 mb-10 max-w-md mx-auto">
          Browse watches, watch straps, perfumes, eyewear, accessories, mobile gadgets, and fashion.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Shop Now
          </Link>
          <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-black">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
