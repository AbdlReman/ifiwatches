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
          
          {/* Watches */}
          <li className="mega-menu-title">
            <Link to="/watches">
              🕰️ Watches
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
                <Link to={process.env.PUBLIC_URL + "/watches/mens"}>Men's Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/womens"}>Women's Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/unisex"}>Unisex Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/luxury"}>Luxury Collection</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/formal"}>Formal Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/casual"}>Casual Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watches/sports"}>Sports & Digital Watches</Link>
              </li>
            </ul>
          </li>

          {/* Watch Straps */}
          <li className="mega-menu-title">
            <Link to="/watch-straps">
              🔗 Watch Straps
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
                <Link to={process.env.PUBLIC_URL + "/watch-straps/leather"}>Leather Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/metal"}>Metal/Chain Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/silicone"}>Silicone/Rubber Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/nylon"}>Nylon/Fabric Straps</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/watch-straps/magnetic"}>Magnetic/Loop Straps</Link>
              </li>
            </ul>
          </li>

          {/* Eyewear */}
          <li className="mega-menu-title">
            <Link to="/eyewear">
              🕶️ Eyewear
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
                <Link to={process.env.PUBLIC_URL + "/eyewear/sunglasses"}>Sunglasses</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/eyewear/optical"}>Optical Frames</Link>
              </li>
            </ul>
          </li>

          {/* Rings & Accessories */}
          <li className="mega-menu-title">
            <Link to="/rings-accessories">
              💍 Rings & Accessories
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
                <Link to={process.env.PUBLIC_URL + "/rings-accessories/fashion-rings"}>Fashion Rings</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/rings-accessories/chains-bracelets"}>Chains & Bracelets</Link>
              </li>
            </ul>
          </li>

          {/* Perfumes */}
          <li className="mega-menu-title">
            <Link to="/perfumes">
              🌸 Perfumes
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
                <Link to={process.env.PUBLIC_URL + "/perfumes/mens"}>Men's Fragrances</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes/womens"}>Women's Fragrances</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/perfumes/unisex"}>Unisex Scents</Link>
              </li>
            </ul>
          </li>

          {/* Mobile Gadgets */}
          <li className="mega-menu-title">
            <Link to="/mobile-gadgets">
              📱 Mobile Gadgets
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
                <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/used-mobiles"}>Trusted Used Mobiles</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/accessories"}>Mobile Accessories</Link>
              </li>
            </ul>
          </li>

          {/* Fashion */}
          <li className="mega-menu-title">
            <Link to="/fashion">
              👕 Fashion
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
                <Link to={process.env.PUBLIC_URL + "/fashion/tshirt"}>T-Shirt</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion/pant-jeans"}>Pant/Jeans</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/fashion/shalwar-kameez"}>Shalwar Kameez Fabric (Unstitched only)</Link>
              </li>
            </ul>
          </li>

          <li>
            <Link to={process.env.PUBLIC_URL + "/"}>
              {t("pages")}
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
            </ul>
          </li>
          <li>
            <Link to={process.env.PUBLIC_URL + "/contact"}>Contact</Link>
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
