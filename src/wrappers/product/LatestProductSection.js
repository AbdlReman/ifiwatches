import React, { useState, useEffect } from "react";
import clsx from "clsx";
import SectionTitle from "../../components/section-title/SectionTitle";
import ShopProducts from "./ShopProducts";
import { StaggeredGrid } from "../../components/AnimatedSection";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const LatestProductSection = ({ spaceBottomClass }) => {
  const [products, setProducts] = useState([]);
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
            createdAt: item.sys.createdAt,
            // For backward compatibility
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
        // Sort by createdAt descending
        const sorted = items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setProducts(sorted.slice(0, 4));
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
      <div className={clsx("product-area", spaceBottomClass)}>
        <div className="container">
          <SectionTitle titleText="Latest Products" positionClass="text-center" />
          <div className="text-center py-5">
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={clsx("product-area", spaceBottomClass)}>
      <div className="container">
        <SectionTitle titleText="Latest Products" positionClass="text-center" />
        <StaggeredGrid className="category-section" staggerDelay={0.2}>
          <ShopProducts layout="grid four-column" products={products} />
        </StaggeredGrid>
        {/* View More Button */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => window.location.href = '/shop'}
            style={{
              color: '#daaa58',
              border: '2px solid #daaa58',
              padding: '12px 30px',
              borderRadius: '25px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              background: 'transparent'
            }}
          >
            View More Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default LatestProductSection; 