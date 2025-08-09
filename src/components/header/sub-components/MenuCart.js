import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDiscountPrice } from "../../../helpers/product";
import { deleteFromCart } from "../../../store/slices/cart-slice";

const MenuCart = () => {
  const dispatch = useDispatch();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);
  
  const cartTotalPrice = cartItems.reduce((total, item) => {
    const discountedPrice = getDiscountPrice(item.price, item.discount);
    const baseUnit = (discountedPrice != null ? discountedPrice : item.price) * (currency?.currencyRate || 1);
    const giftUnit = item.includeGiftBox && item.giftBoxPrice > 0
      ? item.giftBoxPrice * (currency?.currencyRate || 1)
      : 0;
    return total + (baseUnit + giftUnit) * item.quantity;
  }, 0);

  return (
    <div className="shopping-cart-content">
      {cartItems && cartItems.length > 0 ? (
        <Fragment>
          <ul>
            {cartItems.map((item) => {
              const discountedPrice = getDiscountPrice(
                item.price,
                item.discount
              );
              const finalProductPrice = (
                item.price * (currency?.currencyRate || 1)
              ).toFixed(2);
              const finalDiscountedPrice = discountedPrice
                ? (discountedPrice * (currency?.currencyRate || 1)).toFixed(2)
                : finalProductPrice;

              const giftBoxPerUnit =
                item.includeGiftBox && item.giftBoxPrice > 0
                  ? (item.giftBoxPrice * (currency?.currencyRate || 1)).toFixed(2)
                  : 0;

              const baseUnitPrice = parseFloat(
                discountedPrice ? finalDiscountedPrice : finalProductPrice
              );
              const itemUnitPrice = baseUnitPrice.toFixed(2);

              return (
                <li className="single-shopping-cart" key={item.cartItemId}>
                  <div className="shopping-cart-img">
                    <Link to={process.env.PUBLIC_URL + "/product/" + item.slug}>
                      <img
                        alt={item.name}
                        src={item.image || item.images?.[0] || '/assets/img/product/default-product.jpg'}
                        className="img-fluid"
                        onError={(e) => {
                          e.target.src = '/assets/img/product/default-product.jpg';
                        }}
                      />
                    </Link>
                  </div>
                  <div className="shopping-cart-title">
                    <h4>
                      <Link
                        to={process.env.PUBLIC_URL + "/product/" + item.slug}
                      >
                        {item.name}
                      </Link>
                    </h4>
                    <h6>Qty: {item.quantity}</h6>
                    <span>{"Rs " + itemUnitPrice}</span>
                    {item.includeGiftBox && item.giftBoxPrice > 0 && (
                      <div className="cart-item-variation">
                        <span>Gift box: + Rs {parseFloat(giftBoxPerUnit).toFixed(2)}</span>
                      </div>
                    )}
                    {item.selectedProductColor && (
                      <div className="cart-item-variation">
                        <span>Color: {item.selectedProductColor}</span>
                      </div>
                    )}
                    {item.selectedProductSize && (
                      <div className="cart-item-variation">
                        <span>Size: {item.selectedProductSize}</span>
                      </div>
                    )}
                  </div>
                  <div className="shopping-cart-delete">
                    <button onClick={() => dispatch(deleteFromCart(item.cartItemId))}>
                      <i className="fa fa-times-circle" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="shopping-cart-total">
            <h4>
              Total :{" "}
              <span className="shop-total">
                                              {"Rs "+ cartTotalPrice.toFixed(2)}
              </span>
            </h4>
          </div>
          <div className="shopping-cart-btn btn-hover text-center">
            <Link className="default-btn" to={process.env.PUBLIC_URL + "/cart"}>
              view cart
            </Link>
            <Link
              className="default-btn"
              to={process.env.PUBLIC_URL + "/checkout"}
            >
              checkout
            </Link>
          </div>
        </Fragment>
      ) : (
        <p className="text-center">No items added to cart</p>
      )}
    </div>
  );
};

export default MenuCart;
