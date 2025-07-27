import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MobileNavMenu = () => {
  const { t } = useTranslation();

  return (
    <nav className="offcanvas-navigation" id="offcanvas-navigation">
      <ul>
      <li>
          <Link to={process.env.PUBLIC_URL + "/"}>
            {t("home")}
          </Link>
        </li>
       
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/shop"}>
            {t("shop")}
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/shop"}>
                All Products
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/luxury"}>
                Luxury Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/sports"}>
                Sports Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/classic"}>
                Classic Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/smart"}>
                Smart Watches
              </Link>
            </li>
          </ul>
        </li>
        
        {/* <li>
          <Link to={process.env.PUBLIC_URL + "/shop-grid-standard"}>
            {t("collection")}
          </Link>
        </li> */}
        
        <li>
          <Link to={process.env.PUBLIC_URL + "/"}>
            {t("pages")}
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/cart"}>
                {t("cart")}
              </Link>
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
        
        {/* <li>
          <Link to={process.env.PUBLIC_URL + "/"}>
            {t("blog")}
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                {t("blog_standard")}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-no-sidebar"}>
                {t("blog_no_sidebar")}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-right-sidebar"}>
                {t("blog_right_sidebar")}
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                {t("blog_details_standard")}
              </Link>
            </li>
          </ul>
        </li> */}
        
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {t("contact_us")}
          </Link>
        </li>
        
        <li>
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            Contact
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;
