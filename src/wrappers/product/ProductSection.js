import PropTypes from "prop-types";
import clsx from "clsx"
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridTwo from "./ProductGridTwo";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

const ProductSection = ({ spaceBottomClass, category, title }) => {
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
            images: fields.images?.map((img) => img.fields.file.url) || [],
            color: fields.color || [],
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            // For backward compatibility
            image: fields.images?.[0]?.fields?.file?.url,
            title: fields.name,
            description: fields.shortDescription,
            // Add variation structure if colors/sizes exist
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
        setProducts(items);
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter products by category
  const categoryProducts = products
    .filter(product => product.category && product.category.includes(category))
    .slice(0, 4);

  if (loading) {
    return (
      <div className={clsx("product-area", spaceBottomClass)}>
        <div className="container">
          <SectionTitle titleText={title} positionClass="text-center" />
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
        <SectionTitle titleText={title} positionClass="text-center" />
        <div className="row four-column">
          <ProductGridTwo
            products={categoryProducts}
            spaceBottomClass="mb-25"
          />
        </div>
        <div className="view-more text-center mt-20 toggle-btn6 col-12">
          <Link
            className="loadMore6"
            to={process.env.PUBLIC_URL + `/${category}`}
          >
            VIEW MORE PRODUCTS
          </Link>
        </div>
      </div>
    </div>
  );
};

ProductSection.propTypes = {
  category: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  spaceBottomClass: PropTypes.string
};

export default ProductSection; 