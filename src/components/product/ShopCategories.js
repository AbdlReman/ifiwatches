import PropTypes from "prop-types";
import { setActiveSort } from "../../helpers/product";
import "../../assets/css/filter-message.css";

const ShopCategories = ({ categories, handleCategoryFilter, selectedCategory, products, pageType }) => {
  console.log("ShopCategories render:", { categories, selectedCategory, pageType });
  
  // Define parent categories based on page type
  const getParentCategories = () => {
    if (pageType === "top-categories") {
      return ["Watches", "Watch Straps", "Perfumes"];
    } else if (pageType === "categories") {
      return ["Eyewear", "Rings & Accessories", "Mobile Gadgets", "Fashion"];
    } else {
      // Default: show all parent categories (for shop page)
      return [
        "Watches",
        "Watch Straps", 
        "Perfumes",
        "Eyewear",
        "Rings & Accessories",
        "Mobile Gadgets",
        "Fashion"
      ];
    }
  };

  const parentCategories = getParentCategories();

  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    handleCategoryFilter(category);
  };

  const getCategoryProductCount = (parentCategory) => {
    if (!products || !parentCategory) return 0;
    
    return products.filter(product => {
      if (!product.category || !Array.isArray(product.category)) return false;
      
      const categoryLower = parentCategory.toLowerCase();
      
      switch (parentCategory) {
        case "Watches":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('watches') || cat.toLowerCase().includes('watch'))
          );
        
        case "Watch Straps":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('straps') || cat.toLowerCase().includes('strap'))
          );
        
        case "Perfumes":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('perfume') || cat.toLowerCase().includes('fragrance'))
          );
        
        case "Eyewear":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('eyewear') || 
                   cat.toLowerCase().includes('sunglasses') || 
                   cat.toLowerCase().includes('optical'))
          );
        
        case "Rings & Accessories":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('rings') || 
                   cat.toLowerCase().includes('accessories') || 
                   cat.toLowerCase().includes('bracelets') || 
                   cat.toLowerCase().includes('chains'))
          );
        
        case "Mobile Gadgets":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('mobile') || 
                   cat.toLowerCase().includes('gadgets') || 
                   cat.toLowerCase().includes('phones'))
          );
        
        case "Fashion":
          return product.category.some(cat => 
            cat && (cat.toLowerCase().includes('fashion') || 
                   cat.toLowerCase().includes('clothing') || 
                   cat.toLowerCase().includes('tshirt') || 
                   cat.toLowerCase().includes('pant') || 
                   cat.toLowerCase().includes('jeans') || 
                   cat.toLowerCase().includes('shalwar') || 
                   cat.toLowerCase().includes('kameez'))
          );
        
        default:
          return false;
      }
    }).length;
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories </h4>
      <div className="sidebar-widget-list mt-30">
        <ul>
          <li>
            <div className="sidebar-widget-list-left">
              <button
                className={selectedCategory === "" ? "active" : ""}
                onClick={e => {
                  handleCategoryClick("");
                  setActiveSort(e);
                }}
              >
                <span className="checkmark" /> All Categories
                <span className="category-count">
                  ({products?.length || 0})
                </span>
              </button>
            </div>
          </li>
          {parentCategories.map((category, key) => {
            const categoryCount = getCategoryProductCount(category);
            return (
              <li key={key}>
                <div className="sidebar-widget-list-left">
                  <button
                    className={selectedCategory === category ? "active" : ""}
                    onClick={e => {
                      handleCategoryClick(category);
                      setActiveSort(e);
                    }}
                  >
                    {" "}
                    <span className="checkmark" /> {category}{" "}
                    <span className="category-count">
                      ({categoryCount})
                    </span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  handleCategoryFilter: PropTypes.func,
  selectedCategory: PropTypes.string,
  products: PropTypes.array,
  pageType: PropTypes.string
};

export default ShopCategories;
