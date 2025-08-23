import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// home pages
const HomeFurniture = lazy(() => import("./pages/home/HomeFurniture"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));

// category pages - Main categories
const TopCategoriesPage = lazy(() => import("./pages/category/TopCategoriesPage"));
const CategoriesPage = lazy(() => import("./pages/category/CategoriesPage"));
const WatchesPage = lazy(() => import("./pages/category/WatchesPage"));
const WatchStrapsPage = lazy(() => import("./pages/category/WatchStrapsPage"));
const EyewearPage = lazy(() => import("./pages/category/EyewearPage"));
const RingsAccessoriesPage = lazy(() => import("./pages/category/RingsAccessoriesPage"));
const PerfumesPage = lazy(() => import("./pages/category/PerfumesPage"));
const MobileGadgetsPage = lazy(() => import("./pages/category/MobileGadgetsPage"));
const FashionPage = lazy(() => import("./pages/category/FashionButtonsPage"));

// category pages - Watch subcategories
const MensWatchesPage = lazy(() => import("./pages/category/MensWatchesPage"));
const WomensWatchesPage = lazy(() => import("./pages/category/WomensWatchesPage"));
const UnisexWatchesPage = lazy(() => import("./pages/category/UnisexWatchesPage"));
const LuxuryWatchesPage = lazy(() => import("./pages/category/LuxuryWatchesPage"));
const FormalWatchesPage = lazy(() => import("./pages/category/FormalWatchesPage"));
const CasualWatchesPage = lazy(() => import("./pages/category/CasualWatchesPage"));
const SportsWatchesPage = lazy(() => import("./pages/category/SportsWatchesPage"));

// category pages - Watch Straps subcategories
const LeatherStrapsPage = lazy(() => import("./pages/category/LeatherStrapsPage"));
const MetalStrapsPage = lazy(() => import("./pages/category/MetalStrapsPage"));
const SiliconeStrapsPage = lazy(() => import("./pages/category/SiliconeStrapsPage"));
const NylonStrapsPage = lazy(() => import("./pages/category/NylonStrapsPage"));
const MagneticStrapsPage = lazy(() => import("./pages/category/MagneticStrapsPage"));

// category pages - Eyewear subcategories
const SunglassesPage = lazy(() => import("./pages/category/SunglassesPage"));
const OpticalFramesPage = lazy(() => import("./pages/category/OpticalFramesPage"));

// category pages - Rings & Accessories subcategories
const FashionRingsPage = lazy(() => import("./pages/category/FashionRingsPage"));
const ChainsBraceletsPage = lazy(() => import("./pages/category/ChainsBraceletsPage"));

// category pages - Perfumes subcategories
const MensPerfumesPage = lazy(() => import("./pages/category/MensPerfumesPage"));
const WomensPerfumesPage = lazy(() => import("./pages/category/WomensPerfumesPage"));
const UnisexPerfumesPage = lazy(() => import("./pages/category/UnisexPerfumesPage"));

// category pages - Mobile Gadgets subcategories
const UsedMobilesPage = lazy(() => import("./pages/category/UsedMobilesPage"));
const MobileAccessoriesPage = lazy(() => import("./pages/category/MobileAccessoriesPage"));

// category pages - Fashion subcategories
const TshirtPage = lazy(() => import("./pages/category/TshirtButtonsPage"));
const PantJeansPage = lazy(() => import("./pages/category/PantJeansButtonsPage"));
const ShalwarKameezPage = lazy(() => import("./pages/category/ShalwarKameezButtonsPage"));

// blog pages
const BlogStandard = lazy(() => import("./pages/blog/BlogStandard"));
const BlogNoSidebar = lazy(() => import("./pages/blog/BlogNoSidebar"));
const BlogRightSidebar = lazy(() => import("./pages/blog/BlogRightSidebar"));
const BlogDetailsStandard = lazy(() =>
  import("./pages/blog/BlogDetailsStandard")
);

// other pages
const About = lazy(() => import("./pages/other/About"));
const Contact = lazy(() => import("./pages/other/Contact"));
const MyAccount = lazy(() => import("./pages/other/MyAccount"));
const LoginRegister = lazy(() => import("./pages/other/LoginRegister"));

