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
       
        {/* Watches */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/watches"}>
            🕰️ Watches
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/mens"}>
                Men's Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/womens"}>
                Women's Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/unisex"}>
                Unisex Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/luxury"}>
                Luxury Collection
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/formal"}>
                Formal Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/casual"}>
                Casual Watches
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watches/sports"}>
                Sports & Digital Watches
              </Link>
            </li>
          </ul>
        </li>

        {/* Watch Straps */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/watch-straps"}>
            🔗 Watch Straps
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/watch-straps/leather"}>
                Leather Straps
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watch-straps/metal"}>
                Metal/Chain Straps
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watch-straps/silicone"}>
                Silicone/Rubber Straps
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watch-straps/nylon"}>
                Nylon/Fabric Straps
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/watch-straps/magnetic"}>
                Magnetic/Loop Straps
              </Link>
            </li>
          </ul>
        </li>

        {/* Eyewear */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/eyewear"}>
            🕶️ Eyewear
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/eyewear/sunglasses"}>
                Sunglasses
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/eyewear/optical"}>
                Optical Frames
              </Link>
            </li>
          </ul>
        </li>

        {/* Rings & Accessories */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/rings-accessories"}>
            💍 Rings & Accessories
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/rings-accessories/fashion-rings"}>
                Fashion Rings
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/rings-accessories/chains-bracelets"}>
                Chains & Bracelets
              </Link>
            </li>
          </ul>
        </li>

        {/* Perfumes */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/perfumes"}>
            🌸 Perfumes
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/perfumes/mens"}>
                Men's Fragrances
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/perfumes/womens"}>
                Women's Fragrances
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/perfumes/unisex"}>
                Unisex Scents
              </Link>
            </li>
          </ul>
        </li>

        {/* Mobile Gadgets */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/mobile-gadgets"}>
            📱 Mobile Gadgets
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/used-mobiles"}>
                Trusted Used Mobiles
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/mobile-gadgets/accessories"}>
                Mobile Accessories
              </Link>
            </li>
          </ul>
        </li>

        {/* Fashion Buttons */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/fashion-buttons"}>
            👕 Fashion Buttons
          </Link>
          <ul className="sub-menu">
            <li>
              <Link to={process.env.PUBLIC_URL + "/fashion-buttons/tshirt"}>
                T-Shirt
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/fashion-buttons/pant-jeans"}>
                Pant/Jeans
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/fashion-buttons/shalwar-kameez"}>
                Shalwar Kameez Fabric (Unstitched only)
              </Link>
            </li>
          </ul>
        </li>
        
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
          <Link to={process.env.PUBLIC_URL + "/contact"}>
            {t("contact_us")}
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;

