import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProductCartQuantity, getQuantityDiscount, getQuantityDiscountedPrice } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";

const ProductDescriptionInfo = ({
  product,
  discountedPrice,
  currency,
  finalDiscountedPrice,
  finalProductPrice,
  cartItems,
  wishlistItem,
  compareItem,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [selectedProductColor, setSelectedProductColor] = useState("");
  const [selectedProductSize, setSelectedProductSize] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [quantityCount, setQuantityCount] = useState(1);
  const [includeGiftBox, setIncludeGiftBox] = useState(false);
  
  // Use useEffect to set initial values when product changes
  useEffect(() => {
    if (product) {
      if (product.variation && product.variation[0]) {
        setSelectedProductColor(product.variation[0].color || "");
      }
      
      const stock = product.stock || 0;
      setProductStock(stock);
    }
  }, [product]);
  
  // Add null check after all hooks
  if (!product) {
    return (
      <div className="product-details-content ml-70">
        <p>Product not found</p>
      </div>
    );
  }

  const giftBoxUnitPrice = Number(product.giftBoxPrice || 0);
  const showGiftBoxOption = Number.isFinite(giftBoxUnitPrice) && giftBoxUnitPrice > 0;

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  // Calculate quantity discount
  const quantityDiscount = getQuantityDiscount(quantityCount);
  const basePrice = discountedPrice !== null ? discountedPrice : product.price;
  const quantityDiscountedPrice = getQuantityDiscountedPrice(basePrice, quantityCount);
  const finalQuantityDiscountedPrice = +(quantityDiscountedPrice * (currency?.currencyRate || 1)).toFixed(2);

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      quantity: quantityCount,
      selectedProductColor: selectedProductColor ? selectedProductColor : product.selectedProductColor ? product.selectedProductColor : null,
      selectedProductSize: selectedProductSize ? selectedProductSize : product.selectedProductSize ? product.selectedProductSize : null,
      includeGiftBox: showGiftBoxOption ? includeGiftBox : false,
      giftBoxPrice: showGiftBoxOption ? giftBoxUnitPrice : 0
    }));
  };

  const handleBuyNow = () => {
    // First add the product to cart (without showing toast)
    dispatch(addToCart({
      ...product,
      quantity: quantityCount,
      selectedProductColor: selectedProductColor ? selectedProductColor : product.selectedProductColor ? product.selectedProductColor : null,
      selectedProductSize: selectedProductSize ? selectedProductSize : product.selectedProductSize ? product.selectedProductSize : null,
      includeGiftBox: showGiftBoxOption ? includeGiftBox : false,
      giftBoxPrice: showGiftBoxOption ? giftBoxUnitPrice : 0,
      suppressToast: true
    }));
    
    // Then navigate to checkout
    navigate("/checkout");
  };

  return (
    <div className="product-details-content ml-70">
      <h2>{product.name}</h2>
                  <div className="product-details-price">
              {discountedPrice !== null ? (
                <Fragment>
                  <span>{"Rs " + finalDiscountedPrice}</span>{" "}
                  <span className="old">
                    {"Rs " + finalProductPrice}
                  </span>
                </Fragment>
              ) : (
                <span>{"Rs " + finalProductPrice} </span>
              )}
            </div>
      {product.rating && product.rating > 0 ? (
        <div className="pro-details-rating-wrap">
          <div className="pro-details-rating">
            <Rating ratingValue={product.rating} />
          </div>
        </div>
      ) : (
        ""
      )}
      <div className="pro-details-list">
        <p>{product.shortDescription}</p>
      </div>

      {/* Quantity Discount Section */}
      <div className="quantity-discount-section" style={{
        border: '2px dashed #28a745',
        borderRadius: '8px',
        padding: '15px',
        margin: '15px 0',
        backgroundColor: '#f8fff9'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#28a745' }}>
            🎉 Buy More Save More!
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '10px',
          flexWrap: 'wrap'
        }}>
                     <label style={{ 
             display: 'flex', 
             alignItems: 'center', 
             cursor: 'pointer',
             fontSize: '14px'
           }}>
             <input
               type="radio"
               name="quantity-discount"
               checked={quantityCount === 2}
               onChange={() => setQuantityCount(2)}
               style={{ 
                 marginRight: '6px',
                 width: '14px',
                 height: '14px',
                 cursor: 'pointer'
               }}
             />
             <span>Buy 2 - Get 5% OFF</span>
           </label>
           <label style={{ 
             display: 'flex', 
             alignItems: 'center',
             cursor: 'pointer',
             fontSize: '14px'
           }}>
             <input
               type="radio"
               name="quantity-discount"
               checked={quantityCount === 3}
               onChange={() => setQuantityCount(3)}
               style={{ 
                 marginRight: '6px',
                 width: '14px',
                 height: '14px',
                 cursor: 'pointer'
               }}
             />
             <span>Buy 3 - Get 10% OFF</span>
           </label>
        </div>
        {quantityDiscount > 0 && (
          <div style={{ 
            fontSize: '14px', 
            color: '#28a745', 
            fontWeight: 'bold',
            padding: '8px',
            backgroundColor: '#e8f5e8',
            borderRadius: '4px'
          }}>
            You save: Rs {((basePrice * quantityCount * (currency?.currencyRate || 1)) - (quantityDiscountedPrice * quantityCount * (currency?.currencyRate || 1))).toFixed(2)}
          </div>
        )}
      </div>

      {/* Gift box option (only if configured and > 0) */}
      {showGiftBoxOption && (
        <div className="pro-details-giftbox" style={{ marginTop: 10 }}>
          <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={includeGiftBox}
              onChange={(e) => setIncludeGiftBox(e.target.checked)}
              style={{ width: 16, height: 16 }}
            />
            <span>
              Do you want gift box? (+ Rs {(giftBoxUnitPrice * (currency?.currencyRate || 1)).toFixed(2)})
            </span>
          </label>
        </div>
      )}

      {/* Display colors if available */}
      {product.color && product.color.length > 0 && (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Color</span>
            <div className="pro-details-color-content">
                             {product.color.map((color, key) => {
                 return (
                   <label
                     className={`pro-details-color-content--single ${color === selectedProductColor ? 'selected' : ''}`}
                     key={key}
                   >
                    <input
                      type="radio"
                      value={color}
                      name="product-color"
                      checked={
                        color === selectedProductColor ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductColor(color);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                    <span className="color-text">{color}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Display sizes if available */}
      {product.size && product.size.length > 0 && (
        <div className="pro-details-size-color">
          <div className="pro-details-color-wrap">
            <span>Size</span>
            <div className="pro-details-color-content">
                             {product.size.map((size, key) => {
                 return (
                   <label
                     className={`pro-details-color-content--single ${size === selectedProductSize ? 'selected' : ''}`}
                     key={key}
                   >
                    <input
                      type="radio"
                      value={size}
                      name="product-size"
                      checked={
                        size === selectedProductSize ? "checked" : ""
                      }
                      onChange={() => {
                        setSelectedProductSize(size);
                        setQuantityCount(1);
                      }}
                    />
                    <span className="checkmark"></span>
                    <span className="color-text">{size}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {product.affiliateLink ? (
        <div className="pro-details-quality">
          <div className="pro-details-cart btn-hover ml-0">
            <a
              href={product.affiliateLink}
              rel="noopener noreferrer"
              target="_blank"
            >
              Buy Now
            </a>
          </div>
        </div>
      ) : (
        <div className="pro-details-quality">
          <div className="cart-plus-minus">
            <button
              onClick={() =>
                setQuantityCount(quantityCount > 1 ? quantityCount - 1 : 1)
              }
              className="dec qtybutton"
            >
              -
            </button>
            <input
              className="cart-plus-minus-box"
              type="text"
              value={quantityCount}
              readOnly
            />
            <button
              onClick={() =>
                setQuantityCount(
                  quantityCount < productStock - productCartQty
                    ? quantityCount + 1
                    : quantityCount
                )
              }
              className="inc qtybutton"
            >
              +
            </button>
          </div>
          <div className="pro-details-cart btn-hover">
            {productStock && productStock > 0 ? (
              <button
                onClick={handleAddToCart}
                disabled={productCartQty >= productStock}
              >
                {" "}
                Add To Cart{" "}
              </button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>
          <div className="pro-details-buy-now btn-hover">
            {productStock && productStock > 0 ? (
              <button
                onClick={handleBuyNow}
                disabled={productCartQty >= productStock}
                className="buy-now-btn"
              >
                {" "}
                Buy Now{" "}
              </button>
            ) : (
              <button disabled>Out of Stock</button>
            )}
          </div>
          <div className="pro-details-wishlist">
            <button
              className={wishlistItem !== undefined ? "active" : ""}
              disabled={wishlistItem !== undefined}
              title={
                wishlistItem !== undefined
                  ? "Added to wishlist"
                  : "Add to wishlist"
              }
              onClick={() => dispatch(addToWishlist(product))}
            >
              <i className="fa fa-heart-o" />
            </button>
          </div>
          <div className="pro-details-compare">
            <button
              className={compareItem !== undefined ? "active" : ""}
              disabled={compareItem !== undefined}
              title={
                compareItem !== undefined
                  ? "Added to compare"
                  : "Add to compare"
              }
              onClick={() => dispatch(addToCompare(product))}
            >
              <i className="fa fa-retweet" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ProductDescriptionInfo.propTypes = {
  cartItems: PropTypes.array,
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  product: PropTypes.shape({}),
  wishlistItem: PropTypes.shape({}),
};

export default ProductDescriptionInfo;
