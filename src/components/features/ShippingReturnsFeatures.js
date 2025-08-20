import React from "react";
import { FadeInOnScroll } from "../AnimatedSection";

const ShippingReturnsFeatures = () => {
  return (
    <FadeInOnScroll direction="up" delay={0.35}>
      <div className="features-section" style={{
        padding: '40px 0',
        backgroundColor: '#fff',
        marginBottom: '20px'
      }}>
        <div className="container">
          <div className="row">
            {/* Free Shipping */}
            <div className="col-6 col-md-3 mb-3">
              <div className="feature-card" style={{
                textAlign: 'center',
                padding: '20px 10px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#daaa58',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: '#fff',
                  fontSize: '20px'
                }}>
                  <i className="fa fa-truck"></i>
                </div>
                <h5 style={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  Free Shipping
                </h5>
              </div>
            </div>

            {/* 100% Money Back */}
            <div className="col-6 col-md-3 mb-3">
              <div className="feature-card" style={{
                textAlign: 'center',
                padding: '20px 10px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#daaa58',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: '#fff',
                  fontSize: '20px'
                }}>
                  <i className="fa fa-credit-card"></i>
                </div>
                <h5 style={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  100% Money Back
                </h5>
              </div>
            </div>

            {/* 1 Year Warranty */}
            <div className="col-6 col-md-3 mb-3">
              <div className="feature-card" style={{
                textAlign: 'center',
                padding: '20px 10px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#daaa58',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: '#fff',
                  fontSize: '20px'
                }}>
                  <i className="fa fa-shield"></i>
                </div>
                <h5 style={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  1 Year Warranty
                </h5>
              </div>
            </div>

            {/* Easy Returns */}
            <div className="col-6 col-md-3 mb-3">
              <div className="feature-card" style={{
                textAlign: 'center',
                padding: '20px 10px',
                backgroundColor: '#fff',
                borderRadius: '8px',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#daaa58',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: '#fff',
                  fontSize: '20px'
                }}>
                  <i className="fa fa-undo"></i>
                </div>
                <h5 style={{
                  color: '#333',
                  fontSize: '14px',
                  fontWeight: '600',
                  marginBottom: '8px',
                  lineHeight: '1.2'
                }}>
                  Easy Returns
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeInOnScroll>
  );
};

export default ShippingReturnsFeatures;
