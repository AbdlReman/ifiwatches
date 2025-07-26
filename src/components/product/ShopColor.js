import PropTypes from "prop-types";

import { setActiveSort } from "../../helpers/product";

const ShopColor = ({ colors, handleColorFilter, selectedColor }) => {
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
                </button>
              </div>
            </li>
            {colors.map((color, key) => {
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
  selectedColor: PropTypes.string
};

export default ShopColor;
