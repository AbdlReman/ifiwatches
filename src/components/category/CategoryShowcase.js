import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { getDiscountPrice, truncateTitle } from "../../helpers/product";

const CategoryShowcase = () => {
  const [luxuryProducts, setLuxuryProducts] = useState([]);
  const [smartProducts, setSmartProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
        // Filter for luxury category (take first 2 products)
        const luxuryItems = items.filter(product => 
          product.category && product.category.includes("luxury")
        ).slice(0, 2);
        setLuxuryProducts(luxuryItems);
        // Filter for smart category (take first 2 products)
        const smartItems = items.filter(product => 
          product.category && product.category.includes("smart")
        ).slice(0, 2);
        setSmartProducts(smartItems);
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="category-showcase-area pt-80 pb-80">
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

  const renderProductCard = (product) => {
    const discountedPrice = product.price - (product.price * product.discount / 100);
    
    return (
      <div className="product-card" key={product.id}>
        <div className="product-image">
          <Link to={`/product/${product.slug}`}>
            <img 
              src={product.images[0] || "/assets/img/product/default.jpg"} 
              alt={product.name}
              className="img-fluid"
            />
          </Link>
          {product.discount > 0 && (
            <div className="discount-badge">
              
            </div>
          )}
        </div>
        <div className="product-info">
          <h4>
            <Link to={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </h4>
          <div className="product-price">
            {product.discount > 0 ? (
              <>
                <span className="new-price">Rs. {discountedPrice.toFixed(2)}</span>

              </>
            ) : (
             <></>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="category-showcase-area pt-80 pb-80">
      <div className="container">
        <div className="row">
          {/* Luxury Category */}
          <div className="col-lg-6 col-md-6 mb-30">
            <div className="category-showcase-item luxury-category">
              <div className="category-header">
                <h2>LUXURY WATCHES</h2>
                <p>Premium timepieces for the discerning collector</p>
              </div>
              <div className="category-products">
                <div className="row">
                  {luxuryProducts.map((product) => (
                    <div key={product.id} className="col-6">
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="category-footer">
                <a href={process.env.PUBLIC_URL + "/luxury"} className="category-link">
                  View All Products
                </a>
              </div>
            </div>
          </div>

          {/* Smart Category */}
          <div className="col-lg-6 col-md-6 mb-30">
            <div className="category-showcase-item smart-category">
              <div className="category-header">
                <h2>SMART WATCHES</h2>
                <p>Advanced technology meets modern design</p>
              </div>
              <div className="category-products">
                <div className="row">
                  {smartProducts.map((product) => (
                    <div key={product.id} className="col-6">
                      {renderProductCard(product)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="category-footer">
                <a href={process.env.PUBLIC_URL + "/smart"} className="category-link">
                  View All Products
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryShowcase; 