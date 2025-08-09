import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEO = ({ title, titleTemplate, description }) => {
    // Ensure title and titleTemplate are strings with fallbacks
    const safeTitle = title || "IFI – Iconic Futures Innovations";
    const safeTitleTemplate = titleTemplate || "Iconic Futures Innovations | ifilifestyle";
    
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
    title: "IFI – Iconic Futures Innovations",
    titleTemplate: "Iconic Futures Innovations | ifilifestyle",
    description: "IFI (Iconic Futures Innovations) is a multi-brand lifestyle destination offering premium watches, signature perfumes, men’s fabrics, and fashion accessories—quality, value, and fast nationwide delivery.",
};

export default SEO;