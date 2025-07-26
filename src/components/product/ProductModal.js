import { Fragment, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from 'swiper';
import { useDispatch, useSelector } from "react-redux";
import Rating from "./sub-components/ProductRating";
import SwiperSlider, { SwiperSlide } from "../../components/swiper";
import { getProductCartQuantity } from "../../helpers/product";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";
import { addToCart } from "../../store/slices/cart-slice";

function ProductModal({ product, currency, discountedPrice, finalProductPrice, finalDiscountedPrice, show, onHide, wishlistItem, compareItem }) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  const [selectedProductColor, setSelectedProductColor] = useState("");
  const [selectedProductSize, setSelectedProductSize] = useState("");
  const [productStock, setProductStock] = useState(0);
  const [quantityCount, setQuantityCount] = useState(1);
  
  // Use useEffect to set initial values when product changes
  useEffect(() => {
    if (product) {
      if (product.variation && product.variation[0]) {
        setSelectedProductColor(product.variation[0].color || "");
      }
      
      if (product.variation && product.variation[0] && product.variation[0].size && product.variation[0].size[0]) {
        setSelectedProductSize(product.variation[0].size[0].name || "");
      }
      
      const stock = product.variation && product.variation[0] && product.variation[0].size && product.variation[0].size[0] 
        ? product.variation[0].size[0].stock 
        : product.stock || 0;
      setProductStock(stock);
    }
  }, [product]);
  
  // Add null check after all hooks
  if (!product) {
    return null;
  }

  const productCartQty = getProductCartQuantity(
    cartItems,
    product,
    selectedProductColor,
    selectedProductSize
  );

  // Handle images from Contentful - ensure we have at least one image
  const productImages = product.images || (product.image ? [product.image] : []);
  const displayImages = productImages.length > 0 ? productImages : ['/assets/img/product/default-product.jpg'];

  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true
  };

  const onCloseModal = () => {
    setThumbsSwiper(null)
    onHide()
  }

  const handleAddToCart = () => {
    dispatch(addToCart({
      ...product,
      quantity: quantityCount,
      selectedProductColor: selectedProductColor ? selectedProductColor : product.selectedProductColor ? product.selectedProductColor : null,
      selectedProductSize: selectedProductSize ? selectedProductSize : product.selectedProductSize ? product.selectedProductSize : null
    }));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1050
    }} onClick={onCloseModal}>
      <div className="modal-content product-quickview-modal-wrapper" style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '72%',
        maxHeight: '90%',
        overflow: 'auto',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onCloseModal}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0, 0, 0, 0.5)',
            border: 'none',
            fontSize: '20px',
            cursor: 'pointer',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          ×
        </button>
        <div className="modal-body">
          <div className="row">
            <div className="col-md-5 col-sm-12 col-xs-12">
              <div className="product-large-image-wrapper">
                <SwiperSlider options={gallerySwiperParams}>
                  {displayImages.map((img, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className="single-image">
                          <img
                            src={img}
                            className="img-fluid"
                            alt={product.name || "Product"}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/default-product.jpg';
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </SwiperSlider>
              </div>
              <div className="product-small-image-wrapper mt-15">
                <SwiperSlider options={thumbnailSwiperParams}>
                  {displayImages.map((img, i) => {
                    return (
                      <SwiperSlide key={i}>
                        <div className="single-image">
                          <img
                            src={img}
                            className="img-fluid"
                            alt={product.name || "Product"}
                            onError={(e) => {
                              e.target.src = '/assets/img/product/default-product.jpg';
                            }}
                          />
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </SwiperSlider>
              </div>
            </div>
            <div className="col-md-7 col-sm-12 col-xs-12">
              <div className="product-details-content quickview-content">
                <h2>{product.name}</h2>
                <div className="product-details-price">
                  {discountedPrice !== null ? (
                    <Fragment>
                      <span>
                        {"Rs " + finalDiscountedPrice}
                      </span>{" "}
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

                {/* Display colors if available */}
                {product.color && product.color.length > 0 && (
                  <div className="pro-details-size-color">
                    <div className="pro-details-color-wrap">
                      <span>Color</span>
                      <div className="pro-details-color-content">
                        {product.color.map((color, key) => {
                          return (
                            <label
                              className={`pro-details-color-content--single ${color}`}
                              key={key}
                            >
                              <input
                                type="radio"
                                value={color}
                                name="product-color"
                                checked={
                                  color === selectedProductColor
                                    ? "checked"
                                    : ""
                                }
                                onChange={() => {
                                  setSelectedProductColor(color);
                                  setQuantityCount(1);
                                }}
                              />
                              <span className="checkmark"></span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Display sizes if available */}
                {product.size && product.size.length > 0 && (
                  <div className="pro-details-size">
                    <span>Size</span>
                    <div className="pro-details-size-content">
                      {product.size.map((size, key) => {
                        return (
                          <label
                            className={`pro-details-size-content--single`}
                            key={key}
                          >
                            <input
                              type="radio"
                              value={size}
                              checked={
                                size === selectedProductSize
                                  ? "checked"
                                  : ""
                              }
                              onChange={() => {
                                setSelectedProductSize(size);
                                setQuantityCount(1);
                              }}
                            />
                            <span className="size-name">
                              {size}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}

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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProductModal.propTypes = {
  currency: PropTypes.shape({}),
  discountedPrice: PropTypes.number,
  finalDiscountedPrice: PropTypes.number,
  finalProductPrice: PropTypes.number,
  onHide: PropTypes.func,
  product: PropTypes.shape({}),
  show: PropTypes.bool,
  wishlistItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({})
};

export default ProductModal;
