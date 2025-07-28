import PropTypes from "prop-types";
import { setActiveSort } from "../../helpers/product";
import "../../assets/css/filter-message.css";

const ShopCategories = ({ categories, handleCategoryFilter, selectedCategory, products }) => {
  console.log("ShopCategories render:", { categories, selectedCategory });
  
  const handleCategoryClick = (category) => {
    console.log("Category clicked:", category);
    handleCategoryFilter(category);
  };

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

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Categories </h4>
      <div className="sidebar-widget-list mt-30">
        {categories ? (
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
            {categories.map((category, key) => {
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
        ) : (
          "No categories found"
        )}
      </div>
    </div>
  );
};

ShopCategories.propTypes = {
  categories: PropTypes.array,
  handleCategoryFilter: PropTypes.func,
  selectedCategory: PropTypes.string,
  products: PropTypes.array
};

export default ShopCategories;
