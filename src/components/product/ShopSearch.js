

import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";

const ShopSearch = ({ handleSearch, searchTerm }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm || "");
  const searchTimeoutRef = useRef(null);

  // Sync local search term with prop
  useEffect(() => {
    setLocalSearchTerm(searchTerm || "");
  }, [searchTerm]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Search submitted:", localSearchTerm);
    handleSearch(localSearchTerm);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    console.log("Search input changed:", value);
    
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Debounce search to avoid too many calls
    searchTimeoutRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  return (
    <div className="sidebar-widget">
      <h4 className="pro-sidebar-title">Search </h4>
      <div className="pro-sidebar-search mb-50 mt-25">
        <form className="pro-sidebar-search-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Search here..." 
            value={localSearchTerm}
            onChange={handleInputChange}
          />
          <button type="submit">
            <i className="pe-7s-search" />
          </button>
        </form>
      </div>
    </div>
  );
};

ShopSearch.propTypes = {
  handleSearch: PropTypes.func,
  searchTerm: PropTypes.string
};

export default ShopSearch;
