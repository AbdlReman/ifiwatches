import React, { Fragment, useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import client from "../../data/contentful";
import { processContentfulProduct } from "../../helpers/contentful";

const Product = () => {
  let { pathname } = useLocation();
  let { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!slug) {
          setError("No product slug provided");
          setLoading(false);
          return;
        }

        const response = await client.getEntries({
          content_type: "product",
          "fields.slug": slug,
        });

        if (response.items.length > 0) {
          const item = response.items[0];
          const fields = item.fields;
          
          // Transform Contentful data to match our product structure
          const transformedProduct = processContentfulProduct(item);

          setProduct(transformedProduct);
        } else {
          setError("Product not found");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="loading-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p>Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="error-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '400px' 
      }}>
        <p>{error || "Product not found"}</p>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate={`${product.metaTitle || product.name} – IFI (Iconic Futures Innovations)`}
        description={
          product.metaDescription || `Shop ${product.name} at IFI (Iconic Futures Innovations) – ifilifestyle. Premium watches, perfumes, men’s fabrics, and fashion accessories with fast nationwide delivery across Pakistan.`
        }
      />

      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Shop", path: process.env.PUBLIC_URL + "/shop" },
          ]}
        />

        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={product}
        />

        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={product.fullDescription || ""}
          product={product}
        />

        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category && product.category.length > 0 ? product.category[0] : ""}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default Product;
