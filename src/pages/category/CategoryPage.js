import React, { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ChildCategoryButtons from "../../components/category/ChildCategoryButtons";
import client from "../../data/contentful";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const CategoryPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [offset] = useState(0);
  const pageLimit = 15;

  // Extract category and subcategory from URL
  const pathSegments = location.pathname.split('/').filter(segment => segment);
  const category = pathSegments[1]; // First segment after domain
  const subcategory = pathSegments[2]; // Second segment if exists

  // Category mapping for display names
  const categoryNames = {
    watches: "Watches",
    "watch-straps": "Watch Straps",
    eyewear: "Eyewear",
    "rings-accessories": "Rings & Accessories",
    perfumes: "Perfumes",
    "mobile-gadgets": "Mobile Gadgets",
    "fashion-buttons": "Fashion Buttons"
  };

  const subcategoryNames = {
    // Watches
    mens: "Men's Watches",
    womens: "Women's Watches",
    unisex: "Unisex Watches",
    luxury: "Luxury Collection",
    formal: "Formal Watches",
    casual: "Casual Watches",
    sports: "Sports & Digital Watches",
    
    // Watch Straps
    leather: "Leather Straps",
    metal: "Metal/Chain Straps",
    silicone: "Silicone/Rubber Straps",
    nylon: "Nylon/Fabric Straps",
    magnetic: "Magnetic/Loop Straps",
    
    // Eyewear
    sunglasses: "Sunglasses",
    optical: "Optical Frames",
    
    // Rings & Accessories
    "fashion-rings": "Fashion Rings",
    "chains-bracelets": "Chains & Bracelets",
    
    // Perfumes
    "mens": "Men's Fragrances",
    "womens": "Women's Fragrances",
    "unisex": "Unisex Scents",
    
    // Mobile Gadgets
    "used-mobiles": "Trusted Used Mobiles",
    accessories: "Mobile Accessories",
    
    // Fashion Buttons
    tshirt: "T-Shirt",
    "pant-jeans": "Pant/Jeans",
    "shalwar-kameez": "Shalwar Kameez Fabric"
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ content_type: "product" });
        const items = entries.items.map((item) => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            name: fields.name,
            slug: fields.slug,
            price: parseFloat(fields.price) || 0,
            discount: parseFloat(fields.discount) || 0,
            shortDescription: fields.shortDescription,
            fullDescription: fields.fullDescription ? documentToHtmlString(fields.fullDescription) : "",
            category: fields.category || [],
            subcategory: fields.subcategory || [],
            tag: fields.tag || [],
            images: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            color: fields.color || [],
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            image: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            title: fields.name,
            description: fields.shortDescription,
            variation: fields.color && fields.color.length > 0 ?
              fields.color.map(color => ({
                color: color,
                size: fields.size ? fields.size.map(size => ({
                  name: size,
                  stock: fields.stock || 0
                })) : []
              })) : null
          };
        });

        // Filter products based on category and subcategory
        let filteredProducts = items;
        
        if (category) {
          filteredProducts = filteredProducts.filter(product => 
            product.category && product.category.includes(category)
          );
        }
        
        if (subcategory) {
          filteredProducts = filteredProducts.filter(product => 
            product.subcategory && product.subcategory.includes(subcategory)
          );
        }

        setProducts(filteredProducts);
        setSortedProducts(filteredProducts);
        setCurrentData(filteredProducts.slice(0, pageLimit));
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, subcategory]);

  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply color filter
    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.color && product.color.includes(selectedColor)
      );
    }

    setSortedProducts(filtered);
    setCurrentData(filtered.slice(0, pageLimit));
  }, [products, searchTerm, selectedColor]);

  // Generate page title and description
  const getPageTitle = () => {
    if (subcategory && subcategoryNames[subcategory]) {
      return `${subcategoryNames[subcategory]} - ${categoryNames[category] || category}`;
    }
    return categoryNames[category] || category;
  };

  const getPageDescription = () => {
          if (subcategory && subcategoryNames[subcategory]) {
        return `Shop ${subcategoryNames[subcategory].toLowerCase()} at IFILifestyle. Quality products with competitive prices.`;
      }
      return `Shop ${categoryNames[category]?.toLowerCase() || category} at IFILifestyle. Quality products with competitive prices.`;
  };

  // Generate breadcrumb
  const getBreadcrumb = () => {
    const breadcrumb = [
      { label: "Home", path: process.env.PUBLIC_URL + "/" }
    ];
    
    if (category && categoryNames[category]) {
      breadcrumb.push({ 
        label: categoryNames[category], 
        path: process.env.PUBLIC_URL + `/${category}` 
      });
    }
    
    if (subcategory && subcategoryNames[subcategory]) {
      breadcrumb.push({ 
        label: subcategoryNames[subcategory], 
        path: location.pathname 
      });
    }
    
    return breadcrumb;
  };

  if (loading) {
    return (
      <div className="shop-area pt-95 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO 
        titleTemplate={`${getPageTitle()} - IFILifestyle`} 
        description={getPageDescription()} 
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb pages={getBreadcrumb()} />
        
        {/* Show Child Category Buttons only on parent category pages (not subcategory pages) */}
        {!subcategory && (
          <ChildCategoryButtons parentCategory={category} />
        )}
        
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                <ShopSidebar
                  products={products}
                  handleSearch={setSearchTerm}
                  handleColorFilter={setSelectedColor}
                  selectedColor={selectedColor}
                  searchTerm={searchTerm}
                  clearAllFilters={() => {
                    setSearchTerm("");
                    setSelectedColor("");
                  }}
                  sideSpaceClass="mr-30"
                  hideCategoryFilter={true}
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                <ShopTopbar
                  productCount={products.length}
                  sortedProductCount={sortedProducts.length}
                />
                <ShopProducts layout="grid three-column" products={currentData} />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default CategoryPage; 