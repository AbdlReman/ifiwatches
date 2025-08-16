const fs = require('fs');
const path = require('path');

// Base URL for the website
const BASE_URL = 'https://www.ifilifestyle.com';

// Static pages with their priorities and change frequencies
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/top-categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/categories', priority: '0.9', changefreq: 'weekly' },
  { url: '/watches', priority: '0.8', changefreq: 'weekly' },
  { url: '/watch-straps', priority: '0.8', changefreq: 'weekly' },
  { url: '/eyewear', priority: '0.8', changefreq: 'weekly' },
  { url: '/rings-accessories', priority: '0.8', changefreq: 'weekly' },
  { url: '/perfumes', priority: '0.8', changefreq: 'weekly' },
  { url: '/mobile-gadgets', priority: '0.8', changefreq: 'weekly' },
  { url: '/fashion', priority: '0.8', changefreq: 'weekly' },
  { url: '/watches/mens', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/womens', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/unisex', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/luxury', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/formal', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/casual', priority: '0.7', changefreq: 'weekly' },
  { url: '/watches/sports', priority: '0.7', changefreq: 'weekly' },
  { url: '/watch-straps/leather', priority: '0.7', changefreq: 'weekly' },
  { url: '/watch-straps/metal', priority: '0.7', changefreq: 'weekly' },
  { url: '/watch-straps/silicone', priority: '0.7', changefreq: 'weekly' },
  { url: '/watch-straps/nylon', priority: '0.7', changefreq: 'weekly' },
  { url: '/watch-straps/magnetic', priority: '0.7', changefreq: 'weekly' },
  { url: '/eyewear/sunglasses', priority: '0.7', changefreq: 'weekly' },
  { url: '/eyewear/optical', priority: '0.7', changefreq: 'weekly' },
  { url: '/rings-accessories/fashion-rings', priority: '0.7', changefreq: 'weekly' },
  { url: '/rings-accessories/chains-bracelets', priority: '0.7', changefreq: 'weekly' },
  { url: '/perfumes/mens', priority: '0.7', changefreq: 'weekly' },
  { url: '/perfumes/womens', priority: '0.7', changefreq: 'weekly' },
  { url: '/perfumes/unisex', priority: '0.7', changefreq: 'weekly' },
  { url: '/mobile-gadgets/used-mobiles', priority: '0.7', changefreq: 'weekly' },
  { url: '/mobile-gadgets/accessories', priority: '0.7', changefreq: 'weekly' },
  { url: '/fashion/tshirt', priority: '0.7', changefreq: 'weekly' },
  { url: '/fashion/pant-jeans', priority: '0.7', changefreq: 'weekly' },
  { url: '/fashion/shalwar-kameez', priority: '0.7', changefreq: 'weekly' },
  { url: '/shop', priority: '0.8', changefreq: 'daily' },
  { url: '/blog-standard', priority: '0.6', changefreq: 'weekly' },
  { url: '/blog-no-sidebar', priority: '0.6', changefreq: 'weekly' },
  { url: '/blog-right-sidebar', priority: '0.6', changefreq: 'weekly' },
  { url: '/blog-details-standard', priority: '0.5', changefreq: 'monthly' },
  { url: '/about', priority: '0.6', changefreq: 'monthly' },
  { url: '/contact', priority: '0.6', changefreq: 'monthly' },
  { url: '/my-account', priority: '0.5', changefreq: 'monthly' },
  { url: '/login-register', priority: '0.5', changefreq: 'monthly' },
  { url: '/cart', priority: '0.4', changefreq: 'monthly' },
  { url: '/wishlist', priority: '0.4', changefreq: 'monthly' },
  { url: '/compare', priority: '0.4', changefreq: 'monthly' },
  { url: '/checkout', priority: '0.4', changefreq: 'monthly' }
];

// Function to generate XML sitemap
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
`;

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`;
  });

  // Add product pages (you can extend this to fetch from your database/API)
  // For now, we'll add a placeholder for dynamic product URLs
  // In a real implementation, you would fetch product data and add URLs like:
  // ${BASE_URL}/product/product-slug

  sitemap += `</urlset>`;

  return sitemap;
}

// Function to write sitemap to file
function writeSitemap() {
  const sitemap = generateSitemap();
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  try {
    fs.writeFileSync(sitemapPath, sitemap);
    console.log('✅ Sitemap generated successfully at:', sitemapPath);
    console.log(`📊 Total URLs in sitemap: ${staticPages.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
  }
}

// Function to add product URLs to sitemap
function addProductUrls(products) {
  const currentDate = new Date().toISOString().split('T')[0];
  let productUrls = '';
  
  products.forEach(product => {
    productUrls += `  <url>
    <loc>${BASE_URL}/product/${product.slug}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
`;
  });
  
  return productUrls;
}

// Export functions for use in other scripts
module.exports = {
  generateSitemap,
  writeSitemap,
  addProductUrls,
  BASE_URL
};

// Run the script if called directly
if (require.main === module) {
  writeSitemap();
}
