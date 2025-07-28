const fs = require('fs');
const path = require('path');

// Complete category mapping for all pages
const categoryMappings = {
  // Watch categories
  'MensWatchesPage.js': 'menwatches',
  'WomensWatchesPage.js': 'womenwatches',
  'UnisexWatchesPage.js': 'unisexwatches',
  'LuxuryWatchesPage.js': 'luxurywatches',
  'FormalWatchesPage.js': 'formalwatches',
  'CasualWatchesPage.js': 'casualwatches',
  'SportsWatchesPage.js': 'sportswatches',
  
  // Watch strap categories
  'LeatherStrapsPage.js': 'leatherstraps',
  'MetalStrapsPage.js': 'metalstraps',
  'SiliconeStrapsPage.js': 'siliconestraps',
  'NylonStrapsPage.js': 'nylonstraps',
  'MagneticStrapsPage.js': 'magneticstraps',
  
  // Eyewear categories
  'SunglassesPage.js': 'sunglasses',
  'OpticalFramesPage.js': 'opticalframes',
  
  // Accessories categories
  'FashionRingsPage.js': 'fashionrings',
  'ChainsBraceletsPage.js': 'chainsbracelets',
  
  // Perfume categories
  'MensPerfumesPage.js': 'mensperfumes',
  'WomensPerfumesPage.js': 'womensperfumes',
  'UnisexPerfumesPage.js': 'unisexperfumes',
  
  // Mobile categories
  'UsedMobilesPage.js': 'usedmobiles',
  'MobileAccessoriesPage.js': 'mobileaccessories',
  
  // Fashion categories
  'TshirtButtonsPage.js': 'tshirtbuttons',
  'PantJeansButtonsPage.js': 'pantjeansbuttons',
  'ShalwarKameezButtonsPage.js': 'shalwarkameezbuttons'
};

const categoryPagesDir = path.join(__dirname, 'src', 'pages', 'category');

function updateCategoryPage(fileName, categoryName) {
  const filePath = path.join(categoryPagesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Add import for category mapper if not present
  if (!content.includes('import { hasCategory }')) {
    // Find the last import statement
    const importMatch = content.match(/(import.*from.*;?\s*)+/);
    if (importMatch) {
      const newImport = `import { hasCategory } from "../../helpers/categoryMapper";\n`;
      content = content.replace(importMatch[0], importMatch[0] + newImport);
      console.log(`✅ Added category mapper import to ${fileName}`);
      updated = true;
    }
  }
  
  // Update the category filtering logic
  const oldPattern = new RegExp(
    `product\\.category && product\\.category\\.includes\\("${categoryName}"\\)`,
    'g'
  );
  const newPattern = `hasCategory(product, "${categoryName}")`;
  
  if (content.includes(`product.category && product.category.includes("${categoryName}")`)) {
    content = content.replace(oldPattern, newPattern);
    console.log(`✅ Updated category filtering in ${fileName}`);
    updated = true;
  }
  
  // Add debug component if not present
  if (!content.includes('DebugCategoryInfo')) {
    // Find the container div and add debug component
    const containerPattern = /<div className="shop-area pt-95 pb-100">\s*<div className="container">/;
    const debugComponent = `        <div className="shop-area pt-95 pb-100">
          <div className="container">
            {/* Debug Info - Remove this after debugging */}
            <DebugCategoryInfo 
              products={products} 
              categoryName="${categoryName}" 
              loading={loading} 
            />`;
    
    if (content.match(containerPattern)) {
      content = content.replace(containerPattern, debugComponent);
      console.log(`✅ Added debug component to ${fileName}`);
      updated = true;
    }
  }
  
  // Add DebugCategoryInfo import if not present
  if (!content.includes('import DebugCategoryInfo')) {
    const importMatch = content.match(/(import.*from.*;?\s*)+/);
    if (importMatch) {
      const newImport = `import DebugCategoryInfo from "../../components/DebugCategoryInfo";\n`;
      content = content.replace(importMatch[0], importMatch[0] + newImport);
      console.log(`✅ Added debug component import to ${fileName}`);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Successfully updated ${fileName}`);
  } else {
    console.log(`⚠️  No changes needed for ${fileName}`);
  }
}

console.log('🔄 Fixing ALL category pages to use category mapper...\n');

Object.entries(categoryMappings).forEach(([fileName, categoryName]) => {
  updateCategoryPage(fileName, categoryName);
});

console.log('\n✅ All category pages have been updated!');
console.log('\n📝 Next steps:');
console.log('1. Test the pages to see if products now appear');
console.log('2. Check the debug info to see what categories are found');
console.log('3. Remove debug components once everything is working');
console.log('\n🔍 If products still don\'t appear:');
console.log('1. Check the debug info on each page');
console.log('2. Verify the category values in Contentful match the expected values');
console.log('3. Update the categoryMapper in src/helpers/categoryMapper.js if needed'); 