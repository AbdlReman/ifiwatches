import PropTypes from "prop-types";
import clsx from "clsx";
import { Link } from "react-router-dom";

const FooterOne = ({
  backgroundColorClass,
  spaceTopClass,
  spaceBottomClass,
  spaceLeftClass,
  spaceRightClass,
  containerClass,
  extraFooterClass,
  sideMenu
}) => {
  return (
    <footer className={clsx("footer-area", backgroundColorClass, spaceTopClass, spaceBottomClass, extraFooterClass, spaceLeftClass, spaceRightClass )}>
      <div className={`${containerClass ? containerClass : "container"}`}>
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer-widget mb-30 text-center text-sm-start">
              <div className="footer-logo mb-20">
                <Link to={process.env.PUBLIC_URL + "/"}>
                  <img 
                    alt="IFIwatches" 
                    src={process.env.PUBLIC_URL + "/assets/img/logo/logo.png"}
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                </Link>
              </div>
              <div className="footer-widget">
                <p className="mt-20">
                  &copy; {new Date().getFullYear()}{" "}
                  <Link to={process.env.PUBLIC_URL + "/"}>
                    IFIwatches
                  </Link>
                  . All Rights Reserved
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer-widget mb-30 text-center text-sm-start">
              <div className="footer-title">
                <h3>MAIN PAGES</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/"}>Home</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/shop"}>Shop</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/about"}>About Us</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/contact"}>Contact</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer-widget mb-30 text-center text-sm-start">
              <div className="footer-title">
                <h3>ACCOUNT</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/cart"}>Cart</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/checkout"}>Checkout</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/wishlist"}>Wishlist</Link>
                  </li>
                  <li>
                    <Link to={process.env.PUBLIC_URL + "/compare"}>Compare</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer-widget mb-30 text-center text-sm-start">
              <div className="footer-title">
                <h3>CONTACT INFO</h3>
              </div>
              <div className="footer-list">
                <ul>
                  <li>
                    <i className="fa fa-phone"></i>{" "}
                    <a href="tel://03180977696">03180977696</a>
                  </li>
                  <li>
                    <i className="fa fa-phone"></i>{" "}
                    <a href="tel://03180977696">03180977696</a>
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i>{" "}
                    <a href="mailto:info@ifilifestyle.com">info@ifilifestyle.com</a>
                  </li>
                  <li>
                    <i className="fa fa-envelope"></i>{" "}
                    <a href="mailto:support@ifilifestyle.com">support@ifilifestyle.com</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

FooterOne.propTypes = {
  backgroundColorClass: PropTypes.string,
  containerClass: PropTypes.string,
  extraFooterClass: PropTypes.string,
  sideMenu: PropTypes.bool,
  spaceBottomClass: PropTypes.string,
  spaceLeftClass: PropTypes.string,
  spaceRightClass: PropTypes.string,
  spaceTopClass: PropTypes.string
};

export default FooterOne;
