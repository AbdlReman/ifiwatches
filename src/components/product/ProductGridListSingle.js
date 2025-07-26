import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import clsx from "clsx";
import { getDiscountPrice, truncateTitle } from "../../helpers/product";
import Rating from "./sub-components/ProductRating";
import ProductModal from "./ProductModal";
import { addToCart } from "../../store/slices/cart-slice";
import { addToWishlist } from "../../store/slices/wishlist-slice";
import { addToCompare } from "../../store/slices/compare-slice";

const ProductGridListSingle = ({
  product,
  currency,
  cartItem,
  wishlistItem,
  compareItem,
  spaceBottomClass,
}) => {
  const [modalShow, setModalShow] = useState(false);
  const discountedPrice = getDiscountPrice(product.price, product.discount);
  const finalProductPrice = +(product.price * currency.currencyRate).toFixed(2);
  const finalDiscountedPrice = +(
    discountedPrice * currency.currencyRate
  ).toFixed(2);
  const dispatch = useDispatch();

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
      <div className={clsx("product-wrap", spaceBottomClass)}>
        <div className="product-img">
          <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
            <img
              className="default-img"
              src={mainImage}
              alt={product.name}
              onError={(e) => {
                e.target.src = '/assets/img/product/default-product.jpg';
              }}
            />
            {displayImages.length > 1 && (
              <img
                className="hover-img"
                src={hoverImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = '/assets/img/product/default-product.jpg';
                }}
              />
            )}
          </Link>
          {(product.discount || product.new) && (
            <div className="product-img-badges">
              {product.discount && (
                <span className="brand-color">-{product.discount}%</span>
              )}
              {product.new && <span className="purple">New</span>}
            </div>
          )}

          <div className="product-action">
            <div className="pro-same-action pro-wishlist">
              <button
                className={wishlistItem ? "active" : ""}
                disabled={!!wishlistItem}
                title={wishlistItem ? "Added to wishlist" : "Add to wishlist"}
                onClick={() => dispatch(addToWishlist(product))}
              >
                <i className="pe-7s-like" />
              </button>
            </div>
            <div className="pro-same-action pro-cart">
              {product.affiliateLink ? (
                <a
                  href={product.affiliateLink}
                  rel="noopener noreferrer"
                  target="_blank"
                  title="Buy now"
                >
                  <i className="pe-7s-cart" />
                  Buy now
                </a>
              ) : product.variation && product.variation.length >= 1 ? (
                <Link
                  to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                  title="Select options"
                >
                  <i className="pe-7s-cart" />
                  Select Option
                </Link>
              ) : product.stock && product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className={cartItem && cartItem.quantity > 0 ? "active" : ""}
                  disabled={cartItem && cartItem.quantity > 0}
                  title={cartItem ? "Added to cart" : "Add to cart"}
                >
                  <i className="pe-7s-cart" />
                  {cartItem && cartItem.quantity > 0 ? "Added" : "Add to cart"}
                </button>
              ) : (
                <button disabled className="active" title="Out of stock">
                  <i className="pe-7s-cart" />
                  Out of Stock
                </button>
              )}
            </div>
            <div className="pro-same-action pro-quickview">
              <button onClick={() => setModalShow(true)} title="Quick View">
                <i className="pe-7s-look" />
              </button>
            </div>
          </div>
        </div>
        <div className="product-content text-center">
          <h3>
            <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
              {truncateTitle(product.name)}
            </Link>
          </h3>
          {product.rating && product.rating > 0 && (
            <div className="product-rating">
              <Rating ratingValue={product.rating} />
            </div>
          )}
          <div className="product-price">
            {discountedPrice !== null ? (
              <Fragment>
                <span>{"Rs "  + finalDiscountedPrice}</span>{" "}
                <span className="old">
                  {"Rs "  + finalProductPrice}
                </span>
              </Fragment>
            ) : (
              <span>{"Rs "  + finalProductPrice} </span>
            )}
          </div>
        </div>
      </div>

      <div className="shop-list-wrap mb-30">
        <div className="row">
          <div className="col-xl-4 col-md-5 col-sm-6">
            <div className="product-list-image-wrap">
              <div className="product-img">
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  <img
                    className="default-img img-fluid"
                    src={mainImage}
                    alt={product.name}
                    onError={(e) => {
                      e.target.src = '/assets/img/product/default-product.jpg';
                    }}
                  />
                  {displayImages.length > 1 && (
                    <img
                      className="hover-img img-fluid"
                      src={hoverImage}
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/assets/img/product/default-product.jpg';
                      }}
                    />
                  )}
                </Link>
                {(product.discount || product.new) && (
                  <div className="product-img-badges">
                    {product.discount && (
                      <span className="brand-color">-{product.discount}%</span>
                    )}
                    {product.new && <span className="purple">New</span>}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-xl-8 col-md-7 col-sm-6">
            <div className="shop-list-content">
              <h3>
                <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                  {truncateTitle(product.name)}
                </Link>
              </h3>
              <div className="product-list-price">
                {discountedPrice !== null ? (
                  <Fragment>
                    <span>
                      {"Rs "  + finalDiscountedPrice}
                    </span>{" "}
                    <span className="old">
                      {"Rs "  + finalProductPrice}
                    </span>
                  </Fragment>
                ) : (
                  <span>{"Rs "  + finalProductPrice}</span>
                )}
              </div>
              {product.rating && product.rating > 0 && (
                <div className="rating-review">
                  <div className="product-list-rating">
                    <Rating ratingValue={product.rating} />
                  </div>
                </div>
              )}
              {product.shortDescription && <p>{product.shortDescription}</p>}

              <div className="shop-list-actions d-flex align-items-center">
                <div className="shop-list-btn btn-hover">
                  {product.affiliateLink ? (
                    <a
                      href={product.affiliateLink}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="btn"
                      title="Buy now"
                    >
                      <i className="pe-7s-cart" />
                      Buy now
                    </a>
                  ) : product.variation && product.variation.length >= 1 ? (
                    <Link
                      to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                      className="btn"
                      title="Select options"
                    >
                      <i className="pe-7s-cart" />
                      Select Option
                    </Link>
                  ) : product.stock && product.stock > 0 ? (
                    <button
                      onClick={handleAddToCart}
                      className={
                        cartItem && cartItem.quantity > 0 ? "active" : ""
                      }
                      disabled={cartItem && cartItem.quantity > 0}
                      title={cartItem ? "Added to cart" : "Add to cart"}
                    >
                      <i className="pe-7s-cart" />
                      {cartItem && cartItem.quantity > 0
                        ? "Added"
                        : "Add to cart"}
                    </button>
                  ) : (
                    <button disabled className="active" title="Out of stock">
                      <i className="pe-7s-cart" />
                      Out of Stock
                    </button>
                  )}
                </div>
                <div className="shop-list-wishlist ml-10">
                  <button
                    className={wishlistItem ? "active" : ""}
                    disabled={!!wishlistItem}
                    title={
                      wishlistItem ? "Added to wishlist" : "Add to wishlist"
                    }
                    onClick={() => dispatch(addToWishlist(product))}
                  >
                    <i className="pe-7s-like" />
                  </button>
                </div>
                <div className="shop-list-compare ml-10">
                  <button
                    className={compareItem ? "active" : ""}
                    disabled={!!compareItem}
                    title={compareItem ? "Added to compare" : "Add to compare"}
                    onClick={() => dispatch(addToCompare(product))}
                  >
                    <i className="pe-7s-shuffle" />
                  </button>
                </div>
              </div>
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

ProductGridListSingle.propTypes = {
  cartItem: PropTypes.shape({}),
  compareItem: PropTypes.shape({}),
  currency: PropTypes.shape({}),
  product: PropTypes.shape({}),
  spaceBottomClass: PropTypes.string,
  wishlistItem: PropTypes.shape({}),
};

export default ProductGridListSingle;
