import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEO = ({ title, titleTemplate, description }) => {
    // Ensure title and titleTemplate are strings with fallbacks
    const safeTitle = title || "IFIwatches";
    const safeTitleTemplate = titleTemplate || "Premium Quality Watches | https://www.ifiwatches.pk/";
    
    return (
        <HelmetProvider>
            <Helmet>
                <meta charSet="utf-8" />
                <title>
                    {safeTitle} | {safeTitleTemplate}
                </title>
                <meta name="description" content={description} />
            </Helmet>
        </HelmetProvider>
    );
};

SEO.propTypes = {
    title: PropTypes.string,
    titleTemplate: PropTypes.string,
    description: PropTypes.string,
}

SEO.defaultProps = {
    title: "IFIwatches",
    titleTemplate: "Premium Quality Watches",
    description: "IFIwatches - Pakistan's premier destination for premium quality watches. Shop our curated collection of luxury timepieces with a focus on affordability and fast delivery throughout Pakistan.",
};

export default SEO;