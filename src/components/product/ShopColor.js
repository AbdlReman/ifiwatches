import PropTypes from "prop-types";
import { setActiveSort } from "../../helpers/product";
import "../../assets/css/filter-message.css";

const ShopColor = ({ colors, handleColorFilter, selectedColor, products }) => {
  const getColorProductCount = (color) => {
    if (!products || !color) return 0;
    return products.filter(product => 
      product.color && product.color.includes(color)
    ).length;
  };

  return (
    <div className="sidebar-widget mt-50">
      <h4 className="pro-sidebar-title">Color </h4>
      <div className="sidebar-widget-list mt-20">
        {colors ? (
          <ul>
            <li>
              <div className="sidebar-widget-list-left">
                <button
                  className={selectedColor === "" ? "active" : ""}
                  onClick={e => {
                    handleColorFilter("");
                    setActiveSort(e);
                  }}
                >
                  <span className="checkmark" /> All Colors{" "}
                  <span className="color-count">
                    ({products?.length || 0})
                  </span>
                </button>
              </div>
            </li>
            {colors.map((color, key) => {
              const colorCount = getColorProductCount(color);
              return (
                <li key={key}>
                  <div className="sidebar-widget-list-left">
                    <button
                      className={selectedColor === color ? "active" : ""}
                      onClick={e => {
                        handleColorFilter(color);
                        setActiveSort(e);
                      }}
                    >
                      <span className="checkmark" /> {color}{" "}
                      <span className="color-count">
                        ({colorCount})
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          "No colors found"
        )}
      </div>
    </div>
  );
};

ShopColor.propTypes = {
  colors: PropTypes.array,
  handleColorFilter: PropTypes.func,
  selectedColor: PropTypes.string,
  products: PropTypes.array
};

export default ShopColor;
