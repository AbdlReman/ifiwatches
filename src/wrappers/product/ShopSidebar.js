import PropTypes from "prop-types";
import clsx from "clsx";
import {
  getIndividualCategories,
  getIndividualTags,
  getIndividualColors,
  getProductsIndividualSizes
} from "../../helpers/product";
import ShopSearch from "../../components/product/ShopSearch";
import ShopCategories from "../../components/product/ShopCategories";
import ShopColor from "../../components/product/ShopColor";

const ShopSidebar = ({ 
  products, 
  getSortParams, 
  handleSearch, 
  handleCategoryFilter, 
  handleColorFilter, 
  selectedCategory, 
  selectedColor, 
  searchTerm, 
  clearAllFilters,
  sideSpaceClass,
  hideCategoryFilter = false,
  pageType = "shop"
}) => {
  const uniqueCategories = getIndividualCategories(products);
  const uniqueColors = getIndividualColors(products);
  
  // Debug: Log categories and colors
  console.log("ShopSidebar render:", {
    productsCount: products?.length || 0,
    uniqueCategories,
    uniqueColors,
    selectedCategory,
    selectedColor,
    searchTerm,
    hasHandleCategoryFilter: !!handleCategoryFilter,
    pageType
  });

  return (
    <div className={clsx("sidebar-style", sideSpaceClass)}>
      {/* shop search */}
      <ShopSearch 
        handleSearch={handleSearch}
        searchTerm={searchTerm}
      />

      {/* filter by categories */}
      {!hideCategoryFilter && (
        <ShopCategories
          categories={uniqueCategories}
          handleCategoryFilter={handleCategoryFilter}
          selectedCategory={selectedCategory}
          products={products}
          pageType={pageType}
        />
      )}

      {/* filter by color */}
      <ShopColor 
        colors={uniqueColors} 
        handleColorFilter={handleColorFilter}
        selectedColor={selectedColor}
        products={products}
      />
      
      {/* Clear filters button */}
      {(searchTerm || selectedCategory || selectedColor) && (
        <div className="sidebar-widget mt-50">
          <button 
            onClick={clearAllFilters}
            className="btn btn-primary w-100"
            style={{ padding: '10px', fontSize: '14px' }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

ShopSidebar.propTypes = {
  getSortParams: PropTypes.func,
  handleSearch: PropTypes.func,
  handleCategoryFilter: PropTypes.func,
  handleColorFilter: PropTypes.func,
  selectedCategory: PropTypes.string,
  selectedColor: PropTypes.string,
  searchTerm: PropTypes.string,
  clearAllFilters: PropTypes.func,
  products: PropTypes.array,
  sideSpaceClass: PropTypes.string,
  hideCategoryFilter: PropTypes.bool,
  pageType: PropTypes.string
};

export default ShopSidebar;
