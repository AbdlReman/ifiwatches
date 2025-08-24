import React, { Fragment, useState, useEffect, Suspense, lazy } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderTwentySeven from "../../wrappers/hero-slider/HeroSliderTwentySeven";
import BannerTwentySeven from "../../wrappers/banner/BannerTwentySeven";

import RecurringCountDown from "../../wrappers/countdown/RecurringCountDown";
import FeatureIconTwo from "../../wrappers/feature-icon/FeatureIconTwo";
import LatestProductSection from "../../wrappers/product/LatestProductSection";
import CategoryShowcase from "../../components/category/CategoryShowcase";
import HeroBanner from "../../components/hero/HeroBanner";
import ShopProducts from "../../wrappers/product/ShopProducts";
import SectionTitle from "../../components/section-title/SectionTitle";
import ShippingReturnsFeatures from "../../components/features/ShippingReturnsFeatures";
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

// Add CSS for loading animations
const loadingStyles = `
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  .product-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
  }
`;

// Lazy load product sections to improve initial page load
const LazyProductSection = lazy(() => import("../../wrappers/product/ShopProducts"));

const HomeFurniture = () => {
  const [watchesProducts, setWatchesProducts] = useState([]);
  const [watchStrapsProducts, setWatchStrapsProducts] = useState([]);
  const [eyewearProducts, setEyewearProducts] = useState([]);
  const [accessoriesProducts, setAccessoriesProducts] = useState([]);
  const [perfumesProducts, setPerfumesProducts] = useState([]);
  const [mobileGadgetsProducts, setMobileGadgetsProducts] = useState([]);
  const [fashionProducts, setFashionProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Changed to false to show content immediately
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Add a small delay to prioritize slider loading first
        await new Promise(resolve => setTimeout(resolve, 200));
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
            createdAt: item.sys.createdAt,
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

        // Filter products by category and sort by creation date (latest first)
        const watches = items.filter(product =>
          product.category && product.category.includes("watches")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const watchStraps = items.filter(product =>
          product.category && product.category.includes("watchstraps")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const eyewear = items.filter(product =>
          product.category && product.category.includes("eyewear")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const accessories = items.filter(product =>
          product.category && product.category.includes("ringsaccessories")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const perfumes = items.filter(product =>
          product.category && product.category.includes("perfumes")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const mobileGadgets = items.filter(product =>
          product.category && product.category.includes("mobilegadgets")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const fashion = items.filter(product =>
          product.category && product.category.includes("fashion")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        setWatchesProducts(watches);
        setWatchStrapsProducts(watchStraps);
        setEyewearProducts(eyewear);
        setAccessoriesProducts(accessories);
        setPerfumesProducts(perfumes);
        setMobileGadgetsProducts(mobileGadgets);
        setFashionProducts(fashion);
        setProductsLoaded(true);
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Delay product fetching to prioritize slider and main content
    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, []);

  // Product section loading component
  const ProductSectionLoader = ({ title, products, category, delay = 0 }) => (
    <FadeInOnScroll direction="up" delay={delay}>
      <div className="product-area">
        <div className="container">
          <SectionTitle titleText={title} positionClass="text-center" />
          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '200px',
              background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'loading 1.5s infinite'
            }}>
              <LoadingSpinner size={40} color="#daaa58" />
            </div>
          ) : products.length > 0 ? (
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px' 
              }}>
                <LoadingSpinner size={40} color="#daaa58" />
              </div>
            }>
              <StaggeredGrid className="category-section" staggerDelay={0.2}>
                <ShopProducts layout="grid four-column" products={products} />
              </StaggeredGrid>
            </Suspense>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p>No {title.toLowerCase()} found.</p>
            </div>
          )}
          {/* View More Button */}
          <div style={{ textAlign: 'center', marginTop: '30px' }}>
            <button
              onClick={() => window.location.href = `/${category}`}
              style={{
                color: '#daaa58',
                border: '2px solid #daaa58',
                padding: '12px 30px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: 'transparent'
              }}
            >
              View More {title}
            </button>
          </div>
        </div>
      </div>
    </FadeInOnScroll>
  );

  return (
    <Fragment>
      <style>{loadingStyles}</style>
      <SEO
        title="IFI Lifestyle - Premium Watches, Perfumes & Fashion Accessories"
        titleTemplate="IFI Lifestyle | ifilifestyle.com"
        description="IFI Lifestyle (Iconic Futures Innovations) - Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories. Quality products with fast nationwide delivery."
        keywords="IFI Lifestyle, ifilifestyle, premium watches, luxury watches, perfumes, fashion accessories, men's fabrics, Pakistan, online shopping, Iconic Futures Innovations"
        ogTitle="IFI Lifestyle - Premium Watches, Perfumes & Fashion Accessories"
        ogDescription="Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories. Quality products with fast nationwide delivery."
        ogType="website"
        ogUrl="https://www.ifilifestyle.com/"
        ogImage="https://www.ifilifestyle.com/logo.png"
        twitterCard="summary_large_image"
        twitterTitle="IFI Lifestyle - Premium Watches, Perfumes & Fashion Accessories"
        twitterDescription="Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories."
        canonical="https://www.ifilifestyle.com/"
        robots="index, follow"
      />
      <LayoutOne headerTop="visible">
        {/* hero banner section */}
        <AnimatedSection delay={0.1}>
          <div>
            <HeroBanner />
          </div>
        </AnimatedSection>

        {/* banner */}
        <FadeInOnScroll direction="up" delay={0.2}>
          <BannerTwentySeven spaceTopClass="pt-80" spaceBottomClass="pb-60" />
        </FadeInOnScroll>

        {/* Features Section */}
        <ShippingReturnsFeatures />

        {/* latest products section */}
        <FadeInOnScroll direction="up" delay={0.3}>
          <LatestProductSection spaceBottomClass="pb-100" />
        </FadeInOnScroll>

        {/* luxury watches section */}
        <ProductSectionLoader 
          title="WATCHES" 
          products={watchesProducts} 
          category="watches" 
          delay={0.4} 
        />

        <br/>

        {/* 2. WATCH STRAPS - Masonry Grid Style */}
        <AnimatedSection className="watchstraps-masonry-section" delay={0.5}>
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

          <div className="product-area">
            <div>
             
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '200px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite'
                }}>
                  <LoadingSpinner size={40} color="#daaa58" />
                </div>
              ) : watchStrapsProducts.length > 0 ? (
                <StaggeredGrid className="category-section" staggerDelay={0.2}>
                  <ShopProducts layout="grid four-column" products={watchStrapsProducts} />
                </StaggeredGrid>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No watches Straps found.</p>
                </div>
              )}
              {/* View More Button */}
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={() => window.location.href = '/watch-straps'}
                  style={{
                    color: '#daaa58',
                    border: '2px solid #daaa58',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'transparent'
                  }}
                >
                  View More Straps
                </button>
              </div>
            </div>
          </div>
        
            
          </div>
        </AnimatedSection>
          

        {/* 3. EYEWEAR - Split Layout with Diagonal Design */}
        <AnimatedSection className="eyewear-split-section" delay={0.6}>
          <div className="container">
            <div className="eyewear-content">
              <div className="row">
                {/* Products Section - Left Side (8 columns) */}
                <div className="col-lg-8">
                   <div>
             <FadeInOnScroll direction="right" delay={0.7}>
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '200px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite'
                }}>
                  <LoadingSpinner size={40} color="#daaa58" />
                </div>
              ) : eyewearProducts.length > 0 ? (
                <StaggeredGrid className="category-section" staggerDelay={0.2}>
                  <ShopProducts layout="grid three-column" products={eyewearProducts} />
                </StaggeredGrid>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No Eyewear found.</p>
                </div>
              )}
             </FadeInOnScroll>
            </div>
                </div>

                {/* Info Panel - Right Side (4 columns) */}
                <div className="col-lg-4">
                  <FadeInOnScroll direction="left" delay={0.9}>
                    <HoverCard className="eyewear-info-panel">
                      
                     
                      <AnimatedText className="eyewear-info-panel p" type="p" delay={1.5}>
                       Our Premium Eyewear Collection.
                      </AnimatedText>
                    
                      <button
                        onClick={() => window.location.href = '/eyewear'}
                        style={{
                          color: '#daaa58',
                          border: '2px solid #daaa58',
                          padding: '12px 30px',
                          borderRadius: '25px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'transparent'
                        }}
                      >
                        Shop All Eyewear
                      </button>
                    </HoverCard>
                  </FadeInOnScroll>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 4. ACCESSORIES - Card Grid with Floating Elements */}
        <ProductSectionLoader 
          title="Featured Accessories" 
          products={accessoriesProducts} 
          category="rings-accessories" 
          delay={0.7} 
        />

        <br/>

        {/* 5. PERFUMES - Elegant Minimalist Design */}
        <AnimatedSection className="perfumes-elegant-section" delay={0.8}>
          <div className="container">
            {/* Elegant Banner */}
            
            <HoverCard >
            
                <GradientText className="perfumes-banner h2" type="h2" delay={0.9}>
                  AM PERFUMES
                </GradientText>
             
            </HoverCard>

            {/* Products Grid */}
            
              <div className="product-area">
            <div >
             
              {loading ? (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  minHeight: '200px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite'
                }}>
                  <LoadingSpinner size={40} color="#daaa58" />
                </div>
              ) : perfumesProducts.length > 0 ? (
                <StaggeredGrid className="category-section" staggerDelay={0.2}>
                  <ShopProducts layout="grid four-column" products={perfumesProducts} />
                </StaggeredGrid>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No Perfumes found.</p>
                </div>
              )}
            
            </div>
          </div>
          

            {/* View More Button */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => window.location.href = '/perfumes'}
                style={{
                  color: '#daaa58',
                  border: '2px solid #daaa58',
                  padding: '12px 30px',
                  borderRadius: '25px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
              >
                View More Perfumes
              </button>
            </div>
          </div>
        </AnimatedSection>

        {/* 6. MOBILE GADGETS - Tech-Inspired Grid */}
        <AnimatedSection className="mobilegadgets-tech-section" delay={0.9}>
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
             
                {loading ? (
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    minHeight: '200px',
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'loading 1.5s infinite'
                  }}>
                    <LoadingSpinner size={40} color="#daaa58" />
                  </div>
                ) : mobileGadgetsProducts.length > 0 ? (
                  <StaggeredGrid className="category-section" staggerDelay={0.15}>
                    <ShopProducts layout="grid four-column" products={mobileGadgetsProducts} />
                  </StaggeredGrid>
                ) : (
                  <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
                    <p>No mobile gadgets found.</p>
                  </div>
                )}
             

              {/* View More Button */}
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button
                  onClick={() => window.location.href = '/mobile-gadgets'}
                  style={{
                    color: '#daaa58',
                    border: '2px solid #daaa58',
                    padding: '12px 30px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'transparent'
                  }}
                >
                  View More Mobile Gadgets
                </button>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* 7. FASHION - Magazine Style Layout */}
        <AnimatedSection className="fashion-magazine-section" delay={1.0}>
          <div className="container">
            <div className="fashion-content">
              <div className="row">
                {/* Info Panel - Left Side (4 columns) */}
                <div className="col-lg-4">
                  <FadeInOnScroll direction="right" delay={1.1}>
                    <HoverCard className="fashion-info-panel">
                      
                     
                      <AnimatedText className="fashion-info-panel p" type="p" delay={1.7}>
                        Our fashion collection:
                      </AnimatedText>
                     
                      <button
                        onClick={() => window.location.href = '/fashion'}
                        style={{
                          color: '#daaa58',
                          border: '2px solid #daaa58',
                          padding: '12px 30px',
                          borderRadius: '25px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: 'transparent'
                        }}
                      >
                        Shop All Fashion
                      </button>
                    </HoverCard>
                  </FadeInOnScroll>
                </div>

                {/* Products Section - Right Side (8 columns) */}
                <div className="col-lg-8">
                  <FadeInOnScroll direction="left" delay={1.3}>
                    
                      <AnimatedText className="h3" type="h3" delay={1.5} style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                        Featured Fashion
                      </AnimatedText>
                      {loading ? (
                        <div style={{ 
                          display: 'flex', 
                          justifyContent: 'center', 
                          alignItems: 'center', 
                          minHeight: '200px',
                          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                          backgroundSize: '200% 100%',
                          animation: 'loading 1.5s infinite'
                        }}>
                          <LoadingSpinner size={40} color="#daaa58" />
                        </div>
                      ) : fashionProducts.length > 0 ? (
                        <StaggeredGrid className="category-section" staggerDelay={0.2}>
                          <ShopProducts layout="grid three-column" products={fashionProducts} />
                        </StaggeredGrid>
                      ) : (
                        <div style={{ color: '#2c3e50', textAlign: 'center', padding: '40px' }}>
                          <p>No fashion items found.</p>
                        </div>
                      )}
                  
                  </FadeInOnScroll>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* category showcase section */}
        {/* <FadeInOnScroll direction="up" delay={1.0}>
          <CategoryShowcase />
        </FadeInOnScroll> */}

        {/* countdown */}
        <FadeInOnScroll direction="up" delay={1.1}>
          <RecurringCountDown
            spaceTopClass="pt-115"
            spaceBottomClass="pb-115"
            bgImg="/assets/img/bg/bg.png"
            cycleDays={10}
          />
        </FadeInOnScroll>

        {/*  */}
        <FadeInOnScroll direction="up" delay={1.2}>
          <FeatureIconTwo spaceTopClass="pt-100" spaceBottomClass="pb-60" />
        </FadeInOnScroll>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFurniture;
