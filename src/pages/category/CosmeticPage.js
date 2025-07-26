import { Fragment, useState, useEffect } from "react";
import Paginator from "react-hooks-paginator";
import { getSortedProducts } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const CosmeticPage = () => {
  const [layout, setLayout] = useState("grid three-column");
  const [sortType, setSortType] = useState("");
  const [sortValue, setSortValue] = useState("");
  const [filterSortType, setFilterSortType] = useState("");
  const [filterSortValue, setFilterSortValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [offset, setOffset] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentData, setCurrentData] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageLimit = 15;

  const getLayout = (layout) => setLayout(layout);
  const getSortParams = (type, value) => {
    setSortType(type);
    setSortValue(value);
  };
  const getFilterSortParams = (type, value) => {
    setFilterSortType(type);
    setFilterSortValue(value);
  };
  
  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    setOffset(0);
    setCurrentPage(1);
  };
  
  // Handle color filter
  const handleColorFilter = (color) => {
    setSelectedColor(color);
    setOffset(0);
    setCurrentPage(1);
  };
  
  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedColor("");
    setSortType("");
    setSortValue("");
    setFilterSortType("");
    setFilterSortValue("");
    setOffset(0);
    setCurrentPage(1);
  };

  // Fetch products from Contentful on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ content_type: "product" });
        
        const items = entries.items.map((item) => {
          const fields = item.fields;
          
          // Handle category field - it might be a string, array, or object
          let categoryArray = [];
          if (fields.category) {
            if (Array.isArray(fields.category)) {
              categoryArray = fields.category;
            } else if (typeof fields.category === 'string') {
              categoryArray = [fields.category];
            } else if (fields.category.fields) {
              // If it's a Contentful reference
              categoryArray = [fields.category.fields.name || fields.category.fields.title];
            }
          }
          
          // Handle color field - it might be a string, array, or object
          let colorArray = [];
          if (fields.color) {
            if (Array.isArray(fields.color)) {
              colorArray = fields.color;
            } else if (typeof fields.color === 'string') {
              colorArray = [fields.color];
            } else if (fields.color.fields) {
              // If it's a Contentful reference
              colorArray = [fields.color.fields.name || fields.color.fields.title];
            }
          }
          
          return {
            id: item.sys.id,
            name: fields.name,
            slug: fields.slug,
            price: parseFloat(fields.price) || 0,
            discount: parseFloat(fields.discount) || 0,
            shortDescription: fields.shortDescription,
            fullDescription: fields.fullDescription ? documentToHtmlString(fields.fullDescription) : "",
            category: categoryArray,
            tag: fields.tag || [],
            images: fields.images?.map((img) => img.fields.file.url) || [],
            color: colorArray,
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            // For backward compatibility
            image: fields.images?.map((img) => img.fields.file.url) || [],
            title: fields.name,
            description: fields.shortDescription,
            // Add variation structure if colors/sizes exist
            variation: colorArray.length > 0 ? 
              colorArray.map(color => ({
                color: color,
                size: fields.size ? fields.size.map(size => ({
                  name: size,
                  stock: fields.stock || 0
                })) : []
              })) : null
          };
        });
        
        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Sort + paginate when data or filters change
  useEffect(() => {
    let filtered = [...products];
    
    // Filter by cosmetic category
    filtered = filtered.filter(product =>
      product.category && 
      (Array.isArray(product.category) ? 
        product.category.includes('cosmetic') : 
        product.category === 'cosmetic')
    );
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = product.shortDescription?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch || descMatch;
      });
    }
    
    // Apply color filter
    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.color && product.color.includes(selectedColor)
      );
    }
    
    // Apply sorting
    let sorted = getSortedProducts(filtered, sortType, sortValue);
    sorted = getSortedProducts(sorted, filterSortType, filterSortValue);
    setSortedProducts(sorted);
    setCurrentData(sorted.slice(offset, offset + pageLimit));
  }, [products, offset, sortType, sortValue, filterSortType, filterSortValue, searchTerm, selectedColor]);

  if (loading) {
    return (
      <div className="shop-area pt-95 pb-100">
        <div className="container">
          <div className="text-center">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO 
                titleTemplate="Cosmetics - Lanina"
        description="Shop premium cosmetics at Lanina. Quality beauty products with excellent service and reliability. Visit https://www.lanina.pk/" 
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Cosmetics", path: process.env.PUBLIC_URL + "/cosmetic" },
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            {products.length === 0 ? (
              <div className="text-center">
                <p>No products found. Please check your Contentful configuration.</p>
              </div>
            ) : (
              <div className="row">
                <div className="col-lg-3 order-2 order-lg-1">
                  <ShopSidebar
                    products={products}
                    getSortParams={getSortParams}
                    handleSearch={handleSearch}
                    handleColorFilter={handleColorFilter}
                    selectedColor={selectedColor}
                    searchTerm={searchTerm}
                    clearAllFilters={clearAllFilters}
                    sideSpaceClass="mr-30"
                    hideCategoryFilter={true}
                  />
                </div>
                <div className="col-lg-9 order-1 order-lg-2">
                  <ShopTopbar
                    getLayout={getLayout}
                    getFilterSortParams={getFilterSortParams}
                    productCount={products.length}
                    sortedProductCount={sortedProducts.length}
                  />
                  
                  {/* Category Header */}
                  <div className="category-header mb-4">
                    <div className="row">
                      <div className="col-12">
                        <h1 className="category-title">Cosmetics</h1>
                        <p className="category-description">
                          Discover our premium collection of cosmetics. 
                          Quality beauty products with excellent service.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Search Results Summary */}
                  {(searchTerm || selectedColor) && (
                    <div className="search-results-summary mb-4">
                      <div className="row">
                        <div className="col-12">
                          <div className="alert alert-info">
                            <strong>Filtered Results:</strong> {sortedProducts.length} products found
                            {searchTerm && (
                              <span className="ml-2">
                                <strong>Search:</strong> "{searchTerm}"
                              </span>
                            )}
                            {selectedColor && (
                              <span className="ml-2">
                                <strong>Color:</strong> {selectedColor}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <ShopProducts layout={layout} products={currentData} />
                  <div className="pro-pagination-style text-center mt-30">
                    <Paginator
                      totalRecords={sortedProducts.length}
                      pageLimit={pageLimit}
                      pageNeighbours={2}
                      setOffset={setOffset}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      pageContainerClass="mb-0 mt-0"
                      pagePrevText="«"
                      pageNextText="»"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default CosmeticPage; 