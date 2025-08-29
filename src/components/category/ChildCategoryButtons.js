import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const ChildCategoryButtons = ({ parentCategory }) => {
  // Define child categories for each parent category
  const childCategories = {
    watches: [
      { name: "Men's Watches", slug: "mens", icon: "⌚" },
      { name: "Women's Watches", slug: "womens", icon: "🕐" },
      { name: "Unisex Watches", slug: "unisex", icon: "🕑" },
      { name: "Luxury Collection", slug: "luxury", icon: "💎" },
      { name: "Formal Watches", slug: "formal", icon: "🕒" },
      { name: "Casual Watches", slug: "casual", icon: "🕓" },
      { name: "Sports & Digital", slug: "sports", icon: "🕔" }
    ],
    "watch-straps": [
      { name: "Leather Straps", slug: "leather", icon: "🟫" },
      { name: "Metal/Chain Straps", slug: "metal", icon: "https://api.iconify.design/fa-solid/link.svg" },
      { name: "Silicone/Rubber", slug: "silicone", icon: "https://api.iconify.design/mdi:circle.svg" },
      { name: "Nylon/Fabric", slug: "nylon", icon: "⬛" },
      { name: "Magnetic/Loop", slug: "magnetic", icon: "https://api.iconify.design/fa-solid/magnet.svg" }
    ],
    eyewear: [
      { name: "Sunglasses", slug: "sunglasses", icon: "🕶️" },
      { name: "Optical Frames", slug: "optical", icon: "👓" }
    ],
    "rings-accessories": [
      { name: "Fashion Rings", slug: "fashion-rings", icon: "💍" },
      { name: "Chains & Bracelets", slug: "chains-bracelets", icon: "📿" }
    ],
    perfumes: [
      { name: "Men's Fragrances", slug: "mens", icon: "" },
      { name: "Women's Fragrances", slug: "womens", icon: "" },
      { name: "Unisex Scents", slug: "unisex", icon: "" }
    ],
    "mobile-gadgets": [
      { name: "Trusted Used Mobiles", slug: "used-mobiles", icon: "📱" },
      { name: "Mobile Accessories", slug: "accessories", icon: "🔌" }
    ],
    fashion: [
      { name: "T-Shirt", slug: "tshirt", icon: "👕" },
      { name: "Pant/Jeans", slug: "pant-jeans", icon: "👖" },
      { name: "Shalwar Kameez Fabric", slug: "shalwar-kameez", icon: "👘" }
    ]
  };

  const categories = childCategories[parentCategory] || [];

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="child-categories-section" style={{
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '40px 0',
      marginBottom: '40px',
      borderRadius: '15px'
    }}>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h3 style={{
              textAlign: 'center',
              marginBottom: '30px',
              color: '#2c3e50',
              fontSize: '2rem',
              fontWeight: '600'
            }}>
              Browse by Category
            </h3>
            <div className="child-categories-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px',
              maxWidth: '1200px',
              margin: '0 auto'
            }}>
              {categories.map((category, index) => (
                <Link
                  key={index}
                  to={process.env.PUBLIC_URL + `/${parentCategory}/${category.slug}`}
                  style={{
                    display: 'block',
                    textDecoration: 'none',
                    color: 'inherit'
                  }}
                >
                  <div className="category-button" style={{
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '12px',
                    padding: '20px',
                    textAlign: 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
                  }}
                  >
                    {category.icon.startsWith('http') ? (
                      <img src={category.icon} alt={category.name} style={{ width: 40, height: 40, marginBottom: 10 }} />
                    ) : (
                      <span className="category-icon" style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{category.icon}</span>
                    )}
                    <div className="category-name" style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: '#2c3e50',
                      lineHeight: '1.4'
                    }}>
                      {category.name}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ChildCategoryButtons.propTypes = {
  parentCategory: PropTypes.string.isRequired
};

export default ChildCategoryButtons; 