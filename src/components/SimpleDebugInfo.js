import React from 'react';

const SimpleDebugInfo = ({ products, categoryName, loading }) => {
  if (loading) {
    return (
      <div style={{ 
        background: '#f0f0f0', 
        padding: '10px', 
        margin: '10px 0', 
        border: '1px solid #ccc',
        fontSize: '12px'
      }}>
        <strong>Debug Info:</strong> Loading products...
      </div>
    );
  }

  // Simple category checking without external imports
  const hasCategory = (product, categoryName) => {
    if (!product.category) return false;
    
    // Handle array of categories
    if (Array.isArray(product.category)) {
      return product.category.some(cat => 
        cat && typeof cat === 'string' && cat.toLowerCase() === categoryName.toLowerCase()
      );
    }
    
    // Handle string category
    if (typeof product.category === 'string') {
      const categoryString = product.category.toLowerCase();
      
      // Check if it's a concatenated string (contains multiple category names)
      if (categoryString.length > 50) {
        // This is likely a concatenated string, check if our category is contained within it
        return categoryString.includes(categoryName.toLowerCase());
      }
      
      // Normal case - exact match
      return categoryString === categoryName.toLowerCase();
    }
    
    return false;
  };

  const productsWithCategory = products.filter(product => 
    hasCategory(product, categoryName)
  );

  const allCategories = new Set();
  const problematicProducts = [];
  
  products.forEach(product => {
    if (product.category) {
      if (Array.isArray(product.category)) {
        product.category.forEach(cat => allCategories.add(cat));
      } else if (typeof product.category === 'string') {
        allCategories.add(product.category);
        
        // Check for concatenated category strings
        if (product.category.length > 50) {
          problematicProducts.push({
            name: product.title || product.name || 'Unknown Product',
            id: product.id,
            category: product.category,
            length: product.category.length
          });
        }
      }
    }
  });

  return (
    <div style={{ 
      background: '#f0f0f0', 
      padding: '15px', 
      margin: '10px 0', 
      border: '1px solid #ccc',
      fontSize: '12px',
      fontFamily: 'monospace'
    }}>
      <strong>Debug Info for Category: {categoryName}</strong><br />
      Total products fetched: {products.length}<br />
      Products matching category "{categoryName}": {productsWithCategory.length}<br />
      <br />
      <strong>All categories found:</strong><br />
      {Array.from(allCategories).sort().map(cat => (
        <span key={cat} style={{ 
          marginRight: '10px', 
          padding: '2px 6px', 
          background: cat === categoryName ? '#4CAF50' : '#ddd',
          color: cat === categoryName ? 'white' : 'black',
          borderRadius: '3px'
        }}>
          {cat}
        </span>
      ))}
      <br /><br />
      {problematicProducts.length > 0 && (
        <>
          <br />
          <strong style={{ color: 'red' }}>⚠️ PROBLEMATIC PRODUCTS (Concatenated Categories):</strong><br />
          {problematicProducts.map(product => (
            <div key={product.id} style={{ marginLeft: '10px', color: 'red' }}>
              • {product.name} (ID: {product.id}) - Category length: {product.length} chars
              <br />
              <span style={{ fontSize: '10px', color: '#666' }}>
                Category: "{product.category}"
              </span>
            </div>
          ))}
          <br />
          <span style={{ color: 'red', fontSize: '11px' }}>
            ⚠️ These products have concatenated category values. They will appear in ALL categories!
            <br />
            Please fix the category field in Contentful for these products.
          </span>
        </>
      )}
      
      <br />
      <strong>Products with matching category:</strong><br />
      {productsWithCategory.length > 0 ? (
        productsWithCategory.map(product => (
          <div key={product.id} style={{ marginLeft: '10px' }}>
            • {product.name || product.title} (ID: {product.id})
          </div>
        ))
      ) : (
        <span style={{ color: 'red' }}>No products found with category "{categoryName}"</span>
      )}
    </div>
  );
};

export default SimpleDebugInfo; 