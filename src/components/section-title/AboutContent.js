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
              <h2>Our Story</h2>
              <p>
                Founded in 2019, IFIwatches was born from a simple yet powerful vision: 
                to provide Pakistani customers with premium quality watches that combine luxury, affordability, and fast delivery. What started as a small watch boutique has grown into Pakistan's most trusted name in luxury timepieces.
              </p>
              <p>
                We understand that every customer is unique, and so are their preferences. That's why we've dedicated ourselves to creating a diverse range of luxury watches, sports watches, and classic timepieces that cater to different styles and budgets. At IFIwatches, every customer can find their perfect timepiece.
              </p>
              <div className="about-features mt-4">
                <div className="row">
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Premium Quality Watches</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Fast Delivery</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Affordable Prices</span>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="feature-item">
                      <i className="fa fa-check-circle text-success"></i>
                      <span>Nationwide Service</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose IFIwatches Section */}
        <div className="row mt-5">
          <div className="col-lg-12">
            <div className="why-choose-ifiwatches text-center">
              <h2 className="mb-5">Why Choose IFIwatches?</h2>
              <div className="row">
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-gem fa-3x text-brand"></i>
                    </div>
                    <h4>Premium Quality</h4>
                    <p>We offer only the finest luxury timepieces with exceptional craftsmanship and precision engineering.</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-dollar-sign fa-3x text-brand"></i>
                    </div>
                    <h4>Affordable Luxury</h4>
                    <p>Our collection features luxury watches at competitive prices, making premium timepieces accessible to everyone.</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-shipping-fast fa-3x text-brand"></i>
                    </div>
                    <h4>Fast Delivery</h4>
                    <p>We ensure quick and reliable delivery throughout Pakistan, so you can enjoy your new timepiece without delay.</p>
                  </div>
                </div>
                <div className="col-lg-3 col-md-6 mb-4">
                  <div className="choose-card">
                    <div className="choose-icon mb-3">
                      <i className="fa fa-headset fa-3x text-brand"></i>
                    </div>
                    <h4>Expert Support</h4>
                    <p>Our team of watch experts provides professional guidance to help you choose the perfect timepiece.</p>
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
                    <p>We never compromise on quality. Every watch in our collection meets the highest standards of luxury and precision.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-card">
                    <div className="value-icon mb-3">
                      <i className="fa fa-handshake fa-3x text-brand"></i>
                    </div>
                    <h4>Customer Trust</h4>
                    <p>Building lasting relationships with our customers through transparency, reliability, and exceptional service.</p>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 mb-4">
                  <div className="value-card">
                    <div className="value-icon mb-3">
                      <i className="fa fa-rocket fa-3x text-brand"></i>
                    </div>
                    <h4>Innovation</h4>
                    <p>Continuously evolving our collection to offer the latest trends and timeless classics in luxury timepieces.</p>
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
                      <p>"IFIwatches has the best luxury timepieces I've ever seen. The quality and affordability are unmatched!"</p>
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
                      <p>"Amazing customer service and beautiful watches. I feel so confident wearing my IFIwatches timepiece!"</p>
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
                      <p>"Perfect quality and fast delivery. IFIwatches truly understands what customers need."</p>
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
              <h2>Our Commitment</h2>
              <p className="lead">
                At IFIwatches, we are committed to providing Pakistani customers with the best quality luxury watches that combine elegance with affordability. We believe every customer deserves to own a premium timepiece, and we're here to make that possible with our fast delivery service throughout Pakistan.
              </p>
              <div className="mt-4">
                <div className="btn-hover">
                  <Link to="/shop" className="btn btn-brand btn-lg">
                    Shop Our Collection
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