import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import clsx from "clsx";

const NavMenu = ({ menuWhiteClass, sidebarMenu }) => {
  const { t } = useTranslation();

  return (
    <div
      className={clsx(
        sidebarMenu
          ? "sidebar-menu"
          : `main-menu ${menuWhiteClass ? menuWhiteClass : ""}`
      )}
    >
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          
          <li>
            <Link to={process.env.PUBLIC_URL + "/shop"}>Shop</Link>
          </li>
          
          {/* Top Categories */}
          <li className="mega-menu-title">
            <Link to="/top-categories">
              Top Categories
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="submenu">
              {/* Watches */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches"}>Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/mens"}>• Men's Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/womens"}>• Women's Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/unisex"}>• Unisex Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/luxury"}>• Luxury Collection</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/formal"}>• Formal Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/casual"}>• Casual Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/sports"}>• Sports & Digital Watches</Link>
              </li>
              
              {/* Watch Straps */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps"}>Watch Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/leather"}>• Leather Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/metal"}>• Metal/Chain Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/silicone"}>• Silicone/Rubber Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/nylon"}>• Nylon/Fabric Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/magnetic"}>• Magnetic/Loop Straps</Link>
              </li>
              
              {/* Perfumes */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes"}>Perfumes</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes/mens"}>• Men's Fragrances</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes/womens"}>• Women's Fragrances</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes/unisex"}>• Unisex Scents</Link>
              </li>
            </ul>
          </li>

          {/* Other Categories */}
          <li className="mega-menu-title">
            <Link to={process.env.PUBLIC_URL + "/"}>
              Categories
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="submenu">
              {/* Eyewear */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/eyewear"}>Eyewear</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/eyewear/sunglasses"}>• Sunglasses</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/eyewear/optical"}>• Optical Frames</Link>
              </li>
              
              {/* Rings & Accessories */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/rings-accessories"}>Rings & Accessories</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/rings-accessories/fashion-rings"}>• Fashion Rings</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/rings-accessories/chains-bracelets"}>• Chains & Bracelets</Link>
              </li>
              
              {/* Mobile Gadgets */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/mobile-gadgets"}>Mobile Gadgets</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/used-mobiles"}>• Trusted Used Mobiles</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/accessories"}>• Mobile Accessories</Link>
              </li>
              
              {/* Fashion */}
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion"}>Fashion</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion/tshirt"}>• T-Shirt</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion/pant-jeans"}>• Pant/Jeans</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion/shalwar-kameez"}>• Shalwar Kameez Fabric</Link>
              </li>
            </ul>
          </li>

          {/* Other Pages */}
          <li className="mega-menu-title">
            <Link to={process.env.PUBLIC_URL + "/"}>
              Pages
              {sidebarMenu ? (
                <span>
                  <i className="fa fa-angle-right"></i>
                </span>
              ) : (
                <i className="fa fa-angle-down" />
              )}
            </Link>
            <ul className="submenu">
              <li>
                <Link to={process.env.PUBLIC_URL + "/about"}>
                  {t("about_us")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/contact"}>
                  {t("contact_us")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/cart"}>{t("cart")}</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/checkout"}>
                  {t("checkout")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/wishlist"}>
                  {t("wishlist")}
                </Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/compare"}>
                  {t("compare")}
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

NavMenu.propTypes = {
  menuWhiteClass: PropTypes.string,
  sidebarMenu: PropTypes.bool
};

export default NavMenu;
