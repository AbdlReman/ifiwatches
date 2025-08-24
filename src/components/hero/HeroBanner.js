import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EffectFade } from 'swiper';
import Swiper, { SwiperSlide } from "../swiper";

// Fallback banner data - will show immediately while Contentful data loads
const fallbackBannerData = [
  {
    id: 1,
    image: "/assets/img/banner/hero.png",
    link: "/shop"
  },
  {
    id: 2,
    image: "/assets/img/banner/hero.png", 
    link: "/watches"
  },
  {
    id: 3,
    image: "/assets/img/banner/hero.png",
    link: "/perfumes"
  }
];

const HeroBanner = () => {
  const [bannerData, setBannerData] = useState(fallbackBannerData); // Start with fallback data
  const [isLoading, setIsLoading] = useState(false);
  const [hasContentfulData, setHasContentfulData] = useState(false);

  // Fetch slider data from Contentful in background
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
          const processedData = response.items.map((item, index) => ({
            id: item.sys.id,
            image: item.fields.image?.fields?.file?.url || fallbackBannerData[index % fallbackBannerData.length].image,
            link: item.fields.link || fallbackBannerData[index % fallbackBannerData.length].link
          }));

          setBannerData(processedData);
          setHasContentfulData(true);
        }
      } catch (error) {
        console.error('Error fetching slider data:', error);
        // Keep fallback data if Contentful fails
      } finally {
        setIsLoading(false);
      }
    };

    // Delay the fetch slightly to prioritize initial render
    const timer = setTimeout(fetchSliderData, 100);
    return () => clearTimeout(timer);
  }, []);

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
    }
  };

  return (
    <div className="hero-banner-section" style={{ 
      width: '100%', 
      margin: 0, 
      padding: 0
    }}>
      <style>
        {`
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
          
          .hero-banner-section .slider-loading {
            position: relative;
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
            border-radius: 8px;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          
          .hero-banner-section .slider-skeleton {
            background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
            background-size: 200% 100%;
            animation: skeleton-loading 2s infinite;
            border-radius: 8px;
            min-height: 400px;
          }
          
          @keyframes skeleton-loading {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
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
          }
        `}
      </style>
      <div className="slider-area" style={{ 
        width: '100%', 
        margin: 0, 
        padding: 0,
        position: 'relative'
      }}>
        <div className="slider-active nav-style-1" style={{ 
          width: '100%', 
          margin: 0, 
          padding: 0
        }}>
          <Swiper options={params} style={{ width: '100%' }}>
            {bannerData.map((banner, key) => (
              <SwiperSlide key={banner.id || key} style={{ width: '100%' }}>
                <div className="single-slider" style={{ 
                  width: '100%',
                  margin: 0,
                  padding: 0
                }}>
                  <Link 
                    to={process.env.PUBLIC_URL + banner.link} 
                    style={{ 
                      display: 'block',
                      width: '100%',
                      margin: 0,
                      padding: 0
                    }}
                  >
                    <img 
                      src={banner.image.startsWith('http') ? banner.image : process.env.PUBLIC_URL + banner.image}
                      alt="Banner"
                      className={`img-fluid w-100 ${isLoading && !hasContentfulData ? 'slider-loading' : ''}`}
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: 0,
                        padding: 0,
                        minHeight: '400px',
                        objectFit: 'cover'
                      }}
                      onLoad={(e) => {
                        // Remove loading class when image loads
                        e.target.classList.remove('slider-loading');
                      }}
                      onError={(e) => {
                        // Fallback to default image if loading fails
                        e.target.src = process.env.PUBLIC_URL + "/assets/img/banner/banner-1.jpg";
                        e.target.classList.remove('slider-loading');
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