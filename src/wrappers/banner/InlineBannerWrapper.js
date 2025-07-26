import React from "react";
import classicBannerData from "../../data/banner/banner-lingerie.json";
import smartBannerData from "../../data/banner/banner-nightwear.json";

const InlineBannerWrapper = () => {
  const classicBanner = classicBannerData[0];
  const smartBanner = smartBannerData[0];

  return (
    <div className="inline-banner-wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="inline-banner classic-banner">
              <div className="banner-content">
                <h3>{classicBanner.title}</h3>
                <p>{classicBanner.subtitle}</p>
                <a href={classicBanner.url} className="btn btn-brand">
                  Shop Now
                </a>
              </div>
              <div className="banner-image">
                <img src={classicBanner.image} alt={classicBanner.title} />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 mb-4">
            <div className="inline-banner smart-banner">
              <div className="banner-content">
                <h3>{smartBanner.title}</h3>
                <p>{smartBanner.subtitle}</p>
                <a href={smartBanner.url} className="btn btn-brand">
                  Shop Now
                </a>
              </div>
              <div className="banner-image">
                <img src={smartBanner.image} alt={smartBanner.title} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InlineBannerWrapper; 