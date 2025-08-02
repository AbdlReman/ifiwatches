import React, { Fragment, useState, useEffect } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderTwentySeven from "../../wrappers/hero-slider/HeroSliderTwentySeven";
import BannerTwentySeven from "../../wrappers/banner/BannerTwentySeven";
import ProductSection from "../../wrappers/product/ProductSection";
import RecurringCountDown from "../../wrappers/countdown/RecurringCountDown";
import FeatureIconTwo from "../../wrappers/feature-icon/FeatureIconTwo";
import LatestProductSection from "../../wrappers/product/LatestProductSection";
import CategoryShowcase from "../../components/category/CategoryShowcase";
import HeroBanner from "../../components/hero/HeroBanner";
import ShopProducts from "../../wrappers/product/ShopProducts";
import client from "../../data/contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import "../../assets/css/category-layouts.css";
import {
  AnimatedSection,
  AnimatedText,
  AnimatedButton,
  GradientText,
  FadeInOnScroll,
  StaggeredGrid,
  HoverCard,
  LoadingSpinner
} from "../../components/AnimatedSection";

const HomeFurniture = () => {
  const [watchesProducts, setWatchesProducts] = useState([]);
  const [watchStrapsProducts, setWatchStrapsProducts] = useState([]);
  const [eyewearProducts, setEyewearProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [perfumesProducts, setPerfumesProducts] = useState([]);
  const [mobileGadgetsProducts, setMobileGadgetsProducts] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ content_type: "product" });
        const items = entries.items.map((item) => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            name: fields.name,
            slug: fields.slug,
            price: parseFloat(fields.price) || 0,
            discount: parseFloat(fields.discount) || 0,
            shortDescription: fields.shortDescription,
            fullDescription: fields.fullDescription ? documentToHtmlString(fields.fullDescription) : "",
            category: fields.category || [],
            tag: fields.tag || [],
            images: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            color: fields.color || [],
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            image: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            title: fields.name,
            description: fields.shortDescription,
            variation: fields.color && fields.color.length > 0 ?
              fields.color.map(color => ({
                color: color,
                size: fields.size ? fields.size.map(size => ({
                  name: size,
                  stock: fields.stock || 0
                })) : []
              })) : null
          };
        });

        // Filter products by category
        const watches = items.filter(product =>
          product.category && product.category.includes("watches")
        ).slice(0, 3); // Limited to 3 for showcase

        const watchStraps = items.filter(product =>
          product.category && product.category.includes("watchstraps")
        );

        const eyewear = items.filter(product =>
          product.category && product.category.includes("eyewear")
        ).slice(0, 6); // Limited to 6 for balanced layout

        const accessories = items.filter(product =>
          product.category && product.category.includes("ringsaccessories")
        ).slice(0, 4); // Limited to 4 for showcase

        const perfumes = items.filter(product =>
          product.category && product.category.includes("perfumes")
        );

        const mobileGadgets = items.filter(product =>
          product.category && product.category.includes("mobilegadgets")
        );

        const fashion = items.filter(product =>
          product.category && product.category.includes("fashion")
        ).slice(0, 6); // Limited to 6 for balanced layout

        setWatchesProducts(watches);
        setWatchStrapsProducts(watchStraps);
        setEyewearProducts(eyewear);
        setAccessoriesProducts(accessories);
        setPerfumesProducts(perfumes);
        setMobileGadgetsProducts(mobileGadgets);
        setFashionProducts(fashion);
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
      }}>
        <LoadingSpinner size={80} color="#667eea" />
      </div>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="IFIwatches - Premium Quality Watches"
        description="Discover premium quality watches at IFIwatches. Luxury timepieces with a focus on affordability and fast delivery throughout Pakistan."
      />
      <LayoutOne headerTop="visible">
        {/* hero banner section */}
        <AnimatedSection delay={0.2}>
          <div>
            <HeroBanner />
          </div>
        </AnimatedSection>

        {/* banner */}
        <FadeInOnScroll direction="up" delay={0.3}>
          <BannerTwentySeven spaceTopClass="pt-80" spaceBottomClass="pb-60" />
        </FadeInOnScroll>

        {/* latest products section */}
        <FadeInOnScroll direction="up" delay={0.4}>
          <LatestProductSection spaceBottomClass="pb-100" />
        </FadeInOnScroll>

        {/* luxury watches section */}
        <FadeInOnScroll direction="up" delay={0.5}>
          <ProductSection
            spaceBottomClass="pb-100"
            category="classic"
            title="CLASSIC WATCHES"
          />
        </FadeInOnScroll>

        {/* sports watches section */}
        <FadeInOnScroll direction="up" delay={0.6}>
          <ProductSection
            spaceBottomClass="pb-100"
            category="sports"
            title="SPORTS WATCHES"
          />
        </FadeInOnScroll>

        {/* 1. WATCHES - Hero Style with Side Banner */}
        <AnimatedSection className="watches-hero-section" delay={0.3}>
          <div className="container">
            <div className="watches-hero-content">
              <div className="row">
                {/* Hero Content - Left Side */}
                <div className="col-lg-6">
                  <div className="watches-hero-text">
                    <GradientText className="watches-hero-text h2" type="h2" delay={0.5}>
                      WATCHES
                    </GradientText>
                    <AnimatedText className="watches-hero-text p" type="p" delay={0.7}>
                      Premium Quality Timepieces
                    </AnimatedText>
                    <AnimatedText className="watches-hero-text p" type="p" delay={0.9}>
                      Discover our exclusive collection of luxury watches. Quality, elegance, and affordability for every customer.
                    </AnimatedText>
                    <div className="watches-hero-buttons">
                      <AnimatedButton
                        className="watches-hero-btn primary"
                        delay={1.1}
                        onClick={() => window.location.href = '/watches'}
                      >
                        Shop Now
                      </AnimatedButton>
                      <AnimatedButton
                        className="watches-hero-btn secondary"
                        delay={1.3}
                        onClick={() => window.location.href = '/about'}
                      >
                        Learn More
                      </AnimatedButton>
                    </div>
                  </div>
                </div>

                {/* Products Showcase - Right Side */}
                <div className="col-lg-6">
                  <HoverCard className="watches-products-container">
                    <AnimatedText className="h3" type="h3" delay={0.8} style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                      Featured Watches
                    </AnimatedText>
                    {watchesProducts.length > 0 ? (
                      <StaggeredGrid className="category-section" staggerDelay={0.2}>
                        <ShopProducts layout="grid three-column" products={watchesProducts} />
                      </StaggeredGrid>
                    ) : (
                      <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                        <p>No watches found.</p>
                      </div>
                    )}
                  </HoverCard>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 2. WATCH STRAPS - Masonry Grid Style */}
        <AnimatedSection className="watchstraps-masonry-section" delay={0.4}>
          <div className="container">
            {/* Header Section */}
            <div className="watchstraps-header">
              <GradientText className="watchstraps-header h2" type="h2" delay={0.6}>
                WATCH STRAPS
              </GradientText>
              <AnimatedText className="watchstraps-header p" type="p" delay={0.8}>
                Premium Quality Straps for Every Watch
              </AnimatedText>
              <AnimatedText className="watchstraps-header p" type="p" delay={1.0}>
                Discover our collection of high-quality watch straps. From leather to metal, find the perfect strap to complement your timepiece.
              </AnimatedText>
            </div>

            {/* Products Grid */}
            <HoverCard className="watchstraps-grid">
              {watchStrapsProducts.length > 0 ? (
                <StaggeredGrid className="category-section" staggerDelay={0.15}>
                  <ShopProducts layout="grid three-column" products={watchStrapsProducts} />
                </StaggeredGrid>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No watch straps found.</p>
                </div>
              )}
            </HoverCard>
          </div>
        </AnimatedSection>

        {/* 3. EYEWEAR - Split Layout with Diagonal Design */}
        <AnimatedSection className="eyewear-split-section" delay={0.5}>
          <div className="container">
            <div className="eyewear-content">
              <div className="row">
                {/* Products Section - Left Side (8 columns) */}
                <div className="col-lg-8">
                  <FadeInOnScroll direction="right" delay={0.7}>
                    <HoverCard className="eyewear-products-section">
                      <AnimatedText className="h3" type="h3" delay={0.9} style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                        Featured Eyewear
                      </AnimatedText>
                      {eyewearProducts.length > 0 ? (
                        <StaggeredGrid className="category-section" staggerDelay={0.2}>
                          <ShopProducts layout="grid three-column" products={eyewearProducts} />
                        </StaggeredGrid>
                      ) : (
                        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                          <p>No eyewear found.</p>
                        </div>
                      )}
                    </HoverCard>
                  </FadeInOnScroll>
                </div>

                {/* Info Panel - Right Side (4 columns) */}
                <div className="col-lg-4">
                  <FadeInOnScroll direction="left" delay={0.9}>
                    <HoverCard className="eyewear-info-panel">
                      <GradientText className="eyewear-info-panel h3" type="h3" delay={1.1}>
                        <span className="emoji">👓</span>
                        EYEWEAR
                      </GradientText>
                      <AnimatedText className="eyewear-info-panel p" type="p" delay={1.3}>
                        Discover our premium collection of eyewear. From stylish sunglasses to elegant optical frames, we offer quality and comfort for every vision need.
                      </AnimatedText>
                      <AnimatedText className="eyewear-info-panel p" type="p" delay={1.5}>
                        Our eyewear collection features:
                      </AnimatedText>
                      <ul style={{ color: 'white', opacity: 0.9, marginBottom: '30px' }}>
                        <li>Premium quality materials</li>
                        <li>UV protection</li>
                        <li>Comfortable fit</li>
                        <li>Trendy designs</li>
                        <li>Affordable prices</li>
                      </ul>
                      <AnimatedButton
                        className="section-btn"
                        delay={1.7}
                        onClick={() => window.location.href = '/eyewear'}
                      >
                        Shop All Eyewear
                      </AnimatedButton>
                    </HoverCard>
                  </FadeInOnScroll>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 4. ACCESSORIES - Card Grid with Floating Elements */}
        <AnimatedSection className="accessories-floating-section" delay={0.6}>
          <div className="container">
            <div className="accessories-content">
              <div className="row">
                {/* Products Section - Left Side (6 columns) */}
                <div className="col-lg-6">
                  <FadeInOnScroll direction="right" delay={0.8}>
                    <HoverCard className="accessories-products-section">
                      <AnimatedText className="h3" type="h3" delay={1.0} style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                        Featured Accessories
                      </AnimatedText>
                      {accessoriesProducts.length > 0 ? (
                        <StaggeredGrid className="category-section" staggerDelay={0.2}>
                          <ShopProducts layout="grid three-column" products={accessoriesProducts} />
                        </StaggeredGrid>
                      ) : (
                        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                          <p>No accessories found.</p>
                        </div>
                      )}
                    </HoverCard>
                  </FadeInOnScroll>
                </div>

                {/* Floating Info Panel - Right Side (6 columns) */}
                <div className="col-lg-6">
                  <FadeInOnScroll direction="left" delay={1.0}>
                    <HoverCard className="accessories-info-panel">
                      <GradientText className="accessories-info-panel h3" type="h3" delay={1.2}>
                        <span className="emoji">💍</span>
                        ACCESSORIES
                      </GradientText>
                      <AnimatedText className="accessories-info-panel p" type="p" delay={1.4}>
                        Discover our elegant collection of rings and accessories. From fashion rings to stylish chains and bracelets, we offer premium quality jewelry for every occasion.
                      </AnimatedText>
                      <AnimatedText className="accessories-info-panel p" type="p" delay={1.6}>
                        Our accessories collection features:
                      </AnimatedText>
                      <ul style={{ color: 'white', opacity: 0.9, marginBottom: '30px' }}>
                        <li>Elegant ring designs</li>
                        <li>Stylish chains & bracelets</li>
                        <li>Premium materials</li>
                        <li>Affordable luxury</li>
                        <li>Perfect for gifting</li>
                      </ul>
                      <AnimatedButton
                        className="section-btn"
                        delay={1.8}
                        onClick={() => window.location.href = '/rings-accessories'}
                      >
                        Shop All Accessories
                      </AnimatedButton>
                    </HoverCard>
                  </FadeInOnScroll>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 5. PERFUMES - Elegant Minimalist Design */}
        <AnimatedSection className="perfumes-elegant-section" delay={0.7}>
          <div className="container">
            {/* Elegant Banner */}
            <HoverCard className="perfumes-banner">
              <div className="perfumes-banner-content">
                <GradientText className="perfumes-banner h2" type="h2" delay={0.9}>
                  PERFUMES
                </GradientText>
                <AnimatedText className="perfumes-banner p" type="p" delay={1.1}>
                  Premium Quality Fragrances
                </AnimatedText>
                <AnimatedText className="perfumes-banner p" type="p" delay={1.3}>
                  Discover our exclusive collection of luxury perfumes. From classic scents to modern fragrances, find your signature scent.
                </AnimatedText>
              </div>
            </HoverCard>

            {/* Products Grid */}
            <HoverCard className="perfumes-grid">
              {perfumesProducts.length > 0 ? (
                <StaggeredGrid className="category-section" staggerDelay={0.2}>
                  <ShopProducts layout="grid three-column" products={perfumesProducts} />
                </StaggeredGrid>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No perfumes found.</p>
                </div>
              )}
            </HoverCard>
          </div>
        </AnimatedSection>

        {/* 6. MOBILE GADGETS - Tech-Inspired Grid */}
        <AnimatedSection className="mobilegadgets-tech-section" delay={0.8}>
          <div className="container">
            <div className="mobilegadgets-content">
              {/* Header */}
              <div className="mobilegadgets-header">
                <GradientText className="mobilegadgets-header h2" type="h2" delay={1.0}>
                  MOBILE GADGETS
                </GradientText>
                <AnimatedText className="mobilegadgets-header p" type="p" delay={1.2}>
                  Cutting-Edge Technology & Innovation
                </AnimatedText>
                <AnimatedText className="mobilegadgets-header p" type="p" delay={1.4}>
                  Explore our collection of mobile gadgets and accessories. From smartphones to smart accessories, stay connected with the latest technology.
                </AnimatedText>
              </div>

              {/* Products Grid */}
              <HoverCard className="mobilegadgets-grid">
                {mobileGadgetsProducts.length > 0 ? (
                  <StaggeredGrid className="category-section" staggerDelay={0.15}>
                    <ShopProducts layout="grid three-column" products={mobileGadgetsProducts} />
                  </StaggeredGrid>
                ) : (
                  <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                    <p>No mobile gadgets found.</p>
                  </div>
                )}
              </HoverCard>
            </div>
          </div>
        </AnimatedSection>

        {/* 7. FASHION - Magazine Style Layout */}
        <AnimatedSection className="fashion-magazine-section" delay={0.9}>
          <div className="container">
            <div className="fashion-content">
              <div className="row">
                {/* Info Panel - Left Side (4 columns) */}
                <div className="col-lg-4">
                  <FadeInOnScroll direction="right" delay={1.1}>
                    <HoverCard className="fashion-info-panel">
                      <GradientText className="fashion-info-panel h3" type="h3" delay={1.3}>
                        <span className="emoji">👗</span>
                        FASHION
                      </GradientText>
                      <AnimatedText className="fashion-info-panel p" type="p" delay={1.5}>
                        Discover our trendy fashion collection. From casual wear to elegant outfits, we offer stylish clothing for every occasion and personality.
                      </AnimatedText>
                      <AnimatedText className="fashion-info-panel p" type="p" delay={1.7}>
                        Our fashion collection features:
                      </AnimatedText>
                      <ul style={{ color: 'white', opacity: 0.9, marginBottom: '30px' }}>
                        <li>Trendy designs</li>
                        <li>Quality fabrics</li>
                        <li>Comfortable fit</li>
                        <li>Affordable prices</li>
                        <li>Latest styles</li>
                      </ul>
                      <AnimatedButton
                        className="section-btn"
                        delay={1.9}
                        onClick={() => window.location.href = '/fashion'}
                      >
                        Shop All Fashion
                      </AnimatedButton>
                    </HoverCard>
                  </FadeInOnScroll>
                </div>

                {/* Products Section - Right Side (8 columns) */}
                <div className="col-lg-8">
                  <FadeInOnScroll direction="left" delay={1.3}>
                    <HoverCard className="fashion-products-section">
                      <AnimatedText className="h3" type="h3" delay={1.5} style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                        Featured Fashion
                      </AnimatedText>
                      {fashionProducts.length > 0 ? (
                        <StaggeredGrid className="category-section" staggerDelay={0.2}>
                          <ShopProducts layout="grid three-column" products={fashionProducts} />
                        </StaggeredGrid>
                      ) : (
                        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                          <p>No fashion items found.</p>
                        </div>
                      )}
                    </HoverCard>
                  </FadeInOnScroll>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* category showcase section */}
        <FadeInOnScroll direction="up" delay={1.0}>
          <CategoryShowcase />
        </FadeInOnScroll>

        {/* countdown */}
        <FadeInOnScroll direction="up" delay={1.1}>
          <RecurringCountDown
            spaceTopClass="pt-115"
            spaceBottomClass="pb-115"
            bgImg="/assets/img/bg/bg.png"
            cycleDays={10}
          />
        </FadeInOnScroll>

        {/* feature icon */}
        <FadeInOnScroll direction="up" delay={1.2}>
          <FeatureIconTwo spaceTopClass="pt-100" spaceBottomClass="pb-60" />
        </FadeInOnScroll>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFurniture;
