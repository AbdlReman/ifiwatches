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
       
        <li>
          <Link to={process.env.PUBLIC_URL + "/shop"}>
            Shop
          </Link>
        </li>

        {/* Top Categories */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/top-categories"}>
            Top Categories
          </Link>
          <ul className="sub-menu">
            {/* Watches */}
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/watches"}>
                Watches
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
                Watch Straps
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
            
            {/* Perfumes */}
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/perfumes"}>
                Perfumes
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
          </ul>
        </li>

        {/* Other Categories */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/categories"}>
            Categories
          </Link>
          <ul className="sub-menu">
            {/* Eyewear */}
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/eyewear"}>
                Eyewear
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
                Rings & Accessories
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
            
            {/* Mobile Gadgets */}
            <li className="menu-item-has-children">
              <Link to={process.env.PUBLIC_URL + "/mobile-gadgets"}>
                Mobile Gadgets
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
            
                         {/* Fashion */}
             <li className="menu-item-has-children">
               <Link to={process.env.PUBLIC_URL + "/fashion"}>
                 Fashion
               </Link>
               <ul className="sub-menu">
                 <li>
                   <Link to={process.env.PUBLIC_URL + "/fashion/tshirt"}>
                     T-Shirt
                   </Link>
                 </li>
                 <li>
                   <Link to={process.env.PUBLIC_URL + "/fashion/pant-jeans"}>
                     Pant/Jeans
                   </Link>
                 </li>
                 <li>
                   <Link to={process.env.PUBLIC_URL + "/fashion/shalwar-kameez"}>
                     Shalwar Kameez Fabric
                   </Link>
                 </li>
               </ul>
             </li>
             
             {/* AA */}
             <li>
               <Link to={process.env.PUBLIC_URL + "/aa"}>
                 AA●
               </Link>
             </li>
          </ul>
        </li>

        {/* Other Pages */}
        <li className="menu-item-has-children">
          <Link to={process.env.PUBLIC_URL + "/"}>
            Pages
          </Link>
          <ul className="sub-menu">
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
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default MobileNavMenu;

