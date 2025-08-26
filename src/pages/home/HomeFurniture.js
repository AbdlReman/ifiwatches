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
import { hasCategory } from "../../helpers/categoryMapper";
import "../../assets/css/category-layouts.css";

// Add CSS for loading animations and simple fade effects
const simpleStyles = `
  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes slideInLeft {
    from { opacity: 0; transform: translateX(-30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes slideInRight {
    from { opacity: 0; transform: translateX(30px); }
    to { opacity: 1; transform: translateX(0); }
  }
  
  .product-skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 8px;
  }
  
  .fade-in {
    animation: fadeIn 0.6s ease-out;
  }
  
  .slide-in-left {
    animation: slideInLeft 0.6s ease-out;
  }
  
  .slide-in-right {
    animation: slideInRight 0.6s ease-out;
  }
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #daaa58;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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
  const [videoAd, setVideoAd] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoMuted, setVideoMuted] = useState(true);
  const [showControls, setShowControls] = useState(false);
  const [loading, setLoading] = useState(false); // Changed to false to show content immediately
  const [productsLoaded, setProductsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Reduced delay for faster product loading
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Fetch products
        const entries = await client.getEntries({ content_type: "product" });
        
        // Fetch video ad
        try {
          const videoEntries = await client.getEntries({ content_type: "videoAds" });
          if (videoEntries.items.length > 0) {
            const videoData = videoEntries.items[0].fields;
            setVideoAd({
              id: videoEntries.items[0].sys.id,
              video: videoData.video,
          
              
            });
          }
        } catch (videoError) {
          console.log("No video ads found or error fetching video:", videoError);
        } finally {
          setVideoLoading(false);
        }
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
          hasCategory(product, "watches")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const watchStraps = items.filter(product =>
          hasCategory(product, "watchstraps")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const eyewear = items.filter(product =>
          hasCategory(product, "eyewear")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3); // Latest 3 for Eyewear

        const accessories = items.filter(product =>
          hasCategory(product, "ringsaccessories")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const perfumes = items.filter(product =>
          hasCategory(product, "perfumes")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        const mobileGadgets = items.filter(product =>
          hasCategory(product, "mobilegadgets")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4); // Latest 4

        // Debug logging
        console.log("Total products fetched:", items.length);
        console.log("Mobile gadgets products found:", mobileGadgets.length);
        console.log("Mobile gadgets products:", mobileGadgets);
        
        // Log all unique categories to help debug
        const allCategories = items.reduce((acc, product) => {
          if (product.category) {
            if (Array.isArray(product.category)) {
              product.category.forEach(cat => {
                if (cat && typeof cat === 'string') {
                  acc.add(cat.toLowerCase());
                }
              });
            } else if (typeof product.category === 'string') {
              acc.add(product.category.toLowerCase());
            }
          }
          return acc;
        }, new Set());
        console.log("All unique categories in products:", Array.from(allCategories));

        const fashion = items.filter(product =>
          hasCategory(product, "fashion")
        ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3); // Latest 3 for Fashion

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
    
    // Reduced delay for faster product fetching
    const timer = setTimeout(fetchProducts, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simple loading spinner component
  const LoadingSpinner = () => (
    <div className="loading-spinner"></div>
  );

  // Product section loading component
  const ProductSectionLoader = ({ title, products, category, animationClass = "fade-in" }) => (
    <div className={`product-area ${animationClass}`}>
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
            <LoadingSpinner />
            </div>
          ) : products.length > 0 ? (
            <Suspense fallback={
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '200px' 
              }}>
              <LoadingSpinner />
              </div>
            }>
            <div className="category-section">
                <ShopProducts layout="grid four-column" products={products} />
            </div>
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
  );

  return (
    <Fragment>
      <style>{simpleStyles}</style>
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
        {/* hero banner section - Instant load */}
        <div className="fade-in">
          <div>
            <HeroBanner />
          </div>
        </div>

        {/* banner - Instant load */}
        <div className="fade-in">
          <BannerTwentySeven spaceTopClass="pt-80" spaceBottomClass="pb-60" />
        </div>

        {/* Features Section - Instant load */}
        <ShippingReturnsFeatures />

        {/* latest products section - Quick load */}
        <div className="fade-in">
          <LatestProductSection spaceBottomClass="pb-100" />
        </div>

        {/* luxury watches section - Quick load */}
        <ProductSectionLoader 
          title="WATCHES" 
          products={watchesProducts} 
          category="watches" 
          animationClass="fade-in"
        />

        <br/>

        {/* Video Advertisement Section */}
        {(videoAd || videoLoading) && (
          <div className="video-ad-section fade-in" style={{
            width: '100%',
            background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 50%, #f8f9fa 100%)',
            padding: '80px 0',
            margin: '0',
            borderTop: '1px solid #e8eaed',
            borderBottom: '1px solid #e8eaed'
          }}>
            {videoLoading ? (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '400px',
                background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'loading 1.5s infinite'
              }}>
                <div className="loading-spinner"></div>
              </div>
            ) : videoAd ? (
              <div style={{ width: '100%' }}>
                <div style={{
                  textAlign: 'center',
                  marginBottom: '2rem',
                  padding: '0 20px'
                }}>
                  <h3 style={{
                    color: '#2c3e50',
                    fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                    fontWeight: '800',
                    marginBottom: '1rem',
                    textTransform: 'uppercase',
                    letterSpacing: '2px'
                  }}>
                    {videoAd.title}
                  </h3>
                  {videoAd.description && (
                    <p style={{
                      color: '#666',
                      fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                      lineHeight: '1.6',
                      maxWidth: '800px',
                      margin: '0 auto'
                    }}>
                      {videoAd.description}
                    </p>
                  )}
                </div>
                <div 
                  className="video-container"
                  style={{
                    position: 'relative',
                    width: 'calc(100% - 40px)',
                    height: '0',
                    paddingBottom: 'calc(56.25% - 22.5px)', // 16:9 aspect ratio with margin adjustment
                    background: '#000',
                    overflow: 'hidden',
                    borderRadius: '20px',
                    margin: '0 20px',
                    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={() => setShowControls(true)}
                  onMouseLeave={() => setShowControls(false)}
                >
                  <video
                    ref={(el) => {
                      if (el) {
                        el.muted = videoMuted;
                      }
                    }}
                    autoPlay
                    muted={videoMuted}
                    loop
                    playsInline
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '20px'
                    }}
                    poster={videoAd.video?.fields?.file?.url ? `${videoAd.video.fields.file.url}?w=1200&h=675&fit=fill` : undefined}
                  >
                    <source src={videoAd.video?.fields?.file?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  
                  {/* Video Controls Overlay */}
                  <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '20px',
                    display: 'flex',
                    gap: '10px',
                    opacity: showControls ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    zIndex: 10
                  }}>
                    {/* Play/Pause Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const video = e.target.closest('.video-container').querySelector('video');
                        if (video.paused) {
                          video.play();
                          setVideoPaused(false);
                        } else {
                          video.pause();
                          setVideoPaused(true);
                        }
                      }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '18px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                    >
                      {videoPaused ? '▶️' : '⏸️'}
                    </button>
                    
                    {/* Mute/Unmute Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideoMuted(!videoMuted);
                      }}
                      style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderRadius: '50%',
                        width: '50px',
                        height: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'white',
                        fontSize: '18px',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.9)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(0, 0, 0, 0.8)'}
                    >
                      {videoMuted ? '🔇' : '🔊'}
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <br/>

        {/* 2. WATCH STRAPS - Masonry Grid Style */}
        <div className="watchstraps-masonry-section fade-in">
          <div className="container">
            {/* Header Section */}
            <SectionTitle titleText=" WATCH STRAPS" positionClass="text-center" />

            
            
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
                  <LoadingSpinner />
                </div>
              ) : watchStrapsProducts.length > 0 ? (
                <div className="category-section">
                  <ShopProducts layout="grid four-column" products={watchStrapsProducts} />
                </div>
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
        </div>
          

        {/* 3. EYEWEAR - Split Layout with Diagonal Design */}
        <div className="eyewear-split-section fade-in">
          <div className="container">
            <div className="eyewear-content">
              <div className="row">
                {/* Products Section - Left Side (8 columns) */}
                <div className="col-lg-8">
                   <div>
             <div className="slide-in-left">
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
                  <LoadingSpinner />
                </div>
              ) : eyewearProducts.length > 0 ? (
                <div className="category-section">
                  <ShopProducts layout="grid three-column" products={eyewearProducts} />
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p>No Eyewear found.</p>
                </div>
              )}
             </div>
            </div>
                </div>

                {/* Info Panel - Right Side (4 columns) */}
                <div className="col-lg-4">
                  <div className="slide-in-right">
                    <div className="eyewear-info-panel">
                      
                     
                      <p className="eyewear-info-panel p">
                       Our Premium Eyewear Collection.
                      </p>
                    
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
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

        {/* 4. ACCESSORIES - Card Grid with Floating Elements */}
        <ProductSectionLoader 
          title="Featured Accessories" 
          products={accessoriesProducts} 
          category="rings-accessories" 
          animationClass="fade-in"
        />

        <br/>

        {/* 5. PERFUMES - Elegant Minimalist Design */}
        <div className="perfumes-elegant-section fade-in">
          <div className="container">
            {/* Elegant Banner */}
            
            <div>
            
                <h2 className="perfumes-banner h2">
                  AM PERFUMES
                </h2>
             
            </div>

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
                  <LoadingSpinner />
                </div>
              ) : perfumesProducts.length > 0 ? (
                <div className="category-section">
                  <ShopProducts layout="grid four-column" products={perfumesProducts} />
                </div>
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
        </div>

        {/* 6. MOBILE GADGETS - Tech-Inspired Grid */}
        <div className="mobilegadgets-tech-section fade-in">
          <div className="container">
            <div className="mobilegadgets-content">
              {/* Header */}
              <SectionTitle titleText="Mobile Gadgets" positionClass="text-center" />

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
                    <LoadingSpinner />
                  </div>
                ) : mobileGadgetsProducts.length > 0 ? (
                  <div className="category-section">
                    <ShopProducts layout="grid four-column" products={mobileGadgetsProducts} />
                  </div>
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
        </div>

        {/* 7. FASHION - Magazine Style Layout */}
        <div className="fashion-magazine-section fade-in">
          <div className="container">
            <div className="fashion-content">
              <div className="row">
                {/* Info Panel - Left Side (4 columns) */}
                <div className="col-lg-4">
                  <div className="slide-in-right">
                    <div className="fashion-info-panel">
                      
                     
                      <p className="fashion-info-panel p">
                        Our fashion collection:
                      </p>
                     
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
                    </div>
                  </div>
                </div>

                {/* Products Section - Right Side (8 columns) */}
                <div className="col-lg-8">
                  <div className="slide-in-left">
                    
                      <h3 style={{ color: '#2c3e50', marginBottom: '20px', textAlign: 'center' }}>
                        Featured Fashion
                      </h3>
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
                          <LoadingSpinner />
                        </div>
                      ) : fashionProducts.length > 0 ? (
                        <div className="category-section">
                          <ShopProducts layout="grid three-column" products={fashionProducts} />
                        </div>
                      ) : (
                        <div style={{ color: '#2c3e50', textAlign: 'center', padding: '40px' }}>
                          <p>No fashion items found.</p>
                        </div>
                      )}
                  
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>

        {/* category showcase section */}
        {/* <div className="fade-in">
          <CategoryShowcase />
        </div> */}

        {/* countdown */}
        {/* <div className="fade-in">
          <RecurringCountDown
            spaceTopClass="pt-115"
            spaceBottomClass="pb-115"
            cycleDays={10}
          />
        </div> */}

        {/*  */}
        <div className="fade-in">
          <FeatureIconTwo spaceTopClass="pt-100" spaceBottomClass="pb-60" />
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFurniture;
