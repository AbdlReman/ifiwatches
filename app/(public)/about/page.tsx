import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

const goals = [
  "Build a trusted lifestyle platform in Pakistan",
  "Support brands and small sellers digitally",
  "Create a simple and modern seller portal system",
  "Develop a scalable platform for future expansion",
];

const differentiators = [
  {
    title: "One Seller Per Product",
    desc: "Every product is listed by one verified, trusted seller only. No duplicates. No confusion. You see a product — you know exactly who stands behind it.",
  },
  {
    title: "Trusted Sellers Only",
    desc: "We don't let anyone list on our platform. Sellers are verified and approved by us. If they're on IFI Lifestyle, they've earned that place.",
  },
  {
    title: "Everything In One Store",
    desc: "Fashion. Eyewear. Fragrance. Accessories. Mobile phones. All lifestyle categories — curated, clean, and in one place.",
  },
  {
    title: "Quality & Standards First",
    desc: "We don't just host products. We set the standard for what gets listed. Our platform reflects quality, not quantity.",
  },
  {
    title: "Built For Our People",
    desc: "We understand the problems Pakistani shoppers face — and we built IFI Lifestyle to solve them. Simple experience. Trusted sellers. Clear choices.",
  },
  {
    title: "A Vision Beyond Pakistan",
    desc: "This model — one seller, one product, full trust — is a concept we plan to take international. We are solving a problem that exists everywhere, starting from home.",
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero — Our Standard, Our Signature */}
      <section className="bg-zinc-100 text-zinc-900 min-h-[60vh] flex items-center border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
            <Link href="/" className="hover:text-zinc-950 transition-colors">
              Home
            </Link>
            {" / "}About
          </p>
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: siteConfig.brandColor }}>
              Our Signature
            </p>
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-tight mb-8">
              IFI Lifestyle
            </h1>
            <blockquote
              className="border-l-4 pl-6 text-zinc-700 text-lg md:text-xl leading-relaxed italic mb-6"
              style={{ borderColor: siteConfig.brandColor }}
            >
              We are not a marketplace. We are a standard.
              <br />
              One product. One trusted seller. Zero confusion.
              <br />
              Everything you need — quality, trust, and simplicity — in one place.
            </blockquote>
            <p className="text-zinc-600 font-semibold tracking-wide">IFI Lifestyle. Iconic Futures Innovations.</p>
          </div>
        </div>
      </section>

      {/* Story, Goal & Vision */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Our Story, Goal & Vision</p>
        <h2 className="text-4xl font-black uppercase tracking-tight mb-8">
          IFI Lifestyle — <span style={{ color: siteConfig.brandColor }}>Iconic Futures Innovations</span>
        </h2>

        <div className="max-w-none text-gray-600 space-y-6 leading-relaxed">
          <p>
            <strong className="text-black">IFI</strong> stands for &ldquo;Iconic Futures Innovations.&rdquo;
          </p>
          <p>
            IFI Lifestyle was created with the vision of building more than just an online store. Our aim is to create a
            modern digital lifestyle platform where trusted brands and sellers can connect with customers through a clean,
            simple, and innovative experience.
          </p>
          <p>
            Our journey started as a lifestyle eCommerce website, but our long-term direction is to evolve into a scalable
            portal platform that supports multiple sellers under one trusted ecosystem.
          </p>
          <p>
            Unlike traditional marketplaces, our focus is not quantity — our focus is quality, trust, branding, and user
            experience. We want to build a platform where selected sellers can professionally present their products while
            customers enjoy a smooth and reliable shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mt-16">
          <div className="border border-gray-200 p-8">
            <h3 className="font-black uppercase tracking-tight text-xl mb-4">Our Goal</h3>
            <ul className="space-y-3 text-gray-600 text-sm leading-relaxed">
              {goals.map((item) => (
                <li key={item} className="flex gap-2">
                  <span style={{ color: siteConfig.brandColor }} aria-hidden>
                    →
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-gray-200 p-8">
            <h3 className="font-black uppercase tracking-tight text-xl mb-4">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become a future-focused digital lifestyle ecosystem that combines innovation, simplicity, and trust under
              one platform.
            </p>
          </div>
          <div className="border border-gray-200 p-8">
            <h3 className="font-black uppercase tracking-tight text-xl mb-4">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Empowering digital commerce with smart technology, modern design, and trusted seller experiences.
            </p>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Signature Message</p>
            <p className="font-semibold text-black text-sm">
              &ldquo;IFI Lifestyle — Building the Future of Digital Lifestyle.&rdquo;
            </p>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">What Makes Us Different</p>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-6">We Solve What Marketplaces Cannot</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Pakistani online shoppers face the same problem every day: too many sellers, too many options for the same
              product, fake reviews, no accountability, and no trust.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Daraz, Alibaba, and similar platforms list the same product from dozens of sellers. The customer
              doesn&apos;t know who to trust. They get confused, they get scammed, and they lose confidence in online
              shopping. <strong className="text-black">We solve that.</strong>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {differentiators.map(({ title, desc }, i) => (
              <div key={title} className="bg-white border border-gray-200 p-8">
                <div
                  className="w-10 h-10 text-black rounded-full flex items-center justify-center font-black text-sm mb-4"
                  style={{ background: siteConfig.brandGradient }}
                >
                  {i + 1}
                </div>
                <h3 className="font-black uppercase tracking-tight text-lg mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Our Promise To Every Customer</p>
        <blockquote className="text-2xl md:text-3xl font-black uppercase tracking-tight leading-snug max-w-4xl mx-auto mb-8">
          &ldquo;You will never be confused on IFI Lifestyle. Every product has one seller. Every seller has our trust. We
          made online shopping simple — the way it should have always been.&rdquo;
        </blockquote>
        <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">IFI Lifestyle — Iconic Futures Innovations</p>
        <p className="mt-2 text-gray-600">Quality. Trust. Standards. For our people. For the world.</p>
      </section>

      {/* CTA */}
      <section className="bg-zinc-100 text-zinc-900 py-20 text-center border-t border-zinc-200">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-6">
          Building the Future of Digital Lifestyle
        </h2>
        <p className="text-zinc-600 mb-10 max-w-xl mx-auto">
          One product. One trusted seller. Premium lifestyle essentials — watches, perfumes, eyewear, accessories, mobile
          gadgets, and fashion.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/shop" className="btn-primary">
            Shop Now
          </Link>
          <Link href="/contact" className="btn-outline-dark">
            Get in Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
