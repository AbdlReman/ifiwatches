import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import clsx from "clsx";

import SectionTitle from "../../components/section-title/SectionTitle";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";



const RelatedProductSlider = ({ spaceBottomClass, category }) => {
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ 
          content_type: "product",
          limit: 6
        });
        
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

        // Filter by category if provided, but also include some other products if not enough
        let filteredProducts = items;
        
        if (category) {
          const categoryProducts = items.filter(product => 
            product.category && product.category.some(cat => 
              cat && cat.toLowerCase().includes(category.toLowerCase())
            )
          );
          
          // If we have enough category products, use them
          if (categoryProducts.length >= 3) {
            filteredProducts = categoryProducts;
          } else {
            // If not enough category products, mix with other products
            const otherProducts = items.filter(product => 
              !product.category || !product.category.some(cat => 
                cat && cat.toLowerCase().includes(category.toLowerCase())
              )
            );
            filteredProducts = [...categoryProducts, ...otherProducts];
          }
        }

        setRelatedProducts(filteredProducts.slice(0, 6));
      } catch (error) {
        console.error("Failed to fetch related products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category]);
  
  return (
    <div className={clsx("related-product-area", spaceBottomClass)}>
      <div className="container">
        <SectionTitle
          titleText="Related Products"
          positionClass="text-center"
          spaceClass="mb-50"
        />
        {loading ? (
          <div className="text-center py-5">
            <p>Loading related products...</p>
          </div>
        ) : relatedProducts?.length ? (
                     <div className="shop-bottom-area mt-35">
             <div className="row grid four-column">
               {relatedProducts.map(product => (
                 <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" key={product.slug}>
                  <ProductGridListSingle
                    product={product}
                    currency={currency}
                    cartItem={
                      cartItems.find((cartItem) => cartItem.slug === product.slug)
                    }
                    wishlistItem={
                      wishlistItems.find(
                        (wishlistItem) => wishlistItem.slug === product.slug
                      )
                    }
                    compareItem={
                      compareItems.find(
                        (compareItem) => compareItem.slug === product.slug
                      )
                    }
                    spaceBottomClass="mb-25"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-5">
            <p>No related products found</p>
          </div>
        )}
      </div>
    </div>
  );
};

RelatedProductSlider.propTypes = {
  category: PropTypes.string,
  spaceBottomClass: PropTypes.string
};

export default RelatedProductSlider;
