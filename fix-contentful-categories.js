// Script to identify and fix problematic category values in Contentful
// Run this to see what needs to be fixed in your Contentful data

const contentful = require('contentful');

// You'll need to add your Contentful credentials here
const client = contentful.createClient({
  space: process.env.CONTENTFUL_SPACE_ID || 'your-space-id',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || 'your-access-token',
});

async function analyzeContentfulCategories() {
  try {
    console.log('🔍 Analyzing Contentful categories...\n');
    
    const entries = await client.getEntries({ content_type: "product", limit: 100 });
    console.log(`📦 Found ${entries.items.length} products\n`);
    
    const problematicProducts = [];
    const normalProducts = [];
    const allCategories = new Set();
    
    entries.items.forEach((item, index) => {
      const fields = item.fields;
      const productName = fields.title || fields.name || `Product ${index}`;
      const productId = item.sys.id;
      
      if (fields.category) {
        if (Array.isArray(fields.category)) {
          // Array of categories - this is good
          fields.category.forEach(cat => allCategories.add(cat));
          normalProducts.push({
            name: productName,
            id: productId,
            categories: fields.category,
            type: 'array'
          });
        } else if (typeof fields.category === 'string') {
          allCategories.add(fields.category);
          
          if (fields.category.length > 50) {
            // This is a problematic concatenated string
            problematicProducts.push({
              name: productName,
              id: productId,
              category: fields.category,
              length: fields.category.length
            });
          } else {
            // Normal single category
            normalProducts.push({
              name: productName,
              id: productId,
              category: fields.category,
              type: 'string'
            });
          }
        }
      } else {
        // No category
        normalProducts.push({
          name: productName,
          id: productId,
          category: null,
          type: 'none'
        });
      }
    });
    
    console.log('🚨 PROBLEMATIC PRODUCTS (Concatenated Categories):');
    console.log('These products will appear in ALL categories and need to be fixed!\n');
    
    if (problematicProducts.length === 0) {
      console.log('✅ No problematic products found!');
    } else {
      problematicProducts.forEach(product => {
        console.log(`📱 Product: ${product.name}`);
        console.log(`   ID: ${product.id}`);
        console.log(`   Category Length: ${product.length} characters`);
        console.log(`   Category: "${product.category}"`);
        console.log('');
      });
    }
    
    console.log('\n📋 ALL UNIQUE CATEGORIES FOUND:');
    Array.from(allCategories).sort().forEach(cat => {
      console.log(`  - "${cat}"`);
    });
    
    console.log('\n✅ NORMAL PRODUCTS:');
    normalProducts.forEach(product => {
      if (product.type === 'array') {
        console.log(`📱 ${product.name} (ID: ${product.id}) - Categories: [${product.categories.join(', ')}]`);
      } else if (product.type === 'string') {
        console.log(`📱 ${product.name} (ID: ${product.id}) - Category: "${product.category}"`);
      } else {
        console.log(`📱 ${product.name} (ID: ${product.id}) - No category`);
      }
    });
    
    console.log('\n🔧 HOW TO FIX PROBLEMATIC PRODUCTS:');
    console.log('1. Go to Contentful and find the problematic products listed above');
    console.log('2. For each product, set the category field to ONE of these values:');
    console.log('   - menwatches, womenwatches, unisexwatches');
    console.log('   - luxurywatches, formalwatches, casualwatches, sportswatches');
    console.log('   - leatherstraps, metalstraps, siliconestraps, nylonstraps, magneticstraps');
    console.log('   - sunglasses, opticalframes, fashionrings, chainsbracelets');
    console.log('   - mensperfumes, womensperfumes, unisexperfumes');
    console.log('   - usedmobiles, mobileaccessories');
    console.log('   - tshirtbuttons, pantjeansbuttons, shalwarkameezbuttons');
    console.log('3. Save the changes');
    console.log('4. The products will then only appear in their correct category pages');
    
  } catch (error) {
    console.error('❌ Error analyzing Contentful:', error);
    console.log('\n💡 To use this script:');
    console.log('1. Set your Contentful credentials:');
    console.log('   CONTENTFUL_SPACE_ID=your-space-id');
    console.log('   CONTENTFUL_ACCESS_TOKEN=your-access-token');
    console.log('2. Run: node fix-contentful-categories.js');
  }
}

// Run the analysis
analyzeContentfulCategories(); 