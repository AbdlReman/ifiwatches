const fs = require('fs');
const path = require('path');

// Category and subcategory mapping
const categories = {
  watches: {
    name: "Watches",
    category: "watches",
    subcategories: {
      mens: { name: "Men's Watches", category: "menwatches" },
      womens: { name: "Women's Watches", category: "womenwatches" },
      unisex: { name: "Unisex Watches", category: "unisexwatches" },
      luxury: { name: "Luxury Collection", category: "luxurywatches" },
      formal: { name: "Formal Watches", category: "formalwatches" },
      casual: { name: "Casual Watches", category: "casualwatches" },
      sports: { name: "Sports & Digital Watches", category: "sportswatches" }
    }
  },
  "watch-straps": {
    name: "Watch Straps",
    category: "watchstraps",
    subcategories: {
      leather: { name: "Leather Straps", category: "leatherstraps" },
      metal: { name: "Metal/Chain Straps", category: "metalstraps" },
      silicone: { name: "Silicone/Rubber Straps", category: "siliconeStraps" },
      nylon: { name: "Nylon/Fabric Straps", category: "nylonstraps" },
      magnetic: { name: "Magnetic/Loop Straps", category: "magneticstraps" }
    }
  },
  eyewear: {
    name: "Eyewear",
    category: "eyewear",
    subcategories: {
      sunglasses: { name: "Sunglasses", category: "sunglasses" },
      optical: { name: "Optical Frames", category: "opticalframes" }
    }
  },
  "rings-accessories": {
    name: "Rings & Accessories",
    category: "ringsaccessories",
    subcategories: {
      "fashion-rings": { name: "Fashion Rings", category: "fashionrings" },
      "chains-bracelets": { name: "Chains & Bracelets", category: "chainsbracelets" }
    }
  },
  perfumes: {
    name: "Perfumes",
    category: "perfumes",
    subcategories: {
      mens: { name: "Men's Fragrances", category: "mensperfumes" },
      womens: { name: "Women's Fragrances", category: "womensperfumes" },
      unisex: { name: "Unisex Scents", category: "unisexperfumes" }
    }
  },
  "mobile-gadgets": {
    name: "Mobile Gadgets",
    category: "mobilegadgets",
    subcategories: {
      "used-mobiles": { name: "Trusted Used Mobiles", category: "usedmobiles" },
      accessories: { name: "Mobile Accessories", category: "mobileaccessories" }
    }
  },
  fashion: {
    name: "Fashion",
    category: "fashion",
    subcategories: {
      tshirt: { name: "T-Shirt", category: "tshirt" },
      "pant-jeans": { name: "Pant/Jeans", category: "pantjeans" },
      "shalwar-kameez": { name: "Shalwar Kameez Fabric", category: "shalwarkameez" }
    }
  }
};

// Template for category pages
const categoryPageTemplate = (categoryKey, categoryData) => {
  const className = categoryData.name.replace(/[^a-zA-Z0-9]/g, '') + 'Page';
  const breadcrumbPath = categoryKey.includes('-') ? categoryKey : categoryKey;
  
  return `import React, { Fragment, useState, useEffect } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import client from "../../data/contentful";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const ${className} = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const pageLimit = 15;

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

        // Filter for ${categoryData.name.toLowerCase()} category
        const ${categoryData.category}Products = items.filter(product => 
          product.category && product.category.includes("${categoryData.category}")
        );
        
        setProducts(${categoryData.category}Products);
        setSortedProducts(${categoryData.category}Products);
        setCurrentData(${categoryData.category}Products.slice(0, pageLimit));
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
                titleTemplate="${categoryData.name} - IFILifestyle"
        description="Shop premium ${categoryData.name.toLowerCase()} at IFILifestyle. Quality, elegance, and affordability for every customer." 
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "${categoryData.name}", path: process.env.PUBLIC_URL + "/${breadcrumbPath}" },
          ]}
        />
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

export default ${className};`;
};

// Template for subcategory pages
const subcategoryPageTemplate = (categoryKey, categoryData, subcategoryKey, subcategoryData) => {
  const className = subcategoryData.name.replace(/[^a-zA-Z0-9]/g, '') + 'Page';
  const breadcrumbPath = categoryKey.includes('-') ? categoryKey : categoryKey;
  
  return `import React, { Fragment, useState, useEffect } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import client from "../../data/contentful";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const ${className} = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const pageLimit = 15;

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

        // Filter for ${subcategoryData.name.toLowerCase()} category
        const ${subcategoryData.category}Products = items.filter(product => 
          product.category && product.category.includes("${subcategoryData.category}")
        );
        
        setProducts(${subcategoryData.category}Products);
        setSortedProducts(${subcategoryData.category}Products);
        setCurrentData(${subcategoryData.category}Products.slice(0, pageLimit));
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
                titleTemplate="${subcategoryData.name} - IFILifestyle"
        description="Shop premium ${subcategoryData.name.toLowerCase()} at IFILifestyle. Quality, elegance, and affordability for every customer." 
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "${categoryData.name}", path: process.env.PUBLIC_URL + "/${breadcrumbPath}" },
            { label: "${subcategoryData.name}", path: process.env.PUBLIC_URL + "/${breadcrumbPath}/${subcategoryKey}" },
          ]}
        />
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

export default ${className};`;
};

// Generate all category pages
Object.entries(categories).forEach(([categoryKey, categoryData]) => {
  // Generate main category page
  const categoryPageContent = categoryPageTemplate(categoryKey, categoryData);
  const categoryFileName = categoryData.name.replace(/[^a-zA-Z0-9]/g, '') + 'Page.js';
  fs.writeFileSync(path.join(__dirname, 'src/pages/category', categoryFileName), categoryPageContent);
  console.log(`Generated: ${categoryFileName}`);

  // Generate subcategory pages
  Object.entries(categoryData.subcategories).forEach(([subcategoryKey, subcategoryData]) => {
    const subcategoryPageContent = subcategoryPageTemplate(categoryKey, categoryData, subcategoryKey, subcategoryData);
    const subcategoryFileName = subcategoryData.name.replace(/[^a-zA-Z0-9]/g, '') + 'Page.js';
    fs.writeFileSync(path.join(__dirname, 'src/pages/category', subcategoryFileName), subcategoryPageContent);
    console.log(`Generated: ${subcategoryFileName}`);
  });
});

console.log('All category pages generated successfully!'); 