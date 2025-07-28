# Category Pages Debug Guide

## Issue Summary
Some category pages are not showing products even though the pages exist and routes are configured correctly.

## Analysis Results

### ✅ What's Working Correctly:
1. **All category pages exist** in `src/pages/category/`
2. **All routes are properly configured** in `src/App.js`
3. **Category filtering logic is consistent** across all pages
4. **Navigation menu is properly structured** in `src/components/header/NavMenu.js`

### 🔍 Potential Issues:

#### 1. Contentful Data Mismatch
The most likely issue is that the category values in your Contentful products don't match exactly with what the frontend is looking for.

**Expected category values:**
- `menwatches`
- `womenwatches`
- `unisexwatches`
- `luxurywatches`
- `formalwatches`
- `casualwatches`
- `sportswatches`
- `leatherstraps`
- `metalstraps`
- `siliconestraps`
- `nylonstraps`
- `magneticstraps`
- `sunglasses`
- `opticalframes`
- `fashionrings`
- `chainsbracelets`
- `mensperfumes`
- `womensperfumes`
- `unisexperfumes`
- `usedmobiles`
- `mobileaccessories`
- `tshirt`
- `pantjeans`
- `shalwarkameez`

#### 2. Case Sensitivity Issues
Category values might have different casing (e.g., "MenWatches" vs "menwatches")

#### 3. Data Structure Issues
The category field in Contentful might be structured differently than expected (string vs array vs reference)

## Debugging Steps

### Step 1: Use the Debug Component
I've added a debug component to `MensWatchesPage.js` as an example. You can add it to any category page:

```jsx
import DebugCategoryInfo from "../../components/DebugCategoryInfo";

// Add this in your component's return statement:
<DebugCategoryInfo 
  products={products} 
  categoryName="your-category-name" 
  loading={loading} 
/>
```

### Step 2: Run the Debug Script
Use the debug script I created (`debug-categories.js`) to check all products and their categories:

```bash
node debug-categories.js
```

### Step 3: Check Browser Console
Open your browser's developer tools and run this in the console while on a category page:

```javascript
// Check if products are being fetched
console.log('Products:', window.products);

// Check React component state
// Use React DevTools to inspect the component state
```

### Step 4: Verify Contentful Data
1. Go to your Contentful dashboard
2. Check a few products and verify their category field values
3. Make sure they match exactly with the expected values above

## Common Solutions

### Solution 1: Fix Category Values in Contentful
If the category values in Contentful don't match, update them to match exactly:

**Wrong:** "Men's Watches", "mens-watches", "MenWatches"
**Correct:** "menwatches"

### Solution 2: Update Frontend to Match Contentful
If you prefer to keep your Contentful values, update the frontend category pages to match:

```javascript
// In MensWatchesPage.js, change this:
product.category && product.category.includes("menwatches")

// To match your Contentful value:
product.category && product.category.includes("Men's Watches")
```

### Solution 3: Handle Case Insensitivity
Update the category filtering to be case-insensitive:

```javascript
product.category && product.category.some(cat => 
  cat.toLowerCase() === "menwatches".toLowerCase()
)
```

### Solution 4: Handle Multiple Category Formats
Update the filtering to handle different category formats:

```javascript
const hasCategory = (product, categoryName) => {
  if (!product.category) return false;
  
  if (Array.isArray(product.category)) {
    return product.category.some(cat => 
      cat.toLowerCase() === categoryName.toLowerCase()
    );
  }
  
  if (typeof product.category === 'string') {
    return product.category.toLowerCase() === categoryName.toLowerCase();
  }
  
  return false;
};

// Then use it like:
const mensWatchesProducts = items.filter(product => 
  hasCategory(product, "menwatches")
);
```

## Quick Test

To quickly test if the issue is with category values, temporarily modify a category page to show ALL products:

```javascript
// In any category page, change this:
const mensWatchesProducts = items.filter(product => 
  product.category && product.category.includes("menwatches")
);

// To this (temporarily):
const mensWatchesProducts = items; // Show all products
```

If you see products when showing all products, then the issue is definitely with the category filtering.

## Next Steps

1. **Add the debug component** to a few category pages that aren't working
2. **Run the debug script** to see what category values exist in Contentful
3. **Check the browser console** for any errors
4. **Verify Contentful data** matches the expected values
5. **Apply the appropriate solution** based on what you find

## Files Created/Modified

- ✅ `debug-categories.js` - Node.js debug script
- ✅ `debug-categories-browser.js` - Browser console debug script  
- ✅ `src/components/DebugCategoryInfo.js` - Debug component
- ✅ `src/pages/category/MensWatchesPage.js` - Added debug component example

Let me know what you find when you run these debugging steps! 