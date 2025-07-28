// Browser-friendly debug script
// Copy and paste this into your browser console while on your website

async function debugCategoriesBrowser() {
  try {
    console.log('Fetching all products from Contentful...');
    
    // Import the Contentful client (you might need to adjust this path)
    const client = window.contentfulClient || require('./src/data/contentful');
    
    const entries = await client.getEntries({ content_type: "product" });
    
    console.log(`Found ${entries.items.length} products`);
    
    // Collect all unique category values
    const allCategories = new Set();
    const productsByCategory = {};
    
    entries.items.forEach((item, index) => {
      const fields = item.fields;
      const productName = fields.name || fields.title || `Product ${index}`;
      
      // Handle different category field structures
      let categories = [];
      if (fields.category) {
        if (Array.isArray(fields.category)) {
          categories = fields.category;
        } else if (typeof fields.category === 'string') {
          categories = [fields.category];
        } else if (fields.category.fields) {
          // Contentful reference
          categories = [fields.category.fields.name || fields.category.fields.title];
        }
      }
      
      console.log(`\nProduct: ${productName}`);
      console.log(`Categories: ${JSON.stringify(categories)}`);
      
      // Add to sets
      categories.forEach(cat => {
        allCategories.add(cat);
        if (!productsByCategory[cat]) {
          productsByCategory[cat] = [];
        }
        productsByCategory[cat].push(productName);
      });
    });
    
    console.log('\n=== ALL UNIQUE CATEGORIES ===');
    console.log(Array.from(allCategories).sort());
    
    console.log('\n=== PRODUCTS BY CATEGORY ===');
    Object.keys(productsByCategory).sort().forEach(category => {
      console.log(`\n${category}:`);
      productsByCategory[category].forEach(product => {
        console.log(`  - ${product}`);
      });
    });
    
    // Check for expected categories
    const expectedCategories = [
      'menwatches', 'womenwatches', 'unisexwatches', 'luxurywatches', 
      'formalwatches', 'casualwatches', 'sportswatches', 'leatherstraps', 
      'metalstraps', 'siliconestraps', 'nylonstraps', 'magneticstraps', 
      'sunglasses', 'opticalframes', 'fashionrings', 'chainsbracelets', 
      'mensperfumes', 'womensperfumes', 'unisexperfumes', 'usedmobiles', 
      'mobileaccessories', 'tshirt', 'pantjeans', 'shalwarkameez'
    ];
    
    console.log('\n=== MISSING CATEGORIES ===');
    expectedCategories.forEach(expected => {
      if (!allCategories.has(expected)) {
        console.log(`❌ Missing: ${expected}`);
      } else {
        console.log(`✅ Found: ${expected} (${productsByCategory[expected]?.length || 0} products)`);
      }
    });
    
    console.log('\n=== UNEXPECTED CATEGORIES ===');
    Array.from(allCategories).forEach(category => {
      if (!expectedCategories.includes(category)) {
        console.log(`⚠️  Unexpected: ${category} (${productsByCategory[category]?.length || 0} products)`);
      }
    });
    
  } catch (error) {
    console.error('Error debugging categories:', error);
  }
}

// Alternative: If you can't access the client directly, you can check the current page's products
function debugCurrentPageProducts() {
  console.log('Debugging products on current page...');
  
  // Try to find products in the current page's state
  const productElements = document.querySelectorAll('[data-product]');
  console.log(`Found ${productElements.length} product elements on page`);
  
  // You can also check the React DevTools to see the component state
  console.log('Check React DevTools for component state with products');
}

// Run the debug function
debugCategoriesBrowser(); 