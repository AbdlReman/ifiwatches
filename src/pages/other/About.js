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
        titleTemplate="About Us – IFI (Iconic Futures Innovations)"
        description="IFI – Iconic Futures Innovations (ifilifestyle): a trusted multi-brand destination for premium watches, signature perfumes, men’s fabrics, and fashion accessories. Quality, value, and fast nationwide delivery across Pakistan."
      /> 
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "About Us", path: process.env.PUBLIC_URL + pathname }
          ]} 
        />

        {/* section title with text */}
        <SectionTitleWithText
          spaceTopClass="pt-100"
          spaceBottomClass="pb-95"
          title="About Us"
          description={
            "Welcome to IFI – Iconic Futures Innovations (ifilifestyle). At IFI, we believe every customer deserves access to premium quality products that combine style, innovation, and value. Founded with a vision to create a trusted multi-brand platform, we bring together a curated selection of luxury watches, signature perfumes, men’s fabrics, fashion accessories, and more — all in one place."
          }
        />

        {/* about content */}
        <AboutContent />

        <div className="container pt-30 pb-30">
          <div className="row">
            <div className="col-12">
              <h3 className="mb-20">Our Journey</h3>
              <p>
                Our journey began with a simple idea: quality should never be out of reach. What started as a small initiative has grown into a nationwide lifestyle destination, where customers from Karachi to Swat can enjoy the finest products with fast delivery and exceptional service.
              </p>
              <h3 className="mb-20 mt-30">Why Choose Us</h3>
              <p>
                We’re not just selling products — we’re building connections. Every item in our collection is handpicked, tested for quality and durability, and backed by our commitment to customer satisfaction. Your feedback drives our growth, shapes our collections, and inspires our innovations.
              </p>
              <h3 className="mb-20 mt-30">Our Promise</h3>
              <ul style={{ paddingLeft: 18 }}>
                <li>Premium Quality – Only the best for our customers.</li>
                <li>Affordable Luxury – Making high-end products accessible.</li>
                <li>Nationwide Reach – Fast, reliable delivery across Pakistan.</li>
                <li>Customer-First Service – Your satisfaction is our top priority.</li>
              </ul>
              <h3 className="mb-20 mt-30">Why choose this website</h3>
              <p>
                At IFI, we’re creating more than a store — we’re building a brand you can trust for years to come. Whether you’re searching for timeless elegance, modern style, or innovative accessories, you’ll find it here.
              </p>
              <p className="mt-20"><strong>Iconic Futures Innovations – Where Quality Meets Trust.</strong></p>
            </div>
          </div>
        </div>

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