const Cart = lazy(() => import("./pages/other/Cart"));
const Wishlist = lazy(() => import("./pages/other/Wishlist"));
const Compare = lazy(() => import("./pages/other/Compare"));
const Checkout = lazy(() => import("./pages/other/Checkout"));
const TestCountdown = lazy(() => import("./pages/other/TestCountdown"));

const NotFound = lazy(() => import("./pages/other/NotFound"));

const App = () => {
  return (
    <Router>
      <ScrollToTop>
        <Suspense
          fallback={
                    <div className="ifilifestyle-preloader-wrapper">
          <div className="ifilifestyle-preloader">
                <span></span>
                <span></span>
              </div>
            </div>
          }
        >
          <Routes>
            {/* Homepages */}
            <Route path="/" element={<HomeFurniture />} />

            {/* Shop pages */}
            <Route
              path={process.env.PUBLIC_URL + "/shop"}
              element={<ShopGridStandard />}
            />

            {/* Shop product pages */}
            <Route
              path={process.env.PUBLIC_URL + "/product/:slug"}
              element={<Product />}
            />

            {/* Category pages - Main categories */}
            <Route
              path={process.env.PUBLIC_URL + "/top-categories"}
              element={<TopCategoriesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/categories"}
              element={<CategoriesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches"}
              element={<WatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps"}
              element={<WatchStrapsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/eyewear"}
              element={<EyewearPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/rings-accessories"}
              element={<RingsAccessoriesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/perfumes"}
              element={<PerfumesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/mobile-gadgets"}
              element={<MobileGadgetsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/fashion"}
              element={<FashionPage />}
            />

            {/* Category pages - Watch subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/watches/mens"}
              element={<MensWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/womens"}
              element={<WomensWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/unisex"}
              element={<UnisexWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/luxury"}
              element={<LuxuryWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/formal"}
              element={<FormalWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/casual"}
              element={<CasualWatchesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watches/sports"}
              element={<SportsWatchesPage />}
            />

            {/* Category pages - Watch Straps subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps/leather"}
              element={<LeatherStrapsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps/metal"}
              element={<MetalStrapsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps/silicone"}
              element={<SiliconeStrapsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps/nylon"}
              element={<NylonStrapsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/watch-straps/magnetic"}
              element={<MagneticStrapsPage />}
            />

            {/* Category pages - Eyewear subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/eyewear/sunglasses"}
              element={<SunglassesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/eyewear/optical"}
              element={<OpticalFramesPage />}
            />

            {/* Category pages - Rings & Accessories subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/rings-accessories/fashion-rings"}
              element={<FashionRingsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/rings-accessories/chains-bracelets"}
              element={<ChainsBraceletsPage />}
            />

            {/* Category pages - Perfumes subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/perfumes/mens"}
              element={<MensPerfumesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/perfumes/womens"}
              element={<WomensPerfumesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/perfumes/unisex"}
              element={<UnisexPerfumesPage />}
            />

            {/* Category pages - Mobile Gadgets subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/mobile-gadgets/used-mobiles"}
              element={<UsedMobilesPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/mobile-gadgets/accessories"}
              element={<MobileAccessoriesPage />}
            />

            {/* Category pages - Fashion subcategories */}
            <Route
              path={process.env.PUBLIC_URL + "/fashion/tshirt"}
              element={<TshirtPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/fashion/pant-jeans"}
              element={<PantJeansPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/fashion/shalwar-kameez"}
              element={<ShalwarKameezPage />}
            />

            {/* Blog pages */}
            <Route
              path={process.env.PUBLIC_URL + "/blog-standard"}
              element={<BlogStandard />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/blog-no-sidebar"}
              element={<BlogNoSidebar />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/blog-right-sidebar"}
              element={<BlogRightSidebar />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/blog-details-standard"}
              element={<BlogDetailsStandard />}
            />

            {/* Other pages */}
            <Route
              path={process.env.PUBLIC_URL + "/about"}
              element={<About />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/contact"}
              element={<Contact />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/my-account"}
              element={<MyAccount />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/login-register"}
              element={<LoginRegister />}
            />

            <Route path={process.env.PUBLIC_URL + "/cart"} element={<Cart />} />
            <Route
              path={process.env.PUBLIC_URL + "/wishlist"}
              element={<Wishlist />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/compare"}
              element={<Compare />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/checkout"}
              element={<Checkout />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/test-countdown"}
              element={<TestCountdown />}
            />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ScrollToTop>
    </Router>
  );
};

export default App;
