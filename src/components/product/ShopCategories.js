import PropTypes from "prop-types";

import { setActiveSort } from "../../helpers/product";

const ShopCategories = ({ categories, handleCategoryFilter, selectedCategory }) => {
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
                    handleCategoryFilter("");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Categories
                </button>
              </div>
            </li>
            {categories.map((category, key) => {
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      className={selectedCategory === category ? "active" : ""}
                      onClick={e => {
                        handleCategoryFilter(category);
                        setActiveSort(e);
                      }}
                    >
                      {" "}
                      <span className="checkmark" /> {category}{" "}
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
  selectedCategory: PropTypes.string
};

export default ShopCategories;
