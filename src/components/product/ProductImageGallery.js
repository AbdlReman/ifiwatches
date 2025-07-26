import React, { Fragment, useState } from "react";
import PropTypes from "prop-types";
import { EffectFade, Thumbs } from 'swiper';
import AnotherLightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import Swiper, { SwiperSlide } from "../../components/swiper";

const ProductImageGallery = ({ product }) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [index, setIndex] = useState(-1);
  
  // Handle images from Contentful - ensure we have at least one image
  const productImages = product?.images || (product?.image ? [product.image] : []);
  const displayImages = productImages.length > 0 ? productImages : ['/assets/img/product/default-product.jpg'];
  
  const slides = displayImages.map((img, i) => ({
      src: img,
      key: i,
  }));

  // swiper slider settings
  const gallerySwiperParams = {
    spaceBetween: 10,
    loop: true,
    effect: "fade",
    fadeEffect: {
      crossFade: true
    },
    thumbs: { swiper: thumbsSwiper },
    modules: [EffectFade, Thumbs],
  };

  const thumbnailSwiperParams = {
    onSwiper: setThumbsSwiper,
    spaceBetween: 10,
    slidesPerView: 4,
    touchRatio: 0.2,
    freeMode: true,
    loop: true,
    slideToClickedSlide: true,
    navigation: true
  };

  return (
    <Fragment>
      <div className="product-large-image-wrapper">
        {product.discount || product.new ? (
          <div className="product-img-badges">
            {product.discount ? (
              <span className="brand-color">-{product.discount}%</span>
            ) : (
              ""
            )}
            {product.new ? <span className="purple">New</span> : ""}
          </div>
        ) : (
          ""
        )}
        <Swiper options={gallerySwiperParams}>
          {displayImages.map((single, key) => (
            <SwiperSlide key={key}>
              <button className="lightgallery-button" onClick={() => setIndex(key)}>
                <i className="pe-7s-expand1"></i>
              </button>
              <div className="single-image">
                <img
                  src={single}
                  className="img-fluid"
                  alt={product.name || ""}
                  onError={(e) => {
                    e.target.src = '/assets/img/product/default-product.jpg';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
          <AnotherLightbox
              open={index >= 0}
              index={index}
              close={() => setIndex(-1)}
              slides={slides}
              plugins={[Thumbnails, Zoom, Fullscreen]}
          />
        </Swiper>
      </div>
      <div className="product-small-image-wrapper mt-15">
        <Swiper options={thumbnailSwiperParams}>
          {displayImages.map((single, key) => (
            <SwiperSlide key={key}>
              <div className="single-image">
                <img
                  src={single}
                  className="img-fluid"
                  alt={product.name || ""}
                  onError={(e) => {
                    e.target.src = '/assets/img/product/default-product.jpg';
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </Fragment>
  );
};

ProductImageGallery.propTypes = {
  product: PropTypes.shape({})
};

export default ProductImageGallery;
