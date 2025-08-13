import React from 'react';
import PropTypes from 'prop-types';
import '../../assets/css/filter-message.css';

const FilterMessage = ({ 
  selectedCategory, 
  selectedColor, 
  searchTerm, 
  totalProducts, 
  filteredProducts,
  products 
}) => {
  if (!selectedCategory && !selectedColor && !searchTerm) {
    return null;
  }

  const getCategoryProductCount = (category) => {
    if (!products || !category) return 0;
    return products.filter(product => {
      if (!product.category || !Array.isArray(product.category)) return false;
      
      // Use the same filtering logic as ShopGridStandard.js
      switch (category) {
        case "Watches":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('watches') || 
                   cat.toLowerCase().includes('watch') ||
                   cat.toLowerCase().includes('timepiece') ||
                   cat.toLowerCase().includes('chronograph'))
          );
        
        case "Watch Straps":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('straps') || 
                   cat.toLowerCase().includes('strap') ||
                   cat.toLowerCase().includes('band') ||
                   cat.toLowerCase().includes('bracelet'))
          );
        
        case "Perfumes":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('perfume') || 
                   cat.toLowerCase().includes('fragrance') ||
                   cat.toLowerCase().includes('cologne') ||
                   cat.toLowerCase().includes('scent'))
          );
        
        case "Eyewear":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('eyewear') || 
                   cat.toLowerCase().includes('sunglasses') || 
                   cat.toLowerCase().includes('optical') ||
                   cat.toLowerCase().includes('glasses') ||
                   cat.toLowerCase().includes('lens'))
          );
        
        case "Rings & Accessories":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('rings') || 
                   cat.toLowerCase().includes('accessories') || 
                   cat.toLowerCase().includes('bracelets') || 
                   cat.toLowerCase().includes('chains') ||
                   cat.toLowerCase().includes('necklace') ||
                   cat.toLowerCase().includes('earrings') ||
                   cat.toLowerCase().includes('jewelry'))
          );
        
        case "Mobile Gadgets":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('mobile') || 
                   cat.toLowerCase().includes('gadgets') || 
                   cat.toLowerCase().includes('phones') ||
                   cat.toLowerCase().includes('smartphone') ||
                   cat.toLowerCase().includes('electronics'))
          );
        
        case "Fashion":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('fashion') || 
                   cat.toLowerCase().includes('clothing') || 
                   cat.toLowerCase().includes('tshirt') || 
                   cat.toLowerCase().includes('pant') || 
                   cat.toLowerCase().includes('jeans') || 
                   cat.toLowerCase().includes('shalwar') || 
                   cat.toLowerCase().includes('kameez') ||
                   cat.toLowerCase().includes('dress') ||
                   cat.toLowerCase().includes('shirt') ||
                   cat.toLowerCase().includes('trouser'))
          );
        
        default:
          // Try exact match for specific categories
          return product.category.some(cat => 
            cat && cat.toLowerCase() === category.toLowerCase()
          );
      }
    }).length;
  };

  const getColorProductCount = (color) => {
    if (!products || !color) return 0;
    return products.filter(product => {
      if (!product.color || !Array.isArray(product.color)) return false;
      return product.color.some(c => 
        c && c.toLowerCase() === color.toLowerCase()
      );
    }).length;
  };

  const getSearchProductCount = (term) => {
    if (!products || !term) return 0;
    return products.filter(product => {
      const nameMatch = product.name && product.name.toLowerCase().includes(term.toLowerCase());
      const descMatch = product.shortDescription && product.shortDescription.toLowerCase().includes(term.toLowerCase());
      const categoryMatch = product.category && product.category.some(cat => 
        cat && cat.toLowerCase().includes(term.toLowerCase())
      );
      return nameMatch || descMatch || categoryMatch;
    }).length;
  };

  const renderFilterMessage = () => {
    const messages = [];

    if (selectedCategory) {
      const categoryCount = getCategoryProductCount(selectedCategory);
      messages.push(
        <span key="category" className="filter-message-item">
          <strong>{categoryCount}</strong> product{categoryCount !== 1 ? 's' : ''} in category "<strong>{selectedCategory}</strong>"
        </span>
      );
    }

    if (selectedColor) {
      const colorCount = getColorProductCount(selectedColor);
      messages.push(
        <span key="color" className="filter-message-item">
          <strong>{colorCount}</strong> product{colorCount !== 1 ? 's' : ''} with color "<strong>{selectedColor}</strong>"
        </span>
      );
    }

    if (searchTerm) {
      const searchCount = getSearchProductCount(searchTerm);
      messages.push(
        <span key="search" className="filter-message-item">
          <strong>{searchCount}</strong> product{searchCount !== 1 ? 's' : ''} matching "<strong>{searchTerm}</strong>"
        </span>
      );
    }

    return messages;
  };

  return (
    <div className="filter-message-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <span style={{ fontWeight: 'bold', marginRight: '10px' }}>Filters Applied:</span>
          {renderFilterMessage().map((message, index) => (
            <React.Fragment key={index}>
              {message}
              {index < renderFilterMessage().length - 1 && (
                <span style={{ margin: '0 8px', color: '#6c757d' }}>•</span>
              )}
            </React.Fragment>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#6c757d' }}>
          Showing {filteredProducts} of {totalProducts} products
        </div>
      </div>
    </div>
  );
};

FilterMessage.propTypes = {
  selectedCategory: PropTypes.string,
  selectedColor: PropTypes.string,
  searchTerm: PropTypes.string,
  totalProducts: PropTypes.number,
  filteredProducts: PropTypes.number,
  products: PropTypes.array
};

export default FilterMessage; 