import React, { Fragment } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { getDiscountPrice, getQuantityDiscountedPrice } from "../../helpers/product";
import { deleteFromCart, updateQuantity, deleteAllFromCart } from "../../store/slices/cart-slice";

const Cart = () => {
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);

  // Safety check for currency
  if (!currency) {
    return (
      <Fragment>
        <SEO titleTemplate="Shopping Cart – IFI (Iconic Futures Innovations)" description="Review your cart at IFI – Iconic Futures Innovations (ifilifestyle). Premium watches, perfumes, men’s fabrics, and accessories with fast nationwide delivery." />
        <LayoutOne headerTop="visible">
          <div className="cart-main-area pt-90 pb-100">
            <div className="container">
              <div className="text-center">
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </LayoutOne>
      </Fragment>
    );
  }

  const handleQuantityChange = (cartItemId, newQuantity) => {
    dispatch(updateQuantity({ cartItemId, quantity: parseInt(newQuantity) }));
  };

  const handleDeleteFromCart = (cartItemId) => {
    dispatch(deleteFromCart(cartItemId));
  };

  const clearCart = () => {
    dispatch(deleteAllFromCart());
  };

  let cartTotalPrice = 0;
  let quantityDiscountTotal = 0;

  return (
    <Fragment>
                <SEO titleTemplate="Shopping Cart – IFI (Iconic Futures Innovations)" description="Review your cart at IFI – Iconic Futures Innovations (ifilifestyle). Premium watches, perfumes, men’s fabrics, and accessories with fast nationwide delivery." />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Cart", path: process.env.PUBLIC_URL + pathname },
          ]}
        />

        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            {cartItems.length > 0 ? (
              <Fragment>
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h3 className="cart-page-title">Your cart items</h3>
                  <button 
                    className="btn btn-danger" 
                    onClick={clearCart}
                    style={{ fontSize: '14px', padding: '8px 16px' }}
                  >
                    Clear Cart
                  </button>
                </div>
                <div className="table-content table-responsive cart-table-content">
                  <table>
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Unit Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item, key) => {
                        const discountedPrice = getDiscountPrice(
                          item.price,
                          item.discount
                        );
                        const basePrice = discountedPrice != null ? discountedPrice : item.price;
                        const quantityDiscountedPrice = getQuantityDiscountedPrice(basePrice, item.quantity);
                        
                        const finalProductPrice = (
                          item.price * currency.currencyRate
                        ).toFixed(2);
                        const finalDiscountedPrice = discountedPrice
                          ? (discountedPrice * currency.currencyRate).toFixed(2)
                          : null;
                        const finalQuantityDiscountedPrice = (
                          quantityDiscountedPrice * currency.currencyRate
                        ).toFixed(2);

                        const giftBoxPerUnit =
                          item.includeGiftBox && item.giftBoxPrice > 0
                            ? (item.giftBoxPrice * currency.currencyRate).toFixed(2)
                            : 0;

                        const baseUnitPrice = parseFloat(finalQuantityDiscountedPrice);
                        const unitPriceWithGift = (baseUnitPrice + parseFloat(giftBoxPerUnit || 0)).toFixed(2);

                        const subtotal = (parseFloat(unitPriceWithGift) * item.quantity).toFixed(2);

                        cartTotalPrice += parseFloat(unitPriceWithGift) * item.quantity;
                        
                        // Calculate quantity discount savings
                        const originalPrice = parseFloat(discountedPrice ? finalDiscountedPrice : finalProductPrice);
                        const quantityDiscountSavings = (originalPrice * item.quantity) - (parseFloat(finalQuantityDiscountedPrice) * item.quantity);
                        quantityDiscountTotal += quantityDiscountSavings;

                        return (
                          <tr key={key}>
                            <td className="product-thumbnail">
                              <Link to={`/product/${item.slug}`}>
                                <img
                                  className="img-fluid"
                                  src={item.image || item.images?.[0] || '/assets/img/product/default-product.jpg'}
                                  alt={item.name}
                                  onError={(e) => {
                                    e.target.src = '/assets/img/product/default-product.jpg';
                                  }}
                                  style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                              </Link>
                            </td>
                            <td className="product-name">
                              <Link to={`/product/${item.slug}`}>
                                {item.name}
                              </Link>
                              {item.selectedProductColor && (
                                <div className="cart-item-variation">
                                  <small>Color: {item.selectedProductColor}</small>
                                </div>
                              )}
                              {item.selectedProductSize && (
                                <div className="cart-item-variation">
                                  <small>Size: {item.selectedProductSize}</small>
                                </div>
                              )}
                              {item.includeGiftBox && item.giftBoxPrice > 0 && (
                                <div className="cart-item-variation">
                                  <small>Gift box: + Rs {(item.giftBoxPrice * currency.currencyRate).toFixed(2)} per unit</small>
                                </div>
                              )}
                            </td>
                            <td className="product-price-cart">
                              {discountedPrice ? (
                                <Fragment>
                                  <span className="amount old">
                                    {"Rs " + finalProductPrice}
                                  </span>
                                  <span className="amount">
                                    {"Rs " + finalQuantityDiscountedPrice}
                                  </span>
                                </Fragment>
                              ) : (
                                <span className="amount">
                                  {"Rs " + finalQuantityDiscountedPrice}
                                </span>
                              )}
                            </td>
                            <td className="product-quantity">
                              <div className="cart-plus-minus">
                                <button
                                  onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                                  className="dec qtybutton"
                                  style={{ 
                                    border: 'none', 
                                    background: '#f5f5f5', 
                                    padding: '5px 10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  -
                                </button>
                                <input
                                  className="cart-plus-minus-box"
                                  type="text"
                                  value={item.quantity}
                                  onChange={(e) => handleQuantityChange(item.cartItemId, e.target.value)}
                                  style={{ 
                                    width: '50px', 
                                    textAlign: 'center', 
                                    border: '1px solid #ddd',
                                    padding: '5px'
                                  }}
                                />
                                <button
                                  onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                                  className="inc qtybutton"
                                  style={{ 
                                    border: 'none', 
                                    background: '#f5f5f5', 
                                    padding: '5px 10px',
                                    cursor: 'pointer'
                                  }}
                                >
                                  +
                                </button>
                              </div>
                            </td>
                            <td className="product-subtotal">
                              {"Rs " + subtotal}
                            </td>
                            <td className="product-remove">
                              <button 
                                onClick={() => handleDeleteFromCart(item.cartItemId)}
                                style={{ 
                                  border: 'none', 
                                  background: 'none', 
                                  color: '#ff0000',
                                  cursor: 'pointer',
                                  fontSize: '18px'
                                }}
                              >
                                <i className="fa fa-times"></i>
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grand-totall mt-4">
                  <h4 className="cart-bottom-title section-bg-gary-cart">
                    Cart Total
                  </h4>
                  <h5>
                    Total products:{" "}
                    <span>
                      {"Rs " + cartTotalPrice.toFixed(2)}
                    </span>
                  </h5>
                  {quantityDiscountTotal > 0 && (
                    <h5 style={{ color: '#28a745' }}>
                      Quantity Discount Savings:{" "}
                      <span>
                        {"Rs " + quantityDiscountTotal.toFixed(2)}
                      </span>
                    </h5>
                  )}
                  <h4>
                    Grand Total:{" "}
                    <span>
                      {"Rs " + cartTotalPrice.toFixed(2)}
                    </span>
                  </h4>
                  <Link to="/checkout" className="btn btn-primary">
                    Proceed to Checkout
                  </Link>
                </div>
              </Fragment>
            ) : (
              <div className="item-empty-area text-center">
                <div className="item-empty-area__icon mb-30">
                  <i className="pe-7s-cart"></i>
                </div>
                <div className="item-empty-area__text">
                  No items found in cart <br />
                  <Link to="/shop" className="btn btn-primary mt-3">
                    Shop Now
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Cart;
