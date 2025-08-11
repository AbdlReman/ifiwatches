import { Fragment, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { getDiscountPrice } from "../../helpers/product";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import emailjs from "emailjs-com";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import { deleteAllFromCart } from "../../store/slices/cart-slice";
import { EMAILJS_CONFIG } from "../../config/emailjs";
import contentfulClient from "../../data/contentful";

// Initialize EmailJS with your brand configuration
emailjs.init("uOGdgPbVqeIsG8gD8");

const Checkout = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    whatsappNumber: "",
    country: "Pakistan",
    streetAddress: "",
    streetAddress2: "",
    city: "",
    state: "",
    postcode: "",
    phone: "",
    email: "",
    orderNotes: "",
    paymentMethod: "cash_on_delivery",
    transactionId: "",
  });

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, type: 'percent' | 'amount', value }
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const { pathname } = useLocation();
  const currency = useSelector((state) => state.currency);
  const { cartItems } = useSelector((state) => state.cart);

  let cartTotalPrice = 0;

  // Helpers to calculate prices (shared by UI and submission)
  const calculateItemFinalUnitPrice = (item) => {
    const discountedPrice = getDiscountPrice(item.price, item.discount);
    const base =
      (discountedPrice != null ? discountedPrice : item.price) *
      currency.currencyRate;
    return parseFloat(Number(base).toFixed(2));
  };

  const calculateSubtotal = () => {
    if (!cartItems || cartItems.length === 0) return 0;
    return cartItems.reduce((sum, item) => {
      const giftBoxPerUnit =
        item.includeGiftBox && item.giftBoxPrice > 0
          ? item.giftBoxPrice * currency.currencyRate
          : 0;
      return (
        sum + (calculateItemFinalUnitPrice(item) + giftBoxPerUnit) * item.quantity
      );
    }, 0);
  };

  const subtotalDisplay = parseFloat(calculateSubtotal().toFixed(2));
  const discountDisplay = appliedCoupon
    ? parseFloat(
        (
          appliedCoupon.type === "percent"
            ? (subtotalDisplay * appliedCoupon.value) / 100
            : appliedCoupon.value
        ).toFixed(2)
      )
    : 0;
  const grandTotalDisplay = parseFloat(
    Math.max(subtotalDisplay - discountDisplay, 0).toFixed(2)
  );

  // Show welcome toast when component mounts (only once)
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      toast.info(
        `Welcome to checkout! You have ${cartItems.length} item(s) in your cart.`
      );
    }
  }, [cartItems]); // Added cartItems to dependency array

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    // Validate required fields
    const requiredFields = [
      "firstName",
      "lastName",
      "country",
      "streetAddress",
      "city",
      "phone",
      "email",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return;
    }

    // Validate transaction ID for online payments
    if (
      formData.paymentMethod !== "cash_on_delivery" &&
      !formData.transactionId
    ) {
      toast.error("Please enter your transaction ID for online payment");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Processing your order...");

    // Create order summary with proper discount calculation (include gift box)
    let giftBoxTotalAccumulator = 0;
    const orderSummary = cartItems.map((item) => {
      const finalProductPrice = (item.price * currency.currencyRate).toFixed(2);
      const discountedPrice = getDiscountPrice(item.price, item.discount);
      const finalDiscountedPrice = discountedPrice 
        ? (discountedPrice * currency.currencyRate).toFixed(2)
        : finalProductPrice;
      
      const giftBoxPerUnit =
        item.includeGiftBox && item.giftBoxPrice > 0
          ? (item.giftBoxPrice * currency.currencyRate).toFixed(2)
          : 0;
      if (giftBoxPerUnit > 0) {
        giftBoxTotalAccumulator += parseFloat(giftBoxPerUnit) * item.quantity;
      }
      
      const itemTotal = (
        parseFloat(finalDiscountedPrice) * item.quantity +
        parseFloat(giftBoxPerUnit) * item.quantity
      ).toFixed(2);
      
      return {
        productName: item.name,
        quantity: item.quantity,
        price: finalDiscountedPrice,
        total: itemTotal,
      };
    });

    const total = orderSummary
      .reduce((sum, item) => sum + parseFloat(item.total), 0)
      .toFixed(2);

    const giftBoxTotal = parseFloat(giftBoxTotalAccumulator.toFixed(2));

    // Compute discount and grand total based on applied coupon
    const numericTotal = parseFloat(total);
    const discountAmount = appliedCoupon
      ? parseFloat(
          (
            appliedCoupon.type === "percent"
              ? (numericTotal * appliedCoupon.value) / 100
              : appliedCoupon.value
          ).toFixed(2)
        )
      : 0;
    const grandTotal = parseFloat(Math.max(numericTotal - discountAmount, 0).toFixed(2));

    // Create separate arrays for each column
    const productNames = orderSummary.map((item) => {
      return item.productName; // Return full product name without truncation
    });

    const quantities = orderSummary.map((item) => item.quantity);
    const prices = orderSummary.map((item) => `${"Rs "}${item.price}`);
    const totals = orderSummary.map((item) => `${"Rs "}${item.total}`);
    
    // Join arrays with line breaks for display
    const formattedProductNames = productNames.join("\n");
    const formattedQuantities = quantities.join("\n");
    const formattedPrices = prices.join("\n");
    const formattedTotals = totals.join("\n");

    // Get payment method display name
    const getPaymentMethodName = (method) => {
      switch (method) {
        case "cash_on_delivery":
          return "Cash on Delivery";
        case "easypaisa":
          return "Easy Paisa";
        case "jazzcash":
          return "Jazz Cash";
        case "bank":
          return "Bank Transfer";
        default:
          return method;
      }
    };

    // Log the data to be sent for debugging
    console.log("FormData:", {
      ...formData,
      productNames: formattedProductNames,
      quantities: formattedQuantities,
      prices: formattedPrices,
      totals: formattedTotals,
      subtotal: total,
      discount: discountAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      giftBoxTotal: giftBoxTotal.toFixed(2),
      paymentMethod: getPaymentMethodName(formData.paymentMethod),
    });

    try {
      const result = await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID, // Your service ID
        EMAILJS_CONFIG.ORDER_TEMPLATE_ID, // Your template ID
        {
          brandName: "IFIwatches",
          firstName: formData.firstName,
          lastName: formData.lastName,
          whatsappNumber: formData.whatsappNumber,
          country: formData.country,
          streetAddress: formData.streetAddress,
          streetAddress2: formData.streetAddress2,
          city: formData.city,
          state: formData.state,
          postcode: formData.postcode,
          phone: formData.phone,
          email: formData.email,
          orderNotes: formData.orderNotes,
          paymentMethod: getPaymentMethodName(formData.paymentMethod),
          transactionId: formData.transactionId,
          productNames: formattedProductNames,
          quantities: formattedQuantities,
          prices: formattedPrices,
          totals: formattedTotals,
          subtotal: total, // subtotal before coupon
          total: grandTotal.toFixed(2), // for template compatibility, send final total here
          giftBoxTotal: giftBoxTotal.toFixed(2),
          couponCode: appliedCoupon?.code || "",
          couponType: appliedCoupon?.type || "",
          couponValue: appliedCoupon?.value != null ? String(appliedCoupon.value) : "",
          discount: discountAmount.toFixed(2),
          grandTotal: grandTotal.toFixed(2),
        },
        EMAILJS_CONFIG.PUBLIC_KEY // Your user ID
      );
      console.log("Email sent successfully:", result);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);

      // Clear the cart after successful order placement (without showing cart clear toast)
      dispatch(deleteAllFromCart({ silent: true }));

      // Clear form data
      setFormData({
        firstName: "",
        lastName: "",
        whatsappNumber: "",
        country: "",
        streetAddress: "",
        streetAddress2: "",
        city: "",
        state: "",
        postcode: "",
        phone: "",
        email: "",
        orderNotes: "",
        paymentMethod: "cash_on_delivery",
        transactionId: "",
      });

      // Reset coupon state after successful order
      setAppliedCoupon(null);
      setCouponCode("");
      setCouponError("");

      // Show single success notification
      toast.success("Order completed successfully!", {
        position: "top-center",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error sending email:", error);

      // Dismiss loading toast and show error
      toast.dismiss(loadingToast);
      toast.error("Failed to place order. Please try again.");
    }
  };

  const handleApplyCoupon = async () => {
    const rawCode = couponCode.trim();
    if (!rawCode) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setCouponError("");
    setCouponLoading(true);
    try {
      const normalizedCode = rawCode.toUpperCase();
      const res = await contentfulClient.getEntries({
        content_type: "coupon",
        "fields.code": normalizedCode,
        limit: 1,
      });

      const entry = res?.items?.[0];
      if (!entry) {
        setAppliedCoupon(null);
        setCouponError("Invalid or inactive coupon code");
        return;
      }

      const fields = entry.fields || {};
      const code = (fields.code || "").toUpperCase();
      const type = "percent";
      const value = Number(fields.percentage || 0);
      if (value <= 0 || value > 100) {
        setAppliedCoupon(null);
        setCouponError("Coupon percent must be between 1 and 100");
        return;
      }

      setAppliedCoupon({ code, type, value });
      toast.success(`Coupon applied: ${value}% off`);
    } catch (err) {
      console.error("Coupon apply error", err);
      setCouponError("Failed to validate coupon. Please try again");
      setAppliedCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
    toast.info("Coupon removed");
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Checkout – IFI (Iconic Futures Innovations)"
        description="Complete your purchase at IFI – Iconic Futures Innovations (ifilifestyle). Secure checkout for premium watches, perfumes, men’s fabrics, and accessories with fast nationwide delivery."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Checkout", path: process.env.PUBLIC_URL + pathname },
          ]}
        />
        <div className="checkout-area pt-95 pb-100">
          <div className="container">
            {cartItems && cartItems.length >= 1 ? (
              <form onSubmit={handleSubmit}>
                {" "}
                <div className="row">
                  <div className="col-lg-7">
                    <div className="billing-info-wrap">
                      <h3>Billing Details</h3>
                      <div className="row">
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>First Name *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Last Name *</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>WhatsApp Number</label>
                            <input
                              type="text"
                              name="whatsappNumber"
                              value={formData.whatsappNumber}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-select mb-20">
                            <label>Country *</label>
                            <select
                              name="country"
                              value={formData.country}
                              onChange={handleChange}
                            >
                              <option value="">Select a country</option>
                              <option value="Pakistan">Pakistan</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>Street Address *</label>
                            <input
                              className="billing-address"
                              placeholder="House number and street name"
                              type="text"
                              name="streetAddress"
                              value={formData.streetAddress}
                              onChange={handleChange}
                            />
                            <input
                              placeholder="Apartment, suite, unit etc."
                              type="text"
                              name="streetAddress2"
                              value={formData.streetAddress2}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="billing-info mb-20">
                            <label>City *</label>
                            <input
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>State</label>
                            <input
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Postcode / ZIP</label>
                            <input
                              type="text"
                              name="postcode"
                              value={formData.postcode}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Phone *</label>
                            <input
                              type="text"
                              name="phone"
                              value={formData.phone}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-6 col-md-6">
                          <div className="billing-info mb-20">
                            <label>Email Address *</label>
                            <input
                              type="text"
                              name="email"
                              value={formData.email}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="additional-info-wrap">
                        <h4>Additional information</h4>
                        <div className="additional-info">
                          <label>Order notes</label>
                          <textarea
                            placeholder="Notes about your order, e.g. special notes for delivery."
                            name="orderNotes"
                            value={formData.orderNotes}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-lg-5">
                    <div className="your-order-area">
                      <h3>Your order</h3>
                      <div className="your-order-wrap gray-bg-4">
                        <div className="your-order-product-info">
                          <div className="your-order-top">
                            <ul>
                              <li>Product</li>
                              <li>Total</li>
                            </ul>
                          </div>
                          <div className="your-order-middle">
                            <ul>
                              {cartItems.map((cartItem, key) => {
                                const discountedPrice = getDiscountPrice(
                                  cartItem.price,
                                  cartItem.discount
                                );
                                const finalProductPrice = (
                                  cartItem.price * currency.currencyRate
                                ).toFixed(2);
                                const finalDiscountedPrice = (
                                  discountedPrice * currency.currencyRate
                                ).toFixed(2);

                                discountedPrice != null
                                  ? (cartTotalPrice +=
                                      finalDiscountedPrice * cartItem.quantity)
                                  : (cartTotalPrice +=
                                      finalProductPrice * cartItem.quantity);
                                return (
                                  <li key={key}>
                                    <span className="order-middle-left">
                                      {cartItem.name} X {cartItem.quantity}
                                    </span>{" "}
                                    <span className="order-price">
                                      {discountedPrice !== null
                                        ? "Rs " +
                                          (
                                            finalDiscountedPrice *
                                            cartItem.quantity
                                          ).toFixed(2)
                                        : "Rs " +
                                          (
                                            finalProductPrice *
                                            cartItem.quantity
                                          ).toFixed(2)}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                          {/* Coupon input */}
                          <div className="coupon-area">
                            <label htmlFor="coupon">Coupon code</label>
                            <div className="coupon-controls">
                              <input
                                id="coupon"
                                type="text"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value)}
                                placeholder="Enter coupon code"
                              />
                              {!appliedCoupon ? (
                                <button
                                  type="button"
                                  className="btn-hover coupon-apply"
                                  onClick={handleApplyCoupon}
                                  disabled={couponLoading || !couponCode.trim()}
                                >
                                  {couponLoading ? "Applying..." : "Apply"}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-hover coupon-remove"
                                  onClick={handleRemoveCoupon}
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            {couponError && (
                              <p className="coupon-error">{couponError}</p>
                            )}
                            {appliedCoupon && (
                              <p className="coupon-success">
                                Applied {appliedCoupon.code}: {" "}
                                {appliedCoupon.type === "percent"
                                  ? `${appliedCoupon.value}% off`
                                  : `Rs ${appliedCoupon.value} off`}
                              </p>
                            )}
                          </div>
                          <div className="your-order-bottom">
                            <ul>
                              <li className="your-order-shipping">Shipping</li>
                              <li>Free shipping</li>
                            </ul>
                          </div>
                          <div className="your-order-subtotal">
                            <ul>
                              <li className="order-subtotal">Subtotal</li>
                              <li>{"Rs " + subtotalDisplay.toFixed(2)}</li>
                            </ul>
                          </div>
                          {discountDisplay > 0 && (
                            <div className="your-order-discount">
                              <ul>
                                <li className="order-discount">Discount</li>
                                <li>{"- Rs " + discountDisplay.toFixed(2)}</li>
                              </ul>
                            </div>
                          )}
                          <div className="your-order-total">
                            <ul>
                              <li className="order-total">Total</li>
                              <li>{"Rs " + grandTotalDisplay.toFixed(2)}</li>
                            </ul>
                          </div>
                        </div>

                        {/* Payment Method Section */}
                        <div className="payment-method">
                          <h4>Payment Method</h4>
                          <div className="payment-options">
                            <div className="payment-option mb-20">
                              <div className="radio-wrapper">
                                <input
                                  type="radio"
                                  id="cash_on_delivery"
                                  name="paymentMethod"
                                  value="cash_on_delivery"
                                  checked={
                                    formData.paymentMethod ===
                                    "cash_on_delivery"
                                  }
                                  onChange={handleChange}
                                  className="custom-radio"
                                />
                                <label
                                  htmlFor="cash_on_delivery"
                                  className="radio-label"
                                >
                                  Cash on Delivery
                                </label>
                              </div>
                            </div>

                            <div className="payment-option mb-20">
                              <div className="radio-wrapper">
                                <input
                                  type="radio"
                                  id="easypaisa"
                                  name="paymentMethod"
                                  value="easypaisa"
                                  checked={
                                    formData.paymentMethod === "easypaisa"
                                  }
                                  onChange={handleChange}
                                  className="custom-radio"
                                />
                                <label
                                  htmlFor="easypaisa"
                                  className="radio-label"
                                >
                                  Easy Paisa
                                </label>
                              </div>
                              {formData.paymentMethod === "easypaisa" && (
                                <div className="payment-details">
                                  <p>
                                    <strong>Account:</strong> 03108111554
                                  </p>
                                  <p>
                                    <strong>Account Holder:</strong> Asiya bibi
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="payment-option mb-20">
                              <div className="radio-wrapper">
                                <input
                                  type="radio"
                                  id="jazzcash"
                                  name="paymentMethod"
                                  value="jazzcash"
                                  checked={
                                    formData.paymentMethod === "jazzcash"
                                  }
                                  onChange={handleChange}
                                  className="custom-radio"
                                />
                                <label
                                  htmlFor="jazzcash"
                                  className="radio-label"
                                >
                                  Jazz Cash
                                </label>
                              </div>
                              {formData.paymentMethod === "jazzcash" && (
                                <div className="payment-details">
                                  <p>
                                    <strong>Account:</strong> 03287818894
                                  </p>
                                  <p>
                                    <strong>Account Holder:</strong> Iqra
                                    siddique
                                  </p>
                                </div>
                              )}
                            </div>

                            <div className="payment-option mb-20">
                              <div className="radio-wrapper">
                                <input
                                  type="radio"
                                  id="bank"
                                  name="paymentMethod"
                                  value="bank"
                                  checked={formData.paymentMethod === "bank"}
                                  onChange={handleChange}
                                  className="custom-radio"
                                />
                                <label htmlFor="bank" className="radio-label">
                                  Bank Transfer
                                </label>
                              </div>
                              {formData.paymentMethod === "bank" && (
                                <div className="payment-details">
                                  <p>
                                    <strong>Account Holder:</strong> ASIA BIBI
                                  </p>
                                  <p>
                                    <strong>Bank:</strong> Meezan
                                    Bank-MAMUKANJAN BRANCH
                                  </p>
                                  <p>
                                    <strong>Account Number:</strong>{" "}
                                    98980106494041
                                  </p>
                                  <p>
                                    <strong>IBAN:</strong>{" "}
                                    PK73MEZN0098980106494041
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Transaction ID Field for Online Payments */}
                          {formData.paymentMethod !== "cash_on_delivery" && (
                            <div className="transaction-id-field mt-20">
                              <label>Transaction ID / TRX ID *</label>
                              <input
                                type="text"
                                name="transactionId"
                                value={formData.transactionId}
                                onChange={handleChange}
                                placeholder="Enter your transaction ID"
                                className="w-100"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="place-order mt-25">
                        <button className="btn-hover" type="submit">
                          Place Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="row">
                <div className="col-lg-12">
                  <div className="item-empty-area text-center">
                    <div className="item-empty-area__icon mb-30">
                      <i className="pe-7s-cash"></i>
                    </div>
                    <div className="item-empty-area__text">
                      No items found in cart to checkout <br />{" "}
                      <Link to={process.env.PUBLIC_URL + "/shop"}>
                        Shop Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Custom CSS for Payment Method Styling */}
        <style jsx>{`
          .payment-method {
            margin-top: 20px;
            padding: 20px;
            border-top: 1px solid #e8e8e8;
          }

          .payment-method h4 {
            margin-bottom: 15px;
            font-size: 16px;
            font-weight: 600;
            color: #333;
          }

          .payment-options {
            display: flex;
            flex-direction: column;
            gap: 10px;
          }

          .payment-option {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }

          .radio-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 5px;
          }

          .custom-radio {
            width: 16px;
            height: 16px;
            margin: 0;
            cursor: pointer;
            // accent-color: #f7941d;
          }

          .radio-label {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            cursor: pointer;
            margin: 0;
            line-height: 1.2;
          }

          .payment-details {
            margin-left: 24px;
            margin-top: 8px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 4px;
            border-left: 3px solid #f7941d;
          }

          .payment-details p {
            margin: 0 0 5px 0;
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }

          .payment-details p:last-child {
            margin-bottom: 0;
          }

          .transaction-id-field {
            margin-top: 15px;
          }

          .transaction-id-field label {
            display: block;
            margin-bottom: 5px;
            font-size: 14px;
            font-weight: 500;
            color: #333;
          }

          .transaction-id-field input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }

          .transaction-id-field input:focus {
            outline: none;
            border-color: #f7941d;
            box-shadow: 0 0 0 1px rgba(247, 148, 29, 0.1);
          }

          /* Coupon */
          .coupon-area {
            margin: 15px 0 0 0;
            padding: 10px 0 0 0;
            border-top: 1px dashed #e8e8e8;
          }
          .coupon-area label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 6px;
          }
          .coupon-controls {
            display: flex;
            gap: 10px;
          }
          .coupon-controls input[type="text"] {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
          }
          .coupon-controls .coupon-apply,
          .coupon-controls .coupon-remove {
            padding: 8px 14px;
            font-size: 14px;
          }
          .coupon-error {
            color: #d9534f;
            font-size: 12px;
            margin-top: 6px;
          }
          .coupon-success {
            color: #28a745;
            font-size: 12px;
            margin-top: 6px;
          }
        `}</style>
      </LayoutOne>
    </Fragment>
  );
};

export default Checkout;
