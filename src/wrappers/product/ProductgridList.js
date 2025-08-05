import PropTypes from "prop-types";
import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import ProductGridListSingle from "../../components/product/ProductGridListSingle";

const ProductGridList = ({ products, spaceBottomClass, layout }) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);

  return (
    <Fragment>
      {products?.map((product) => {
        return (
          <div className={layout === "grid four-column" ? "col-xl-3 col-lg-3 col-md-6 col-sm-6" : "col-xl-4 col-lg-4 col-md-6 col-sm-6"} key={product.slug}>
            <ProductGridListSingle
              spaceBottomClass={spaceBottomClass}
              product={product}
              currency={currency}
              cartItem={cartItems.find(
                (cartItem) => cartItem.slug === product.slug
              )}
              wishlistItem={wishlistItems.find(
                (wishlistItem) => wishlistItem.slug === product.slug
              )}
              compareItem={compareItems.find(
                (compareItem) => compareItem.slug === product.slug
              )}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridList.propTypes = {
  products: PropTypes.array,
  spaceBottomClass: PropTypes.string,
  layout: PropTypes.string,
};

export default ProductGridList;
