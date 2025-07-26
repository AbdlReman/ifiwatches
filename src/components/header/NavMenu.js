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
          <li className="mega-menu-title">
            <Link to="/shop">
              Shop
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
                <Link to={process.env.PUBLIC_URL + "/shop"}>All Products</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/luxury"}>Luxury Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/sports"}>Sports Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/classic"}>Classic Watches</Link>
              </li>
              <li>
                <Link to={process.env.PUBLIC_URL + "/smart"}>Smart Watches</Link>
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
              {/* <li>
                <Link to={process.env.PUBLIC_URL + "/my-account"}>
                  {t("my_account")}
                </Link>
              </li> */}
              {/* <li>
                <Link to={process.env.PUBLIC_URL + "/login-register"}>
                  {t("login_register")}
                </Link>
              </li> */}
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
