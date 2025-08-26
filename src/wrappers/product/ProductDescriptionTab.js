import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import ProductVideo from "../../components/product/ProductVideo";

const ProductDescriptionTab = ({ spaceBottomClass, productFullDesc, product }) => {
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
              <Tab.Pane eventKey="productDescription">
                <div className="product-description">
                  {productFullDesc ? (
                    <div 
                      className="rich-text-content"
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

