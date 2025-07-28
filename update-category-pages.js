const fs = require('fs');
const path = require('path');

// Category mapping for all pages
const categoryMappings = {
  'MensWatchesPage.js': 'menwatches',
  'WomensWatchesPage.js': 'womenwatches',
  'UnisexWatchesPage.js': 'unisexwatches',
  'LuxuryWatchesPage.js': 'luxurywatches',
  'FormalWatchesPage.js': 'formalwatches',
  'CasualWatchesPage.js': 'casualwatches',
  'SportsWatchesPage.js': 'sportswatches',
  'LeatherStrapsPage.js': 'leatherstraps',
  'MetalStrapsPage.js': 'metalstraps',
  'SiliconeStrapsPage.js': 'siliconestraps',
  'NylonStrapsPage.js': 'nylonstraps',
  'MagneticStrapsPage.js': 'magneticstraps',
  'SunglassesPage.js': 'sunglasses',
  'OpticalFramesPage.js': 'opticalframes',
  'FashionRingsPage.js': 'fashionrings',
  'ChainsBraceletsPage.js': 'chainsbracelets',
  'MensPerfumesPage.js': 'mensperfumes',
  'WomensPerfumesPage.js': 'womensperfumes',
  'UnisexPerfumesPage.js': 'unisexperfumes',
  'UsedMobilesPage.js': 'usedmobiles',
  'MobileAccessoriesPage.js': 'mobileaccessories',
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
  
  // Add import for category mapper
  if (!content.includes('import { hasCategory }')) {
    content = content.replace(
      'import DebugCategoryInfo from "../../components/DebugCategoryInfo";',
      'import DebugCategoryInfo from "../../components/DebugCategoryInfo";\nimport { hasCategory } from "../../helpers/categoryMapper";'
    );
  }
  
  // Update the category filtering logic
  const oldPattern = new RegExp(
    `product\\.category && product\\.category\\.includes\\("${categoryName}"\\)`,
    'g'
  );
  const newPattern = `hasCategory(product, "${categoryName}")`;
  
  if (content.includes(`product.category && product.category.includes("${categoryName}")`)) {
    content = content.replace(oldPattern, newPattern);
    console.log(`✅ Updated ${fileName} to use category mapper`);
  } else {
    console.log(`⚠️  No category filtering found in ${fileName}`);
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
    }
  }
  
  fs.writeFileSync(filePath, content);
}

console.log('🔄 Updating category pages to use category mapper...\n');

Object.entries(categoryMappings).forEach(([fileName, categoryName]) => {
  updateCategoryPage(fileName, categoryName);
});

console.log('\n✅ Category pages update complete!');
console.log('\n📝 Next steps:');
console.log('1. Test the pages to see if products now appear');
console.log('2. Check the debug info to see what categories are found');
console.log('3. Remove debug components once everything is working'); 