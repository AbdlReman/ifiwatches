// Simple test to check Contentful category values
// Run this in your browser console while on your website

async function testCategories() {
  try {
    console.log('🔍 Testing category values...');
    
    // Try to access the Contentful client
    const client = window.contentfulClient || 
                   (typeof require !== 'undefined' ? require('./src/data/contentful') : null);
    
    if (!client) {
      console.log('❌ Contentful client not found. Try running this in the browser console.');
      return;
    }
    
    const entries = await client.getEntries({ content_type: "product", limit: 10 });
    console.log(`📦 Found ${entries.items.length} products`);
    
    const categories = new Set();
    
    entries.items.forEach((item, index) => {
      const fields = item.fields;
      const productName = fields.name || fields.title || `Product ${index}`;
      
      console.log(`\n📱 Product: ${productName}`);
      console.log(`🏷️  Category field:`, fields.category);
      
      if (fields.category) {
        if (Array.isArray(fields.category)) {
          fields.category.forEach(cat => categories.add(cat));
        } else if (typeof fields.category === 'string') {
          categories.add(fields.category);
        } else if (fields.category.fields) {
          const catName = fields.category.fields.name || fields.category.fields.title;
          categories.add(catName);
        }
      }
    });
    
    console.log('\n🎯 All unique category values found:');
    Array.from(categories).sort().forEach(cat => {
      console.log(`  - "${cat}"`);
    });
    
    console.log('\n💡 Based on your list, these should match:');
    const expectedCategories = [
      'menwatches', 'womenwatches', 'unisexwatches', 'luxurywatches',
      'formalwatches', 'casualwatches', 'sportswatches', 'leatherstraps',
      'metalstraps', 'siliconestraps', 'nylonstraps', 'magneticstraps',
      'sunglasses', 'opticalframes', 'fashionrings', 'chainsbracelets',
      'mensperfumes', 'womensperfumes', 'unisexperfumes', 'usedmobiles',
      'mobileaccessories', 'tshirtbuttons', 'pantjeansbuttons', 'shalwarkameezbuttons'
    ];
    
    expectedCategories.forEach(expected => {
      const found = Array.from(categories).some(cat => 
        cat.toLowerCase() === expected.toLowerCase()
      );
      console.log(`${found ? '✅' : '❌'} ${expected}`);
    });
    
  } catch (error) {
    console.error('❌ Error testing categories:', error);
  }
}

// Run the test
testCategories(); 