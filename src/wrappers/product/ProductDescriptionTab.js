import React, { useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ProductVideo from "../../components/product/ProductVideo";
import "../../assets/css/rich-text.css";

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, product }) => {
  const [expandedByIndex, setExpandedByIndex] = useState({});

  const toggleExpand = (idx) => {
    setExpandedByIndex((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303C33.826,32.206,29.373,36,24,36c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.535,6.053,29.535,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C34.535,6.053,29.535,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.289,0,10.123-2.021,13.77-5.311l-6.357-5.383C29.421,34.954,26.833,36,24,36 c-5.342,0-9.803-3.607-11.387-8.517l-6.49,5.005C9.435,39.556,16.142,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.086,3.206-3.5,5.754-6.59,7.306l6.357,5.383 C37.842,39.237,44,34.667,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

  const ReviewCard = ({ review, index }) => {
    const rating = Math.max(0, Math.min(5, Number(review?.rating || 0)));
    const filled = "★".repeat(Math.round(rating));
    const empty = "☆".repeat(5 - Math.round(rating));
    const isExpanded = !!expandedByIndex[index];
    const text = review?.text || "";
    const shouldTruncate = text.length > 140;
    const displayText = isExpanded || !shouldTruncate ? text : text.slice(0, 140) + "…";
    const avatarUrl = review?.photoUrl;
    const initials = (review?.authorName || "?").trim().charAt(0).toUpperCase();

    return (
      <li className="mb-4 p-3" style={{ border: '1px solid #eee', borderRadius: 10, boxShadow: '0 1px 2px rgba(0,0,0,0.06)' }}>
        <div className="d-flex align-items-center mb-2">
          <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', background: '#e8f0fe', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={review?.authorName || 'User'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--bs-primary)', fontWeight: 700 }}>{initials}</span>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
              {review?.authorName || 'Anonymous'}
              <span style={{ width: 14, height: 14, borderRadius: '50%', background: 'var(--bs-primary)', display: 'inline-block' }} />
            </div>
            <div style={{ color: '#fbbc04' }}>{filled}{empty}</div>
          </div>
          {review?.relativeTimeDescription && (
            <div className="text-muted" style={{ fontSize: 12 }}>{review.relativeTimeDescription}</div>
          )}
        </div>
        {displayText && (
          <div style={{ color: '#3c4043' }}>
            {displayText}
            {shouldTruncate && (
              <>
                {!isExpanded && (
                  <button type="button" className="btn btn-link p-0 ms-1" style={{ fontSize: 13 }} onClick={() => toggleExpand(index)}>Read more</button>
                )}
                {isExpanded && (
                  <button type="button" className="btn btn-link p-0 ms-1" style={{ fontSize: 13 }} onClick={() => toggleExpand(index)}>Show less</button>
                )}
              </>
            )}
          </div>
        )}
        <div className="d-flex align-items-center mt-3" style={{ gap: 8, color: '#5f6368', fontSize: 12 }}>
          <GoogleIcon />
          <span>Posted on Google</span>
        </div>
      </li>
    );
  };
  return (
    <div className={clsx("description-review-area", spaceBottomClass)}>
      <div className="container">
        <div className="description-review-wrapper">
          <Tab.Container defaultActiveKey="productDescription">
            <Nav variant="pills" className="description-review-topbar">
              <Nav.Item>
                <Nav.Link eventKey="additionalInfo">Additional Information</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="productDescription">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="paymentReturns">Payment & Returns</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="reviews">Reviews</Nav.Link>
              </Nav.Item>
            </Nav>
            <Tab.Content className="description-review-bottom">
              <Tab.Pane eventKey="additionalInfo">
                <div className="product-anotherinfo-wrapper">
                  <ul>
                    {product?.category && product.category.length > 0 && (
                      <li><span>Categories</span> {product.category.join(", ")}</li>
                    )}
                    {product?.tag && product.tag.length > 0 && (
                      <li><span>Tags</span> {product.tag.join(", ")}</li>
                    )}
                    {product?.color && product.color.length > 0 && (
                      <li><span>Available Colors</span> {product.color.join(", ")}</li>
                    )}
                    {product?.size && product.size.length > 0 && (
                      <li><span>Available Sizes</span> {product.size.join(", ")}</li>
                    )}
                    {product?.stock !== undefined && (
                      <li><span>Stock</span> {product.stock} units</li>
                    )}
                    {product?.price && (
                      <li><span>Price</span> Rs {product.price}</li>
                    )}
                    {product?.discount && product.discount > 0 && (
                      <li><span>Discount</span> {product.discount}% off</li>
                    )}
                  </ul>
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="reviews">
                <div className="product-reviews">
                  {product?.googleReviewsEmbedHtml ? (
                    <div
                      className="google-reviews-embed"
                      style={{
                        width: '100%',
                        minHeight: '300px',
                        border: '1px solid #eee',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        background: '#fff'
                      }}
                      dangerouslySetInnerHTML={{ __html: product.googleReviewsEmbedHtml }}
                    />
                  ) : product?.googleReviews && Array.isArray(product.googleReviews) && product.googleReviews.length > 0 ? (
                    <div className="google-reviews-list">
                      {product?.googleReviewsAverage && (
                        <div className="mb-3" style={{ fontWeight: 600 }}>
                          Customer Reviews · {Number(product.googleReviewsAverage).toFixed(1)}
                        </div>
                      )}
                      <ul className="list-unstyled">
                        {product.googleReviews.slice(0, 5).map((rev, idx) => (
                          <ReviewCard key={idx} review={rev} index={idx} />
                        ))}
                      </ul>
                      <div className="text-center">
                        <a
                          href="https://g.page/r/CTEL6bhdgsUaEAE/reviewq"
                          target="_blank"
                          rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ backgroundColor: '#daaa58', borderColor: '#daaa58', color: '#fff' }}
                        >
                          View All Reviews on Google
                        </a>
                      </div>
                    </div>
                  ) : (
                    (() => {
                      const staticReviewsAverage = 5.0;
                      const staticReviews = [
                        {
                          authorName: 'Arif Ullah',
                          rating: 5,
                          text: 'Recommended IFI brand. Best quality & services. Personally experienced'
                        },
                        {
                          authorName: 'Jabran Alam',
                          rating: 5,
                          text: 'outstanding services and watches quality. recommended brands ifi'
                        },
                        {
                          authorName: 'Hannan Raja',
                          rating: 5,
                          text: 'Best services',
                          ownerReply: { text: 'Thank you for your review', relativeTime: '2 weeks ago' }
                        },
                        {
                          authorName: 'Ibrar Ullah',
                          rating: 5,
                          text: 'Best quality',
                          ownerReply: { text: 'Thank you for your review', relativeTime: '2 weeks ago' }
                        }
                      ];
                      return (
                        <div className="google-reviews-list">
                          <div className="mb-3" style={{ fontWeight: 600 }}>
                            Customer Reviews · {staticReviewsAverage.toFixed(1)}
                          </div>
                          <ul className="list-unstyled">
                            {staticReviews.map((rev, idx) => (
                              <ReviewCard key={idx} review={rev} index={`s-${idx}`} />
                            ))}
                          </ul>
                          <div className="text-center">
                            <a
                              href= "https://www.google.com/maps/place/ifilifestyle.com/@33.7161085,73.0826716,17z/data=!4m8!3m7!1s0x38dfbfd2937503d5:0x1ac5825db8e90b31!8m2!3d33.7161085!4d73.0852465!9m1!1b1!16s%2Fg%2F11x_8t659f?entry=ttu&g_ep=EgoyMDI1MTAyMi4wIKXMDSoASAFQAw%3D%3D"
                              target="_blank"
                              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ backgroundColor: '#daaa58', borderColor: '#daaa58', color: '#fff' }}
                            >
                              View All Reviews on Google
                            </a>
                          </div>
                        </div>
                      );
                    })()
                  )}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="productDescription">
                <div className="product-description">
                  {productFullDesc ? (
                    <div 
                      className="rich-text-content"
                      style={{
                        lineHeight: '1.6',
                        fontSize: '14px',
                        color: '#333'
                      }}
                      dangerouslySetInnerHTML={{ __html: productFullDesc }} 
                    />
                  ) : (
                    <p>No description available for this product.</p>
                  )}
                  
                  {/* Product Video Section */}
                  <ProductVideo 
                    videoUrl={product?.video} 
                    spaceBottomClass="mt-30"
                  />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="paymentReturns">
                <div className="payment-returns-info">
                  {/* Payment Options Section */}
                  <div className="payment-section mb-4">
                    <h4 className="mb-3">💳 Payment Options – IFI Lifestyle</h4>
                    <p className="mb-3">We offer flexible payment methods to make your shopping experience smooth and secure.</p>
                    
                    <div className="payment-method mb-4">
                      <h5 className="text-success mb-2">✅ Online Payment (Recommended)</h5>
                      <ul className="list-unstyled ms-3">
                        <li>• Online payment ensures faster processing & delivery of your order.</li>
                        <li>• Our partnered courier services handle prepaid parcels with priority.</li>
                        <li>• This is our recommended option, as it reduces delays and builds trust.</li>
                      </ul>
                    </div>
                    
                    <div className="payment-method mb-4">
                      <h5 className="text-warning mb-2">💵 Cash on Delivery (COD)</h5>
                      <ul className="list-unstyled ms-3">
                        <li>• COD is available for your convenience.</li>
                        <li>• However, in Pakistan, courier companies often provide slower and less reliable service for COD parcels.</li>
                        <li>• For the best experience, we suggest choosing online payment.</li>
                      </ul>
                    </div>
                    
                    <div className="trust-note p-3 bg-light rounded">
                      <p className="mb-0"><strong>✨ At IFI Lifestyle, your trust and satisfaction come first.</strong> We provide secure online transactions and verified courier tracking so you can shop with peace of mind.</p>
                    </div>
                  </div>
                  
                  {/* Return Policy Section */}
                  <div className="return-policy-section">
                    <h4 className="mb-3">📝 IFI Lifestyle – Return & Exchange Policy</h4>
                    <p className="mb-3">At IFI Lifestyle, customer satisfaction is our top priority. If you are not completely satisfied with your purchase, we're here to help.</p>
                    
                    <div className="return-info mb-4">
                      <h5 className="text-success mb-2">✅ Returns & Exchanges</h5>
                      <ul className="list-unstyled ms-3">
                        <li>• You may request a return or exchange within 7 days of receiving your order.</li>
                        <li>• Products must be unused, in original packaging, and with all tags/labels intact.</li>
                        <li>• Returns are only accepted for:</li>
                        <li className="ms-3">• Damaged products on delivery</li>
                        <li className="ms-3">• Wrong product received</li>
                        <li className="ms-3">• Manufacturing defects</li>
                        <li>• If return is due to personal reasons (e.g. not satisfied with the product, change of mind), we will refund/exchange but return delivery charges will be paid by the customer.</li>
                      </ul>
                    </div>
                    
                    <div className="non-returnable mb-4">
                      <h5 className="text-danger mb-2">🚫 Non-Returnable Items</h5>
                      <ul className="list-unstyled ms-3">
                        <li>• Fragrances/Perfumes once opened</li>
                        <li>• Items on clearance or final sale</li>
                        <li>• Products damaged due to misuse</li>
                      </ul>
                    </div>
                    
                    <div className="refund-method mb-4">
                      <h5 className="text-info mb-2">💵 Refund Method</h5>
                      <ul className="list-unstyled ms-3">
                        <li>• Refunds will be issued in the form of store credit, exchange, or bank transfer (processing time 7–10 working days).</li>
                        <li>• Shipping charges are non-refundable.</li>
                      </ul>
                    </div>
                    
                    <div className="return-process mb-4">
                      <h5 className="text-primary mb-2">📦 Return Process</h5>
                      <ol className="ms-3">
                        <li>Contact our customer support at [WhatsApp Number / Email] with your order ID and reason for return.</li>
                        <li>Our team will confirm eligibility and share the return address.</li>
                        <li>Once we receive and inspect the product, your refund/exchange will be processed.</li>
                      </ol>
                    </div>
                    
                    <div className="promise-note p-3 bg-primary text-white rounded">
                      <h5 className="mb-2">🛡️ Our Promise</h5>
                      <p className="mb-0">We are building Pakistan's first multiple future brand store in one place – so your trust matters most. Every product listed at ifilifestyle.com is checked for authenticity and quality.</p>
                    </div>
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </div>
      </div>
    </div>
  );
};

ProductDescriptionTab.propTypes = {
  productFullDesc: PropTypes.string,
  spaceBottomClass: PropTypes.string,
  product: PropTypes.shape({})
};

export default ProductDescriptionTab;

