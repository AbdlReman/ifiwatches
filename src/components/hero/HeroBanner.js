import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EffectFade } from 'swiper';
import Swiper, { SwiperSlide } from "../swiper";

const HeroBanner = () => {
  const [bannerData, setBannerData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [totalImages, setTotalImages] = useState(0);

  // Fetch slider data from Contentful
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        setIsLoading(true);
        
        // Import client dynamically to avoid blocking initial render
        const { default: client } = await import("../../data/contentful");
        
        const response = await client.getEntries({
          content_type: 'slider',
          order: 'sys.createdAt',
          limit: 5 // Limit to 5 items for faster loading
        });

        if (response.items && response.items.length > 0) {
          const processedData = response.items.map((item) => ({
            id: item.sys.id,
            image: item.fields.image?.fields?.file?.url || '',
            link: item.fields.link || '/shop'
          }));

          setBannerData(processedData);
          setTotalImages(processedData.length);
        } else {
          // If no Contentful data, show empty state
          setBannerData([]);
          setTotalImages(0);
        }
      } catch (error) {
        console.error('Error fetching slider data:', error);
        setBannerData([]);
        setTotalImages(0);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSliderData();
  }, []);

  // Handle image load completion
  const handleImageLoad = () => {
    setImagesLoaded(prev => prev + 1);
  };

  // Check if all images are loaded
  const allImagesLoaded = imagesLoaded >= totalImages && totalImages > 0;

  // Slider configuration
  const params = {
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    modules: [EffectFade],
    loop: true,
    speed: 1000,
    navigation: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      clickable: true,
    },
    // Prevent scroll issues
    allowTouchMove: false,
    preventInteractionOnTransition: true
  };

  // Skeleton loader component
  const SkeletonLoader = () => (
    <div className="slider-skeleton-container">
      <div className="slider-skeleton">
        <div className="skeleton-content">
          <div className="skeleton-image"></div>
          <div className="skeleton-text">
            <div className="skeleton-line"></div>
            <div className="skeleton-line short"></div>
          </div>
        </div>
      </div>
    </div>
  );

  // Show skeleton while loading or if no data
  if (isLoading || bannerData.length === 0) {
    return (
      <div className="hero-banner-section skeleton-mode">
        <style>
          {`
            .hero-banner-section.skeleton-mode {
              width: 100%;
              margin: 0;
              padding: 0;
              overflow: hidden;
              position: relative;
              background: #f8f9fa;
            }
            
            .slider-skeleton-container {
              width: 100%;
              height: 400px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            }
            
            .slider-skeleton {
              width: 100%;
              max-width: 1200px;
              height: 100%;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
              overflow: hidden;
              position: relative;
            }
            
            .skeleton-content {
              padding: 20px;
              height: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            
            .skeleton-image {
              width: 80%;
              height: 200px;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: skeleton-loading 2s infinite;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            
            .skeleton-text {
              width: 60%;
              text-align: center;
            }
            
            .skeleton-line {
              height: 12px;
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: skeleton-loading 2s infinite;
              border-radius: 6px;
              margin-bottom: 10px;
            }
            
            .skeleton-line.short {
              width: 40%;
              margin: 0 auto;
            }
            
            @keyframes skeleton-loading {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            
            @media (max-width: 768px) {
              .slider-skeleton-container {
                height: 300px;
              }
              
              .skeleton-image {
                height: 150px;
                width: 90%;
              }
              
              .skeleton-text {
                width: 80%;
              }
            }
            
            @media (max-width: 480px) {
              .slider-skeleton-container {
                height: 250px;
              }
              
              .skeleton-image {
                height: 120px;
                width: 95%;
              }
            }
          `}
        </style>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div className="hero-banner-section" style={{ 
      width: '100%', 
      margin: 0, 
      padding: 0,
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>
        {`
          /* Reset all margins and paddings */
          .hero-banner-section,
          .hero-banner-section * {
            box-sizing: border-box;
          }
          
          .hero-banner-section .slider-area {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          .hero-banner-section .slider-active {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          .hero-banner-section .swiper {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          .hero-banner-section .swiper-wrapper {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          
          .hero-banner-section .swiper-slide {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          .hero-banner-section .single-slider {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            position: relative !important;
          }
          
          .hero-banner-section .single-slider a {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
          }
          
          .hero-banner-section .single-slider img {
            width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 0 !important;
            padding: 0 !important;
            object-fit: cover !important;
            cursor: pointer !important;
            transition: all 0.4s ease !important;
            box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15) !important;
            opacity: ${allImagesLoaded ? '1' : '0'};
            transform: ${allImagesLoaded ? 'scale(1)' : 'scale(0.95)'};
            transition: opacity 0.6s ease, transform 0.6s ease;
          }
          
          .hero-banner-section .swiper-pagination {
            position: absolute !important;
            bottom: 20px !important;
            left: 50% !important;
            transform: translateX(-50%) !important;
            z-index: 10 !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 8px !important;
          }
          
          .hero-banner-section .swiper-pagination-bullet {
            width: 8px !important;
            height: 8px !important;
            background: rgba(255, 255, 255, 0.5) !important;
            opacity: 1 !important;
            margin: 0 !important;
            border-radius: 50% !important;
            cursor: pointer !important;
            transition: all 0.3s ease !important;
          }
          
          .hero-banner-section .swiper-pagination-bullet-active {
            background: #fff !important;
            transform: scale(1.2) !important;
          }
          
          /* Prevent scroll bar */
          .hero-banner-section {
            overflow: hidden !important;
          }
          
          /* Mobile responsive */
          @media (max-width: 768px) {
            .hero-banner-section .swiper-pagination {
              bottom: 15px !important;
              gap: 6px !important;
            }
            
            .hero-banner-section .swiper-pagination-bullet {
              width: 6px !important;
              height: 6px !important;
            }
            
            .hero-banner-section .swiper-pagination-bullet-active {
              transform: scale(1.1) !important;
            }
            
            .hero-banner-section .single-slider img {
              height: auto !important;
              min-height: 250px !important;
              max-height: 400px !important;
              object-fit: cover !important;
              width: 100% !important;
            }
            
            .hero-banner-section .single-slider {
              min-height: 250px !important;
              max-height: 400px !important;
              overflow: hidden !important;
            }
          }
          
          @media (max-width: 480px) {
            .hero-banner-section .swiper-pagination {
              bottom: 10px !important;
              gap: 4px !important;
            }
            
            .hero-banner-section .swiper-pagination-bullet {
              width: 5px !important;
              height: 5px !important;
            }
            
            .hero-banner-section .single-slider img {
              height: auto !important;
              min-height: 200px !important;
              max-height: 350px !important;
              object-fit: cover !important;
              width: 100% !important;
            }
            
            .hero-banner-section .single-slider {
              min-height: 200px !important;
              max-height: 350px !important;
              overflow: hidden !important;
            }
          }
          
          @media (min-width: 769px) and (max-width: 1299px) {
            .hero-banner-section .single-slider img {
              height: auto !important;
              max-height: 700px !important;
              object-fit: cover !important;
            }
          }
          
          @media (min-width: 1300px) {
            .hero-banner-section .single-slider img {
              height: auto !important;
              min-height: 500px !important;
              max-height: 800px !important;
              object-fit: cover !important;
              width: 100% !important;
            }
            
            .hero-banner-section .single-slider {
              min-height: 500px !important;
              max-height: 800px !important;
              overflow: hidden !important;
            }
          }
          
          @media (min-width: 1600px) {
            .hero-banner-section .single-slider img {
              height: auto !important;
              min-height: 550px !important;
              max-height: 900px !important;
            }
            
            .hero-banner-section .single-slider {
              min-height: 550px !important;
              max-height: 900px !important;
            }
          }
          
          @media (min-width: 1920px) {
            .hero-banner-section .single-slider img {
              height: auto !important;
              min-height: 600px !important;
              max-height: 1000px !important;
            }
            
            .hero-banner-section .single-slider {
              min-height: 600px !important;
              max-height: 1000px !important;
            }
          }
        `}
      </style>
      <div className="slider-area">
        <div className="slider-active nav-style-1">
          <Swiper options={params}>
            {bannerData.map((banner, key) => (
              <SwiperSlide key={banner.id || key}>
                <div className="single-slider">
                  <Link 
                    to={process.env.PUBLIC_URL + banner.link}
                  >
                    <img 
                      src={banner.image.startsWith('http') ? banner.image : process.env.PUBLIC_URL + banner.image}
                      alt="Banner"
                      className="img-fluid w-100"
                      onLoad={handleImageLoad}
                      onError={(e) => {
                        // Fallback to default image if loading fails
                        e.target.src = process.env.PUBLIC_URL + "/assets/img/banner/banner-1.jpg";
                        handleImageLoad();
                      }}
                      onMouseOver={(e) => {
                        e.target.style.transform = "scale(1.02)";
                        e.target.style.boxShadow = "0 25px 60px rgba(0, 0, 0, 0.25)";
                      }}
                      onMouseOut={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "0 15px 40px rgba(0, 0, 0, 0.15)";
                      }}
                    />
                  </Link>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner; 