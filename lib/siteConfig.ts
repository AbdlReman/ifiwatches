export const siteConfig = {
  brandName: "ifilifestyle",
  brandInitials: "IFI",
  domain: "ifilifestyle.com",
  url: "https://www.ifilifestyle.com/",
  logo: {
    src: "/logo.png",
    alt: "ifilifestyle logo",
  },
  images: {
    hero: "/images/product/default-product.jpg",
    productPlaceholder: "/images/product/default-product.jpg",
  },
  brandColor: "rgb(218, 170, 88)",
  brandGradient: "linear-gradient(135deg, rgb(218, 170, 88) 0%, rgb(244, 202, 104) 100%)",
  categories: [
    "Watches",
    "Watch Straps",
    "Perfumes",
    "Eyewear",
    "Rings & Accessories",
    "Mobile Gadgets",
    "Fashion",
  ],
  utilityLinks: [
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "Compare", href: "/compare" },
  ],
  contact: {
    phone: "+923360054420",
    whatsapp: "+923313454719",
    whatsappHref: "https://wa.me/923313454719",
    email: "support@ifilifestyle.com",
  },
  social: {
    facebook: "https://www.facebook.com/profile.php?id=61576339149106",
    instagram: "https://www.instagram.com/ifilifestyle",
    tiktok: "https://www.tiktok.com/@ifilifestyle.com",
  },
  trustBadges: [
    {
      title: "Free Shipping",
      description: "Free shipping on all orders above Rs. 3000 across Pakistan",
    },
    {
      title: "Discreet Packaging",
      description: "All orders are delivered in plain, discreet packaging for your privacy",
    },
  ],
} as const;

export const paymentMethods = [
  {
    value: "easypaisa",
    label: "Easy Paisa",
    accounts: [
      { account: "03448935702", holder: "Ibrar Ullah" },
      { account: "03329779996", holder: "Moiz Paracha" },
    ],
  },
  {
    value: "jazzcash",
    label: "Jazz Cash",
    accounts: [
      { account: "03448935702", holder: "Ibrar Ullah" },
      { account: "03329779996", holder: "Ahmed Abdul Malik Paracha" },
    ],
  },
  {
    value: "raast",
    label: "Raast Payment",
    accounts: [
      {
        account: "03448935702",
        holder: "Ibrar Ullah",
        iban: "PK47TMB0000000082782492",
      },
    ],
  },
] as const;
