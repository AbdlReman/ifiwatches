import React, { Fragment } from "react";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import HeroSliderTwentySeven from "../../wrappers/hero-slider/HeroSliderTwentySeven";
import BannerTwentySeven from "../../wrappers/banner/BannerTwentySeven";
import ProductSection from "../../wrappers/product/ProductSection";
import RecurringCountDown from "../../wrappers/countdown/RecurringCountDown";
import FeatureIconTwo from "../../wrappers/feature-icon/FeatureIconTwo";
import LatestProductSection from "../../wrappers/product/LatestProductSection";
import CategoryShowcase from "../../components/category/CategoryShowcase";

const HomeFurniture = () => {
  return (
    <Fragment>
      <SEO
        titleTemplate="IFIwatches - Premium Quality Watches"
        description="Discover premium quality watches at IFIwatches. Luxury timepieces with a focus on affordability and fast delivery throughout Pakistan."
      />
      <LayoutOne headerTop="visible">
        {/* hero slider */}
        <HeroSliderTwentySeven />

        {/* banner */}
        <BannerTwentySeven spaceTopClass="pt-80" spaceBottomClass="pb-60" />

        {/* latest products section */}
        <LatestProductSection spaceBottomClass="pb-100" />

        {/* luxury watches section */}
        <ProductSection
          spaceBottomClass="pb-100"
          category="classic"
          title="CLASSIC WATCHES"
        />

        {/* sports watches section */}
        <ProductSection
          spaceBottomClass="pb-100"
          category="sports"
          title="SPORTS WATCHES"
        />

        {/* category showcase section */}
        <CategoryShowcase />

        {/* countdown */}
        <RecurringCountDown
          spaceTopClass="pt-115"
          spaceBottomClass="pb-115"
          bgImg="/assets/img/bg/bg.png"
          cycleDays={10}
        />

        {/* feature icon */}
        <FeatureIconTwo spaceTopClass="pt-100" spaceBottomClass="pb-60" />
      </LayoutOne>
    </Fragment>
  );
};

export default HomeFurniture;
