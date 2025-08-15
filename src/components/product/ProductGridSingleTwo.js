import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { getDiscountPrice, truncateTitle } from "../../helpers/product";
import ProductModal from "./ProductModal";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import { addToCart } from "../../store/slices/cart-slice";
import ProductImageGallery from "./ProductImageGallery";

const ProductGridSingleTwo = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
  colorClass,
  titlePriceClass
}) => {
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);

  // Handle images from Contentful - ensure we have at least one image
  const productImages = product.images || (product.image ? [product.image] : []);
  const displayImages = productImages.length > 0 ? productImages : ['/assets/img/product/default-product.jpg'];
  const mainImage = displayImages[0] || '/assets/img/product/default-product.jpg';
  const hoverImage = displayImages[1] || mainImage;

  // Don't render if product is not available
  if (!product || !product.name) {
    return null;
  }

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <Fragment>
             <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)} style={{
         height: '400px',
         display: 'flex',
         flexDirection: 'column',
         background: 'white',
         borderRadius: '12px',
         overflow: 'hidden',
         boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
         transition: 'all 0.3s ease',
         cursor: 'pointer'
       }}
       onMouseEnter={(e) => {
         e.currentTarget.style.transform = 'translateY(-5px)';
         e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
         // Only apply hover image effect if there are multiple images
         if (displayImages.length > 1) {
           const hoverImg = e.currentTarget.querySelector('.hover-img');
           if (hoverImg) {
             hoverImg.style.opacity = '1';
           }
         }
       }}
       onMouseLeave={(e) => {
         e.currentTarget.style.transform = 'translateY(0)';
         e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
         // Only apply hover image effect if there are multiple images
         if (displayImages.length > 1) {
           const hoverImg = e.currentTarget.querySelector('.hover-img');
           if (hoverImg) {
             hoverImg.style.opacity = '0';
           }
         }
       }}>
                 <div className="product-img" style={{ position: 'relative' }}>
           <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
             <img
               className="default-img"
               src={mainImage}
               alt={product.name}
               style={{
                 width: '100%',
                 height: '250px',
                 objectFit: 'contain',
                 transition: 'transform 0.3s ease'
               }}
               onError={(e) => {
                 e.target.src = '/assets/img/product/default-product.jpg';
               }}
               loading="lazy"
             />
             {displayImages.length > 1 && (
               <img
                 className="hover-img"
                 src={hoverImage}
                 alt={product.name}
                 style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '250px',
                   objectFit: 'contain',
                   opacity: 0,
                   transition: 'opacity 0.3s ease'
                 }}
                 onError={(e) => {
                   e.target.src = '/assets/img/product/default-product.jpg';
                 }}
                 loading="lazy"
               />
             )}
           </Link>
          {product.discount || product.new ? (
            <div className="product-img-badges">
              {product.discount ? (
                <span className="brand-color">-{product.discount}%</span>
              ) : (
                ""
              )}
              {product.new ? <span className="purple">New</span> : ""}
            </div>
          ) : (
            ""
          )}

          
        </div>
                 <div className="product-content-2" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '15px' }}>
           <div>
             <h3 style={{ marginBottom: '10px', fontSize: '14px', lineHeight: '1.3' }}>
               <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                 {truncateTitle(product.name)}
               </Link>
             </h3>
           </div>
           <div className="product-price-cart-container" style={{
             display: 'flex',
             justifyContent: 'space-between',
             alignItems: 'center',
             marginTop: 'auto'
           }}>
                           <div className="price-2">
                                 <span style={{ 
                   fontSize: '16px', 
                   fontWeight: '600', 
                   color: '#daaa58',
                   whiteSpace: 'nowrap',
                   display: 'inline-block'
                 }} className="product-price-text">
                   {"Rs " + (discountedPrice !== null ? finalDiscountedPrice : finalProductPrice)}
                 </span>
              </div>
             
             {/* Inline Add to Cart Button */}
             <div className="inline-cart-button">
               {product.affiliateLink ? (
                 <a
                   href={product.affiliateLink}
                   rel="noopener noreferrer"
                   target="_blank"
                                                          style={{
                     background: 'linear-gradient(135deg, #daaa58 0%, #f4ca68 100%)',
                     color: 'white',
                     border: 'none',
                     padding: '8px 16px',
                     borderRadius: '20px',
                     fontSize: '12px',
                     fontWeight: '600',
                     cursor: 'pointer',
                     textDecoration: 'none',
                     transition: 'all 0.3s ease',
                     boxShadow: '0 2px 8px rgba(218, 170, 88, 0.3)'
                   }}
                   className="product-button"
                   onMouseOver={(e) => {
                     e.target.style.transform = 'scale(1.05)';
                     e.target.style.boxShadow = '0 4px 12px rgba(218, 170, 88, 0.4)';
                   }}
                   onMouseOut={(e) => {
                     e.target.style.transform = 'scale(1)';
                     e.target.style.boxShadow = '0 2px 8px rgba(218, 170, 88, 0.3)';
                   }}
                 >
                   Buy Now
                 </a>
                               ) : product.variation && product.variation.length >= 1 ? (
                  <button
                    onClick={handleAddToCart}
                    className={cartItem && cartItem.quantity > 0 ? "active product-button" : "product-button"}
                    disabled={cartItem && cartItem.quantity > 0}
                    style={{
                      background: cartItem && cartItem.quantity > 0 
                        ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                        : 'linear-gradient(135deg, #daaa58 0%, #f4ca68 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: cartItem && cartItem.quantity > 0 ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(218, 170, 88, 0.3)',
                      opacity: cartItem && cartItem.quantity > 0 ? 0.8 : 1
                    }}
                   onMouseOver={(e) => {
                     if (!cartItem || cartItem.quantity === 0) {
                       e.target.style.transform = 'scale(1.05)';
                       e.target.style.boxShadow = '0 4px 12px rgba(218, 170, 88, 0.4)';
                     }
                   }}
                   onMouseOut={(e) => {
                     if (!cartItem || cartItem.quantity === 0) {
                       e.target.style.transform = 'scale(1)';
                       e.target.style.boxShadow = '0 2px 8px rgba(218, 170, 88, 0.3)';
                     }
                   }}
                 >
                   {cartItem && cartItem.quantity > 0 ? "✓ Added" : "Add to Cart"}
                 </button>
                               ) : product.stock && product.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className={cartItem && cartItem.quantity > 0 ? "active product-button" : "product-button"}
                    disabled={cartItem && cartItem.quantity > 0}
                    style={{
                      background: cartItem && cartItem.quantity > 0 
                        ? 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)'
                        : 'linear-gradient(135deg, #daaa58 0%, #f4ca68 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: cartItem && cartItem.quantity > 0 ? 'default' : 'pointer',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 2px 8px rgba(218, 170, 88, 0.3)',
                      opacity: cartItem && cartItem.quantity > 0 ? 0.8 : 1
                    }}
                   onMouseOver={(e) => {
                     if (!cartItem || cartItem.quantity === 0) {
                       e.target.style.transform = 'scale(1.05)';
                       e.target.style.boxShadow = '0 4px 12px rgba(218, 170, 88, 0.4)';
                     }
                   }}
                   onMouseOut={(e) => {
                     if (!cartItem || cartItem.quantity === 0) {
                       e.target.style.transform = 'scale(1)';
                       e.target.style.boxShadow = '0 2px 8px rgba(218, 170, 88, 0.3)';
                     }
                   }}
                 >
                   {cartItem && cartItem.quantity > 0 ? "✓ Added" : "Add to Cart"}
                 </button>
               ) : (
                                   <button 
                    disabled 
                    className="product-button"
                    style={{
                      background: '#95a5a6',
                      color: 'white',
                      border: 'none',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      cursor: 'not-allowed',
                      opacity: 0.6
                    }}
                 >
                   Out of Stock
                 </button>
               )}
             </div>
           </div>
         </div>
      </div>
      {/* product modal */}
      <ProductModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        product={product}
        currency={currency}
        discountedPrice={discountedPrice}
        finalProductPrice={finalProductPrice}
        finalDiscountedPrice={finalDiscountedPrice}
        wishlistItem={wishlistItem}
        compareItem={compareItem}
      />
    </Fragment>
  );
};

ProductGridSingleTwo.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string
};

export default ProductGridSingleTwo;
