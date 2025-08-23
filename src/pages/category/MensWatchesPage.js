import React, { Fragment, useState, useEffect } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import client from "../../data/contentful";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { hasCategory } from "../../helpers/categoryMapper";
import { AnimatedSection } from "../../components/AnimatedSection";
import { Link } from "react-router-dom";

const MensWatchesPage = () => {
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

        // Filter for men's watches category using the category mapper
        const mensWatchesProducts = items.filter(product => 
          hasCategory(product, "menwatches")
        );
        
        setProducts(mensWatchesProducts);
        setSortedProducts(mensWatchesProducts);
        setCurrentData(mensWatchesProducts.slice(0, pageLimit));
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
                titleTemplate="Men's Watches - IFILifestyle"
        description="Shop premium men's watches at IFILifestyle. Quality, elegance, and affordability for every gentleman." 
      />
      <LayoutOne headerTop="visible">
      <AnimatedSection delay={0.2}>
          <div>
          <div className="hero-banner-section">
      <Link to={process.env.PUBLIC_URL + "/shop"}>
        <img 
          src={process.env.PUBLIC_URL + "/assets/img/banner/menwatches.PNG"}
          alt="Shop Now"
          className="img-fluid w-100"
          style={{
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
          }}
          onMouseOver={(e) => {
            e.target.style.transform = "scale(1.02)";
            e.target.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.25)";
          }}
          onMouseOut={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)";
          }}
        />
      </Link>
    </div>
          </div>
        </AnimatedSection>
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

export default MensWatchesPage; 