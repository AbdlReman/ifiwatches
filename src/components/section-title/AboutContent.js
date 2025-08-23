import React from "react";
import { Link } from "react-router-dom";

const AboutContent = () => {
  return (
    <div className="about-content-area pt-100 pb-100">
      <div className="container">
        {/* Our Story Section */}
        <div className="row">
          <div className="col-lg-12">
            <div className="about-content">
              <h2>Our Journey</h2>
              <p className="lead" style={{maxWidth: 900}}>
                Our journey began with a simple idea: <strong>quality should never be out of reach</strong>. What started as a small initiative has grown into a nationwide lifestyle destination, where customers from <strong>Karachi to Swat</strong> can enjoy the finest products with <strong>fast delivery</strong> and exceptional service.
              </p>
              <p style={{opacity: 0.9}}>
                Today, IFI (ifilifestyle) unites <em>luxury watches</em>, <em>signature perfumes</em>, <em>men’s fabrics</em>, and <em>fashion accessories</em> — carefully curated and backed by our commitment to your satisfaction.
              </p>
              <div className="about-features mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Premium Quality Products</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Fast Nationwide Delivery</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Affordable Luxury</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Customer-First Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="why-choose-ifilifestyle text-center">
              <h2 className="mb-3">Why Choose Us</h2>
              <p className="mb-5" style={{maxWidth: 900, margin: "0 auto", opacity: 0.95}}>
                We’re not just selling products — we’re <strong>building connections</strong>. Every item in our collection is handpicked, tested for <strong>quality</strong> and <strong>durability</strong>, and backed by our commitment to customer satisfaction. Your feedback drives our growth, shapes our collections, and inspires our innovations.
              </p>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-gem fa-3x text-brand"></i>
                    </div>
                    <h4>Premium Quality</h4>
                    <p>We offer only the finest products — from watches to fabrics.</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-dollar-sign fa-3x text-brand"></i>
                    </div>
                    <h4>Affordable Luxury</h4>
                    <p>Making high-end products accessible </p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-shipping-fast fa-3x text-brand"></i>
                    </div>
                    <h4>Fast Delivery</h4>
                    <p>Quick and reliable nationwide delivery across Pakistan.</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-headset fa-3x text-brand"></i>
                    </div>
                    <h4>Customer Support</h4>
                    <p>Our team is here to help — your satisfaction is our top priority.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="our-values text-center">
              <h2 className="mb-5">Our Values</h2>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-card">
                    <div className="value-icon mb-3">
                      <i className="fa fa-award fa-3x text-brand"></i>
                    </div>
                    <h4>Quality Excellence</h4>
                    <p>We never compromise on quality — every product meets our standards for excellence.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-card">
                    <div className="value-icon mb-3">
                      <i className="fa fa-handshake fa-3x text-brand"></i>
                    </div>
                    <h4>Customer Trust</h4>
                    <p>Building lasting relationships through transparency, reliability, and exceptional service.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-card">
                    <div className="value-icon mb-3">
                      <i className="fa fa-rocket fa-3x text-brand"></i>
                    </div>
                    <h4>Innovation</h4>
                    <p>Continuously evolving our collections to offer the latest trends and timeless essentials.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Testimonials Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="testimonials text-center">
              <h2 className="mb-5">What Our Customers Say</h2>
              <div className="row">
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <i className="fa fa-quote-left fa-2x text-brand mb-3"></i>
                      <p>"IFI has an amazing variety and excellent quality. Truly a one-stop lifestyle destination!"</p>
                      <div className="customer-info">
                        <h5>Ahmed Khan</h5>
                        <small>Lahore</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <i className="fa fa-quote-left fa-2x text-brand mb-3"></i>
                      <p>"Great service and quick delivery. The perfumes and watches are top quality!"</p>
                      <div className="customer-info">
                        <h5>Fatima Ali</h5>
                        <small>Karachi</small>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="testimonial-card">
                    <div className="testimonial-content">
                      <i className="fa fa-quote-left fa-2x text-brand mb-3"></i>
                      <p>"Perfect quality and fast delivery. IFI truly understands what customers need."</p>
                      <div className="customer-info">
                        <h5>Usman Hassan</h5>
                        <small>Islamabad</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Commitment Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="about-commitment text-center">
              <h2>Our Promise</h2>
           
              <div className="mt-3" style={{maxWidth: 900, margin: "0 auto", opacity: 0.95}}>
                
                <p className="mt-2 text-white"><em><strong>Iconic Futures Innovations – Where Quality Meets Trust.</strong></em></p>
              </div>
              <div className="mt-4">
                <div className="btn-hover">
                  <Link to="/shop" className="btn btn-brand btn-lg">
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutContent; 