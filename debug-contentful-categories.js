// Copy and paste this into your browser console while on your website
// This will show you exactly what categories exist in your Contentful data

async function debugContentfulCategories() {
  try {
    console.log('🔍 Debugging Contentful categories...');
    
    // Try to get the Contentful client
    let client;
    if (window.contentfulClient) {
      client = window.contentfulClient;
    } else {
      // Try to find it in the React app
      const reactRoot = document.querySelector('#root');
      if (reactRoot && reactRoot._reactInternalFiber) {
        console.log('React app found, but Contentful client not accessible');
        return;
      }
    }
    
    if (!client) {
      console.log('❌ Contentful client not found. Please run this while on a category page.');
      return;
    }
    
    // Fetch all products
    const entries = await client.getEntries({ content_type: "product", limit: 50 });
    console.log(`📦 Found ${entries.items.length} products`);
    
    // Collect all categories
    const allCategories = new Set();
    const productsByCategory = {};
    
    entries.items.forEach((item, index) => {
      const fields = item.fields;
      const productName = fields.name || fields.title || `Product ${index}`;
      
      console.log(`\n📱 Product ${index + 1}: ${productName}`);
      console.log(`🏷️  Category field:`, fields.category);
      
      // Handle different category formats
      let categories = [];
      if (fields.category) {
        if (Array.isArray(fields.category)) {
          categories = fields.category;
        } else if (typeof fields.category === 'string') {
          categories = [fields.category];
        } else if (fields.category.fields) {
          // Contentful reference
          const catName = fields.category.fields.name || fields.category.fields.title;
          categories = [catName];
        }
      }
      
      // Add to tracking
      categories.forEach(cat => {
        allCategories.add(cat);
        if (!productsByCategory[cat]) {
          productsByCategory[cat] = [];
        }
        productsByCategory[cat].push(productName);
      });
    });
    
    console.log('\n🎯 ALL UNIQUE CATEGORIES FOUND:');
    Array.from(allCategories).sort().forEach(cat => {
      console.log(`  - "${cat}" (${productsByCategory[cat]?.length || 0} products)`);
    });
    
    console.log('\n📋 PRODUCTS BY CATEGORY:');
    Object.keys(productsByCategory).sort().forEach(category => {
      console.log(`\n${category}:`);
      productsByCategory[category].forEach(product => {
        console.log(`  • ${product}`);
      });
    });
    
    // Check against expected categories
    const expectedCategories = [
      'menwatches', 'womenwatches', 'unisexwatches', 'luxurywatches',
      'formalwatches', 'casualwatches', 'sportswatches', 'leatherstraps',
      'metalstraps', 'siliconestraps', 'nylonstraps', 'magneticstraps',
      'sunglasses', 'opticalframes', 'fashionrings', 'chainsbracelets',
      'mensperfumes', 'womensperfumes', 'unisexperfumes', 'usedmobiles',
      'mobileaccessories', 'tshirtbuttons', 'pantjeansbuttons', 'shalwarkameezbuttons'
    ];
    
    console.log('\n✅❌ CATEGORY MATCHING:');
    expectedCategories.forEach(expected => {
      const found = Array.from(allCategories).some(cat => 
        cat.toLowerCase() === expected.toLowerCase()
      );
      const count = productsByCategory[expected]?.length || 0;
      console.log(`${found ? '✅' : '❌'} ${expected}: ${count} products`);
    });
    
    console.log('\n⚠️  UNEXPECTED CATEGORIES:');
    Array.from(allCategories).forEach(category => {
      if (!expectedCategories.includes(category)) {
        console.log(`⚠️  "${category}" (${productsByCategory[category]?.length || 0} products)`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error debugging categories:', error);
  }
}

// Alternative: If you can't access Contentful directly
function debugCurrentPage() {
  console.log('🔍 Debugging current page...');
  
  // Look for React component state
  const reactRoot = document.querySelector('#root');
  if (reactRoot) {
    console.log('React root found. Check React DevTools for component state.');
  }
  
  // Look for any product data in the DOM
  const productElements = document.querySelectorAll('[data-product], .product-item, .product-card');
  console.log(`Found ${productElements.length} product elements on page`);
  
  // Look for any category information
  const categoryElements = document.querySelectorAll('[data-category], .category, .breadcrumb');
  console.log(`Found ${categoryElements.length} category elements on page`);
}

// Run the debug function
debugContentfulCategories();

// Also run the alternative
debugCurrentPage(); 