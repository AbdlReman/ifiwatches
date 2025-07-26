import { Suspense, lazy } from "react";
import ScrollToTop from "./helpers/scroll-top";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// home pages

const HomeFurniture = lazy(() => import("./pages/home/HomeFurniture"));

// shop pages
const ShopGridStandard = lazy(() => import("./pages/shop/ShopGridStandard"));

// product pages
const Product = lazy(() => import("./pages/shop-product/Product"));

// category pages
// const CosmeticPage = lazy(() => import("./pages/category/CosmeticPage"));
// const MobileAccessoriesPage = lazy(() =>
//   import("./pages/category/MobileAccessoriesPage")
// );
// const ElectronicPage = lazy(() => import("./pages/category/ElectronicPage"));
const LuxuryPage = lazy(() => import("./pages/category/BrasPage"));
const SportsPage = lazy(() => import("./pages/category/PantiesPage"));
const ClassicPage = lazy(() => import("./pages/category/LingeriePage"));
const SmartPage = lazy(() => import("./pages/category/NightwearPage"));

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
            <div className="ifiwatches-preloader-wrapper">
              <div className="ifiwatches-preloader">
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

            {/* Category pages */}
            <Route
              path={process.env.PUBLIC_URL + "/luxury"}
              element={<LuxuryPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/sports"}
              element={<SportsPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/classic"}
              element={<ClassicPage />}
            />
            <Route
              path={process.env.PUBLIC_URL + "/smart"}
              element={<SmartPage />}
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
