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
                    alt="IFILifestyle" 
                    src={process.env.PUBLIC_URL + "/assets/img/logo/logo.png"}
                    style={{ maxWidth: "150px", height: "auto" }}
                  />
                </Link>
              </div>
              <div className="footer-widget">
                <p className="mt-20">
                  &copy; {new Date().getFullYear()}{" "}
                  <Link to={process.env.PUBLIC_URL + "/"}>
                    IFILifestyle
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
                    <a href="tel://+923360054420">+923360054420</a>
                  </li>
                 
                 
                  <li>
                    <i className="fa fa-envelope"></i>{" "}
                    <a href="mailto:support@ifilifestyle.com">support@ifilifestyle.com</a>
                  </li>
                </ul>
              </div>
              <div className="footer-title mt-20">
                <h3>FOLLOW US</h3>
              </div>
              <div className="footer-social mt-20">
                <ul className="d-flex justify-content-center justify-content-sm-start align-items-center" style={{gap: '15px', listStyle: 'none', padding: 0, margin: 0}}>
                  <li>
                    <a 
                      href="https://www.facebook.com/profile.php?id=61576339149106&mibextid=wwXIfr&rdid=w7W7oLwIhcAQYuGD&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F16sLtv9ZXk%2F%3Fmibextid%3DwwXIfr"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on Facebook"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#3b5998',
                        color: 'white',
                        borderRadius: '50%',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '18px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fa fa-facebook" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.instagram.com/ifilifestyle"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on Instagram"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
                        color: 'white',
                        borderRadius: '50%',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '18px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fa fa-instagram" />
                    </a>
                  </li>
                  <li>
                    <a 
                      href="https://www.tiktok.com/@ifilifestyle.com?is_from_webapp=1&sender_device=pc"
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Follow us on TikTok"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#000000',
                        color: 'white',
                        borderRadius: '50%',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease',
                        fontSize: '18px'
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <svg 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                        style={{display: 'block'}}
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-.1z"/>
                      </svg>
                    </a>
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
