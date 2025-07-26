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
      <div className={clsx("product-wrap-2", spaceBottomClass, colorClass)}>
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
            <img
              className="hover-img"
              src={hoverImage}
              alt={product.name}
              onError={(e) => {
                e.target.src = '/assets/img/product/default-product.jpg';
              }}
            />
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

          <div className="product-action-2">
            {product.affiliateLink ? (
              <a
                href={product.affiliateLink}
                rel="noopener noreferrer"
                target="_blank"
                title="Buy now"
              >
                {" "}
                <i className="fa fa-shopping-cart"></i>{" "}
              </a>
            ) : product.variation && product.variation.length >= 1 ? (
              <Link
                to={`${process.env.PUBLIC_URL}/product/${product.slug}`}
                title="Select options"
              >
                <i className="fa fa-cog"></i>
              </Link>
            ) : product.stock && product.stock > 0 ? (
              <button
                onClick={handleAddToCart}
                className={
                  cartItem !== undefined && cartItem.quantity > 0
                    ? "active"
                    : ""
                }
                disabled={cartItem !== undefined && cartItem.quantity > 0}
                title={
                  cartItem !== undefined ? "Added to cart" : "Add to cart"
                }
              >
                {" "}
                <i className="fa fa-shopping-cart"></i>{" "}
              </button>
            ) : (
              <button disabled className="active" title="Out of stock">
                <i className="fa fa-shopping-cart"></i>
              </button>
            )}

            <button
              title="Quick View"
              onClick={() => setModalShow(true)}
            >
              <i className="fa fa-eye"></i>
            </button>

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
              <i className="fa fa-retweet"></i>
            </button>
          </div>
        </div>
        <div className="product-content-2">
          <div
            className={`title-price-wrap-2 ${
              titlePriceClass ? titlePriceClass : ""
            }`}
          >
            <h3>
              <Link to={process.env.PUBLIC_URL + "/product/" + product.slug}>
                {truncateTitle(product.name)}
              </Link>
            </h3>
            <div className="price-2">
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
          </div>
          <div className="pro-wishlist-2">
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
