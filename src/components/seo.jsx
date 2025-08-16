import PropTypes from "prop-types";
import { Helmet, HelmetProvider } from "react-helmet-async";

const SEO = ({ 
  title, 
  titleTemplate, 
  description, 
  keywords,
  ogTitle,
  ogDescription,
  ogType = "website",
  ogUrl,
  ogImage = "https://www.ifilifestyle.com/logo.png",
  twitterCard = "summary_large_image",
  twitterTitle,
  twitterDescription,
  canonical,
  robots = "index, follow",
  pageType = "website"
}) => {
  // Ensure title and titleTemplate are strings with fallbacks
  const safeTitle = title || "IFI Lifestyle - Premium Watches, Perfumes & Fashion Accessories";
  const safeTitleTemplate = titleTemplate || "IFI Lifestyle | ifilifestyle.com";
  const safeDescription = description || "IFI Lifestyle (Iconic Futures Innovations) - Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories. Quality products with fast nationwide delivery.";
  const safeKeywords = keywords || "IFI Lifestyle, ifilifestyle, premium watches, luxury watches, perfumes, fashion accessories, men's fabrics, Pakistan, online shopping, Iconic Futures Innovations";
  const safeCanonical = canonical || "https://www.ifilifestyle.com/";
  
  // Structured Data for Organization
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "IFI Lifestyle",
    "alternateName": "Iconic Futures Innovations",
    "url": "https://www.ifilifestyle.com",
    "logo": "https://www.ifilifestyle.com/logo.png",
    "description": "Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "Pakistan"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service"
    },
    "sameAs": [
      "https://www.facebook.com/ifilifestyle",
      "https://www.instagram.com/ifilifestyle",
      "https://www.twitter.com/ifilifestyle"
    ]
  };

  // Structured Data for Website
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "IFI Lifestyle",
    "url": "https://www.ifilifestyle.com",
    "description": "Premium watches, perfumes, and fashion accessories",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.ifilifestyle.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  // Structured Data for BreadcrumbList
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.ifilifestyle.com"
      }
    ]
  };

  return (
    <HelmetProvider>
      <Helmet>
        <meta charSet="utf-8" />
        <title>
          {safeTitle} | {safeTitleTemplate}
        </title>
        
        {/* Meta Tags */}
        <meta name="description" content={safeDescription} />
        <meta name="keywords" content={safeKeywords} />
        <meta name="author" content="IFI Lifestyle" />
        <meta name="robots" content={robots} />
        
        {/* Open Graph */}
        <meta property="og:title" content={ogTitle || safeTitle} />
        <meta property="og:description" content={ogDescription || safeDescription} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={ogUrl || safeCanonical} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="IFI Lifestyle" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content={twitterCard} />
        <meta name="twitter:title" content={twitterTitle || safeTitle} />
        <meta name="twitter:description" content={twitterDescription || safeDescription} />
        <meta name="twitter:image" content={ogImage} />
        <meta name="twitter:site" content="@ifilifestyle" />
        
        {/* Canonical Tag */}
        <link rel="canonical" href={safeCanonical} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />
        <meta name="distribution" content="global" />
        <meta name="rating" content="general" />
        <meta name="geo.region" content="PK" />
        <meta name="geo.country" content="Pakistan" />
        
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteData)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbData)
          }}
        />
      </Helmet>
    </HelmetProvider>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  titleTemplate: PropTypes.string,
  description: PropTypes.string,
  keywords: PropTypes.string,
  ogTitle: PropTypes.string,
  ogDescription: PropTypes.string,
  ogType: PropTypes.string,
  ogUrl: PropTypes.string,
  ogImage: PropTypes.string,
  twitterCard: PropTypes.string,
  twitterTitle: PropTypes.string,
  twitterDescription: PropTypes.string,
  canonical: PropTypes.string,
  robots: PropTypes.string,
  pageType: PropTypes.string,
}

SEO.defaultProps = {
  title: "IFI Lifestyle - Premium Watches, Perfumes & Fashion Accessories",
  titleTemplate: "IFI Lifestyle | ifilifestyle.com",
  description: "IFI Lifestyle (Iconic Futures Innovations) - Pakistan's premier destination for premium watches, signature perfumes, men's fabrics, and fashion accessories. Quality products with fast nationwide delivery.",
  keywords: "IFI Lifestyle, ifilifestyle, premium watches, luxury watches, perfumes, fashion accessories, men's fabrics, Pakistan, online shopping, Iconic Futures Innovations",
  ogType: "website",
  ogImage: "https://www.ifilifestyle.com/logo.png",
  twitterCard: "summary_large_image",
  robots: "index, follow",
  pageType: "website"
};

export default SEO;