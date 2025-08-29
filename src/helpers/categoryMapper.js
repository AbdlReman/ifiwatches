// Category mapper to handle Contentful category values
// This maps the actual Contentful category values to the expected frontend values

export const categoryMapper = {
  // Watch categories
  'watches': ['watches', 'watch'],
  'menwatches': ['menwatches', 'mens-watches', 'men\'s watches', 'menswatches'],
  'womenwatches': ['womenwatches', 'womens-watches', 'women\'s watches', 'womenswatches'],
  'unisexwatches': ['unisexwatches', 'unisex-watches', 'unisex watches'],
  'luxurywatches': ['luxurywatches', 'luxury-watches', 'luxury watches'],
  'formalwatches': ['formalwatches', 'formal-watches', 'formal watches'],
  'casualwatches': ['casualwatches', 'casual-watches', 'casual watches'],
  'sportswatches': ['sportswatches', 'sports-watches', 'sports watches'],
  
  // Watch strap categories
  'watchstraps': ['watchstraps', 'watch-straps', 'watch straps'],
  'leatherstraps': ['leatherstraps', 'leather-straps', 'leather straps'],
  'metalstraps': ['metalstraps', 'metal-straps', 'metal straps'],
  'siliconestraps': ['siliconestraps', 'silicone-straps', 'silicone straps'],
  'nylonstraps': ['nylonstraps', 'nylon-straps', 'nylon straps'],
  'magneticstraps': ['magneticstraps', 'magnetic-straps', 'magnetic straps'],
  
  // Eyewear categories
  'eyewear': ['eyewear', 'eye-wear', 'eye wear'],
  'sunglasses': ['sunglasses', 'sunglass'],
  'opticalframes': ['opticalframes', 'optical-frames', 'optical frames'],
  
  // Accessories categories
  'ringsaccessories': ['ringsaccessories', 'rings-accessories', 'rings accessories'],
  'fashionrings': ['fashionrings', 'fashion-rings', 'fashion rings'],
  'chainsbracelets': ['chainsbracelets', 'chains-bracelets', 'chains & bracelets'],
  
  // Perfume categories
  'perfumes': ['perfumes', 'perfume'],
  'mensperfumes': ['mensperfumes', 'mens-perfumes', 'men\'s perfumes'],
  'womensperfumes': ['womensperfumes', 'womens-perfumes', 'women\'s perfumes'],
  'unisexperfumes': ['unisexperfumes', 'unisex-perfumes', 'unisex perfumes'],
  
  // Mobile categories
  'usedmobiles': ['usedmobiles', 'used-mobiles', 'used mobiles'],
  'mobileaccessories': ['mobileaccessories', 'mobile-accessories', 'mobile accessories'],
  'mobilegadgets': ['mobilegadgets', 'mobile-gadgets', 'mobile gadgets'],
  
  // Fashion categories
  'fashion': ['fashion', 'fashion-items', 'fashion items'],
  'tshirtbuttons': ['tshirtbuttons', 'tshirt-buttons', 'tshirt buttons', 'tshirt'],
  'pantjeansbuttons': ['pantjeansbuttons', 'pant-jeans-buttons', 'pant jeans buttons', 'pantjeans'],
  'shalwarkameezbuttons': ['shalwarkameezbuttons', 'shalwar-kameez-buttons', 'shalwar kameez buttons', 'shalwarkameez'],
  
  // Additional mappings for exact matches
  'tshirt': ['tshirt', 'tshirtbuttons'],
  'pantjeans': ['pantjeans', 'pantjeansbuttons'],
  'shalwarkameez': ['shalwarkameez', 'shalwarkameezbuttons'],
  
  // AA category
  'aa': ['aa', 'AA']
};

// Function to check if a product has a specific category
export const hasCategory = (product, categoryName) => {
  if (!product.category) return false;
  
  const expectedValues = categoryMapper[categoryName] || [categoryName];
  
  if (Array.isArray(product.category)) {
    return product.category.some(cat => 
      cat && typeof cat === 'string' && expectedValues.some(expected => 
        cat.toLowerCase() === expected.toLowerCase()
      )
    );
  }
  
  if (typeof product.category === 'string') {
    // Handle the case where all categories are concatenated into one string
    const categoryString = product.category.toLowerCase();
    
    // Check if it's a concatenated string (contains multiple category names)
    if (categoryString.length > 50) {
      // This is likely a concatenated string, check if our category is contained within it
      return expectedValues.some(expected => 
        categoryString.includes(expected.toLowerCase())
      );
    }
    
    // Normal case - exact match
    return expectedValues.some(expected => 
      categoryString === expected.toLowerCase()
    );
  }
  
  return false;
};

// Function to get all possible category values for a given category
export const getCategoryValues = (categoryName) => {
  return categoryMapper[categoryName] || [categoryName];
};

// Function to normalize category values (for debugging)
export const normalizeCategory = (categoryValue) => {
  for (const [key, values] of Object.entries(categoryMapper)) {
    if (values.some(val => val.toLowerCase() === categoryValue.toLowerCase())) {
      return key;
    }
  }
  return categoryValue;
}; 