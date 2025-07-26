import { Fragment } from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import ProductGridSingleTwo from "../../components/product/ProductGridSingleTwo";

const ProductGridTwo = ({
  spaceBottomClass,
  colorClass,
  titlePriceClass,
  products,
  category,
  type,
  limit
}) => {
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { compareItems } = useSelector((state) => state.compare);
  
  // Use products from props if provided, otherwise use empty array
  const displayProducts = products || [];
  
  return (
    <Fragment>
      {displayProducts?.map((product) => {
        return (
          <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6" key={product.id}>
            <ProductGridSingleTwo
              spaceBottomClass={spaceBottomClass}
              colorClass={colorClass}
              product={product}
              currency={currency}
              cartItem={
                cartItems.find((cartItem) => cartItem.id === product.id)
              }
              wishlistItem={
                wishlistItems.find(
                  (wishlistItem) => wishlistItem.id === product.id
                )
              }
              compareItem={
                compareItems.find(
                  (compareItem) => compareItem.id === product.id
                )
              }
              titlePriceClass={titlePriceClass}
            />
          </div>
        );
      })}
    </Fragment>
  );
};

ProductGridTwo.propTypes = {
  sliderClassName: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  colorClass: PropTypes.string,
  titlePriceClass: PropTypes.string,
  category: PropTypes.string,
  type: PropTypes.string,
  limit: PropTypes.number,
  products: PropTypes.array
};

export default ProductGridTwo;
