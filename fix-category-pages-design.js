const fs = require('fs');
const path = require('path');

// List of category pages that need to be fixed
const categoryPages = [
  'CasualWatchesPage.js',
  'SportsWatchesPage.js',
  'UnisexWatchesPage.js',
  'WomensWatchesPage.js',
  'LeatherStrapsPage.js',
  'MetalStrapsPage.js',
  'SiliconeStrapsPage.js',
  'NylonStrapsPage.js',
  'MagneticStrapsPage.js',
  'SunglassesPage.js',
  'OpticalFramesPage.js',
  'FashionRingsPage.js',
  'ChainsBraceletsPage.js',
  'MensPerfumesPage.js',
  'WomensPerfumesPage.js',
  'UnisexPerfumesPage.js',
  'UsedMobilesPage.js',
  'MobileAccessoriesPage.js',
  'TshirtButtonsPage.js',
  'PantJeansButtonsPage.js',
  'ShalwarKameezButtonsPage.js'
];

const categoryPagesDir = path.join(__dirname, 'src', 'pages', 'category');

function fixCategoryPageDesign(fileName) {
  const filePath = path.join(categoryPagesDir, fileName);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fileName}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Fix imports
  if (content.includes('ShopTopbarFilter')) {
    content = content.replace(
      /import ShopTopbarFilter from "\.\.\/\.\.\/wrappers\/product\/ShopTopbarFilter";/g,
      'import ShopSidebar from "../../wrappers/product/ShopSidebar";\nimport ShopTopbar from "../../wrappers/product/ShopTopbar";'
    );
    updated = true;
  }
  
  // Add documentToHtmlString import if not present
  if (!content.includes('documentToHtmlString')) {
    content = content.replace(
      /import ShopProducts from "\.\.\/\.\.\/wrappers\/product\/ShopProducts";/g,
      'import ShopProducts from "../../wrappers/product/ShopProducts";\nimport { documentToHtmlString } from "@contentful/rich-text-html-renderer";'
    );
    updated = true;
  }
  
  if (content.includes('DebugCategoryInfo')) {
    content = content.replace(
      /import DebugCategoryInfo from "\.\.\/\.\.\/components\/DebugCategoryInfo";/g,
      'import SimpleDebugInfo from "../../components/SimpleDebugInfo";'
    );
    updated = true;
  }
  
  // Fix state variables
  if (content.includes('selectedColors')) {
    content = content.replace(
      /const \[selectedColors, setSelectedColors\] = useState\(\[\]\);/g,
      'const [selectedColor, setSelectedColor] = useState("");'
    );
    updated = true;
  }
  
  if (content.includes('const [pageLimit] = useState(12);')) {
    content = content.replace(
      /const \[pageLimit\] = useState\(12\);/g,
      'const pageLimit = 15;'
    );
    updated = true;
  }
  
  // Fix product mapping to match MensWatchesPage structure
  if (content.includes('title: fields.title,')) {
    content = content.replace(
      /const items = entries\.items\.map\(\(item\) => \{\s*const \{ fields \} = item;\s*return \{[^}]*\};/gs,
      `const items = entries.items.map((item) => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            name: fields.name,
            slug: fields.slug,
            price: parseFloat(fields.price) || 0,
            discount: parseFloat(fields.discount) || 0,
            shortDescription: fields.shortDescription,
            fullDescription: fields.fullDescription ? documentToHtmlString(fields.fullDescription) : "",
            category: fields.category || [],
            tag: fields.tag || [],
            images: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            color: fields.color || [],
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            image: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            title: fields.name,
            description: fields.shortDescription,
            variation: fields.color && fields.color.length > 0 ?
              fields.color.map(color => ({
                color: color,
                size: fields.size ? fields.size.map(size => ({
                  name: size,
                  stock: fields.stock || 0
                })) : []
              })) : null
          };
        });`
    );
    updated = true;
  }
  
  // Fix useEffect for filtering
  if (content.includes('selectedColors.length > 0')) {
    content = content.replace(
      /useEffect\(\(\) => \{\s*let filteredProducts = sortedProducts;\s*\/\/ Filter by search term[^}]*\}, \[searchTerm, selectedColors, sortedProducts, pageLimit\]\);/gs,
      `useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply color filter
    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.color && product.color.includes(selectedColor)
      );
    }

    setSortedProducts(filtered);
    setCurrentData(filtered.slice(0, pageLimit));
  }, [products, searchTerm, selectedColor]);`
    );
    updated = true;
  }
  
  // Fix the JSX layout to match MensWatchesPage
  if (content.includes('ShopTopbarFilter')) {
    content = content.replace(
      /<div className="shop-area pt-95 pb-100">\s*<div className="container">\s*\{\/\* Debug Info - Remove this after debugging \*\/\}\s*<SimpleDebugInfo[^>]*\/>\s*<div className="row">\s*<div className="col-lg-12">\s*<ShopTopbarFilter[^>]*\/>\s*<ShopProducts[^>]*\/>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/gs,
      `<div className="shop-area pt-95 pb-100">
          <div className="container">
            {/* Debug Info - Remove this after debugging */}
            <SimpleDebugInfo 
              products={products} 
              categoryName="${getCategoryName(fileName)}" 
              loading={loading} 
            />
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                <ShopSidebar
                  products={products}
                  handleSearch={setSearchTerm}
                  handleColorFilter={setSelectedColor}
                  selectedColor={selectedColor}
                  searchTerm={searchTerm}
                  clearAllFilters={() => {
                    setSearchTerm("");
                    setSelectedColor("");
                  }}
                  sideSpaceClass="mr-30"
                  hideCategoryFilter={true}
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                <ShopTopbar
                  productCount={products.length}
                  sortedProductCount={sortedProducts.length}
                />
                <ShopProducts layout="grid three-column" products={currentData} />
              </div>
            </div>
          </div>
        </div>`
    );
    updated = true;
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Fixed design for ${fileName}`);
  } else {
    console.log(`⚠️  No changes needed for ${fileName}`);
  }
}

function getCategoryName(fileName) {
  const categoryMap = {
    'CasualWatchesPage.js': 'casualwatches',
    'SportsWatchesPage.js': 'sportswatches',
    'UnisexWatchesPage.js': 'unisexwatches',
    'WomensWatchesPage.js': 'womenwatches',
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
  
  return categoryMap[fileName] || 'unknown';
}

console.log('🔄 Fixing category pages design to match MensWatchesPage...\n');

categoryPages.forEach(fileName => {
  fixCategoryPageDesign(fileName);
});

console.log('\n✅ All category pages have been updated with proper design!');
console.log('\n📝 What was fixed:');
console.log('1. Added proper sidebar (ShopSidebar)');
console.log('2. Added proper topbar (ShopTopbar)');
console.log('3. Fixed product grid layout');
console.log('4. Updated product data structure');
console.log('5. Fixed filtering logic');
console.log('6. Added debug component');
console.log('\n🎯 Now all category pages should have the same professional design as MensWatchesPage!'); 