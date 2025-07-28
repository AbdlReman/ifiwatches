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
      if (!product.category) return false;
      if (Array.isArray(product.category)) {
        return product.category.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        );
      }
      return product.category.toLowerCase() === category.toLowerCase();
    }).length;
  };

  const getColorProductCount = (color) => {
    if (!products || !color) return 0;
    return products.filter(product => 
      product.color && product.color.includes(color)
    ).length;
  };

  const getSearchProductCount = (term) => {
    if (!products || !term) return 0;
    return products.filter(product => {
      const nameMatch = product.name.toLowerCase().includes(term.toLowerCase());
      const descMatch = product.shortDescription?.toLowerCase().includes(term.toLowerCase());
      return nameMatch || descMatch;
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