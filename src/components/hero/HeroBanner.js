import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { EffectFade } from 'swiper';
import Swiper, { SwiperSlide } from "../swiper";
import client from "../../data/contentful";

const HeroBanner = () => {
  const [bannerData, setBannerData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch slider data from Contentful
  useEffect(() => {
    const fetchSliderData = async () => {
      try {
        const response = await client.getEntries({
          content_type: 'slider',
          order: 'sys.createdAt'
        });

        const processedData = response.items.map((item, index) => ({
          id: item.sys.id,
          image: item.fields.image?.fields?.file?.url || "/assets/img/banner/hero.png",
          link: item.fields.link || "/shop"
        }));

        setBannerData(processedData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching slider data:', error);
        // Fallback to default data if Contentful fails
        setBannerData([
          {
            id: 1,
            image: "/assets/img/banner/hero.png",
            link: "/shop"
          },
          {
            id: 2,
            image: "/assets/img/banner/hero.png",
            link: "/shop"
          },
          {
            id: 3,
            image: "/assets/img/banner/hero.png",
            link: "/shop"
          }
        ]);
        setLoading(false);
      }
    };

    fetchSliderData();
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

  // Show loading state or empty state
  if (loading) {
    return (
      <div className="hero-banner-section" style={{ 
        width: '100%', 
        margin: 0, 
        padding: 0,
        height: '400px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div>Loading slider...</div>
      </div>
    );
  }

  // Don't render if no data
  if (bannerData.length === 0) {
    return null;
  }

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
                      className="img-fluid w-100"
                      style={{
                        cursor: 'pointer',
                        transition: 'all 0.4s ease',
                        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)',
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        margin: 0,
                        padding: 0
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