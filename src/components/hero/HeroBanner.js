import React from "react";
import { Link } from "react-router-dom";

const HeroBanner = () => {
  return (
    <div className="hero-banner-section">
      <Link to={process.env.PUBLIC_URL + "/shop"}>
        <img 
          src={process.env.PUBLIC_URL + "/assets/img/banner/hero.png"}
          alt="Shop Now"
          className="img-fluid w-100"
          style={{
            cursor: 'pointer',
            transition: 'all 0.4s ease',
            boxShadow: '0 15px 40px rgba(0, 0, 0, 0.15)'
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
  );
};

export default HeroBanner; 