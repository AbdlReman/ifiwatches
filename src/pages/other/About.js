import { Fragment } from "react"; 
import { useLocation } from "react-router-dom"; 
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import SectionTitleWithText from "../../components/section-title/SectionTitleWithText";
import AboutContent from "../../components/section-title/AboutContent";
import BannerOne from "../../wrappers/banner/BannerOne";
import TextGridOne from "../../wrappers/text-grid/TextGridOne";
import FunFactOne from "../../wrappers/fun-fact/FunFactOne";
import TeamMemberOne from "../../wrappers/team-member/TeamMemberOne";
import BrandLogoSliderOne from "../../wrappers/brand-logo/BrandLogoSliderOne";

const About = () => {
  let { pathname } = useLocation();

  return (
    <Fragment>
      <SEO
        titleTemplate="About IFIwatches"
        description="Learn about IFIwatches, Pakistan's premier destination for premium quality watches. We believe every customer deserves to own a luxury timepiece that combines elegance with affordability. Our carefully curated collection of watches ensures fast delivery throughout Pakistan."
      /> 
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "About IFIwatches", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />

        {/* section title with text */}
        <SectionTitleWithText spaceTopClass="pt-100" spaceBottomClass="pb-95" 
          title="About IFIwatches"
          description="IFIwatches is Pakistan's premier destination for premium quality watches. We believe every customer deserves to own a luxury timepiece that combines elegance with affordability. Our carefully curated collection of watches ensures fast delivery throughout Pakistan."
        />

        {/* about content */}
        <AboutContent />

        {/* banner */}
        {/* <BannerOne spaceBottomClass="pb-70" /> */}

         {/* fun fact */}
         <FunFactOne
          spaceTopClass="pt-100"
          spaceBottomClass="pb-70"
          bgClass="bg-gray-3"
        />


        {/* text grid */}
        <TextGridOne spaceBottomClass="pb-70 pt-100 " />

       
        {/* team member */}
        {/* <TeamMemberOne spaceTopClass="pt-95" spaceBottomClass="pb-70" /> */}

        {/* brand logo slider */}
        {/* <BrandLogoSliderOne spaceBottomClass="pb-70" /> */}
      </LayoutOne>
    </Fragment>
  );
};

export default About;
