import React from "react";
import { Link } from "react-router-dom";

const InlineBanner = ({ banners }) => {
  return (
    <div className="inline-banner-area pt-80 pb-80">
      <div className="container">
        <div className="row">
          {banners.map((banner, key) => (
            <div key={key} className="col-lg-6 col-md-6">
              <div className="single-banner mb-30">
                <Link to={process.env.PUBLIC_URL + banner.url}>
                  <div className="banner-img">
                    <img
                      src={process.env.PUBLIC_URL + banner.image}
                      alt={banner.title}
                      className="img-fluid"
                    />
                  </div>
                  <div className="banner-content">
                    <h3>{banner.title}</h3>
                    <p>{banner.subtitle}</p>
                    <button className={`btn btn-${banner.btnStyle || 'primary'}`}>
                      {banner.btnText}
                    </button>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InlineBanner; 