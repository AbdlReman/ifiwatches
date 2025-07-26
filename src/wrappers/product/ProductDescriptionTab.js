import React from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

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
                    <div dangerouslySetInnerHTML={{ __html: productFullDesc }} />
                  ) : (
                    <p>No description available for this product.</p>
                  )}
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

