import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import client from "../../data/contentful";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopSidebar from "../../wrappers/product/ShopSidebar";
import ShopTopbar from "../../wrappers/product/ShopTopbar";
import ShopProducts from "../../wrappers/product/ShopProducts";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import ChildCategoryButtons from "../../components/category/ChildCategoryButtons";

const CategoriesPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const pageLimit = 15;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ content_type: "product" });
        const items = entries.items.map((item) => {
          const fields = item.fields;
          return {
            id: item.sys.id,
            name: fields.name,
            slug: fields.slug,
            price: parseFloat(fields.price) || 0,
            discount: parseFloat(fields.discount) || 0,
            shortDescription: fields.shortDescription,
            fullDescription: fields.fullDescription ? documentToHtmlString(fields.fullDescription) : "",
            category: fields.category || [],
            tag: fields.tag || [],
            images: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            color: fields.color || [],
            size: fields.size || [],
            metaTitle: fields.metaTitle || "",
            metaDescription: fields.metaDescription || "",
            stock: fields.stock || 0,
            image: Array.isArray(fields.images)
              ? fields.images.filter(img => img && img.fields && img.fields.file && img.fields.file.url).map(img => img.fields.file.url)
              : [],
            title: fields.name,
            description: fields.shortDescription,
            variation: fields.color && fields.color.length > 0 ?
              fields.color.map(color => ({
                color: color,
                size: fields.size ? fields.size.map(size => ({
                  name: size,
                  stock: fields.stock || 0
                })) : []
              })) : null
          };
        });

        // Filter for other categories: Eyewear, Rings & Accessories, Mobile Gadgets, Fashion
        const categoriesProducts = items.filter(product => {
          if (!product.category || !Array.isArray(product.category)) return false;
          
          // Check if any category includes the keywords
          const hasEyewear = product.category.some(cat => 
            cat && (cat.toLowerCase().includes('eyewear') || 
                   cat.toLowerCase().includes('sunglasses') || 
                   cat.toLowerCase().includes('optical'))
          );
          
          const hasRingsAccessories = product.category.some(cat => 
            cat && (cat.toLowerCase().includes('rings') || 
                   cat.toLowerCase().includes('accessories') || 
                   cat.toLowerCase().includes('bracelets') || 
                   cat.toLowerCase().includes('chains'))
          );
          
          const hasMobileGadgets = product.category.some(cat => 
            cat && (cat.toLowerCase().includes('mobile') || 
                   cat.toLowerCase().includes('gadgets') || 
                   cat.toLowerCase().includes('phones'))
          );
          
          const hasFashion = product.category.some(cat => 
            cat && (cat.toLowerCase().includes('fashion') || 
                   cat.toLowerCase().includes('clothing') || 
                   cat.toLowerCase().includes('tshirt') || 
                   cat.toLowerCase().includes('pant') || 
                   cat.toLowerCase().includes('jeans') || 
                   cat.toLowerCase().includes('shalwar') || 
                   cat.toLowerCase().includes('kameez'))
          );
          
          return hasEyewear || hasRingsAccessories || hasMobileGadgets || hasFashion;
        });

        setProducts(categoriesProducts);
        setSortedProducts(categoriesProducts);
        setCurrentData(categoriesProducts.slice(0, pageLimit));
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory) {
      filtered = filtered.filter(product => {
        if (!product.category || !Array.isArray(product.category)) return false;
        
        // Filter based on parent category logic
        switch (selectedCategory) {
          case "Watches":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('watches') || cat.toLowerCase().includes('watch'))
            );
          
          case "Watch Straps":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('straps') || cat.toLowerCase().includes('strap'))
            );
          
          case "Perfumes":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('perfume') || cat.toLowerCase().includes('fragrance'))
            );
          
          case "Eyewear":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('eyewear') || 
                     cat.toLowerCase().includes('sunglasses') || 
                     cat.toLowerCase().includes('optical'))
            );
          
          case "Rings & Accessories":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('rings') || 
                     cat.toLowerCase().includes('accessories') || 
                     cat.toLowerCase().includes('bracelets') || 
                     cat.toLowerCase().includes('chains'))
            );
          
          case "Mobile Gadgets":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('mobile') || 
                     cat.toLowerCase().includes('gadgets') || 
                     cat.toLowerCase().includes('phones'))
            );
          
          case "Fashion":
            return product.category.some(cat => 
              cat && (cat.toLowerCase().includes('fashion') || 
                     cat.toLowerCase().includes('clothing') || 
                     cat.toLowerCase().includes('tshirt') || 
                     cat.toLowerCase().includes('pant') || 
                     cat.toLowerCase().includes('jeans') || 
                     cat.toLowerCase().includes('shalwar') || 
                     cat.toLowerCase().includes('kameez'))
            );
          
          default:
            return false;
        }
      });
    }

    // Apply color filter
    if (selectedColor) {
      filtered = filtered.filter(product =>
        product.color && product.color.includes(selectedColor)
      );
    }

    setSortedProducts(filtered);
    setCurrentData(filtered.slice(0, pageLimit));
  }, [products, searchTerm, selectedCategory, selectedColor]);

  if (loading) {
    return (
      <div className="shop-area pt-95 pb-100">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading products...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="Categories – IFI (Iconic Futures Innovations)"
        description="Explore watches, perfumes, men’s fabrics, fashion accessories, and more at IFI – Iconic Futures Innovations (ifilifestyle)."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Categories", path: process.env.PUBLIC_URL + "/categories" },
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <ChildCategoryButtons parentCategory="categories" />
            <div className="row">
              <div className="col-lg-3 order-2 order-lg-1">
                <ShopSidebar
                  products={products}
                  handleSearch={setSearchTerm}
                  handleCategoryFilter={setSelectedCategory}
                  handleColorFilter={setSelectedColor}
                  selectedCategory={selectedCategory}
                  selectedColor={selectedColor}
                  searchTerm={searchTerm}
                  clearAllFilters={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                    setSelectedColor("");
                  }}
                  sideSpaceClass="mr-30"
                  pageType="categories"
                />
              </div>
              <div className="col-lg-9 order-1 order-lg-2">
                <ShopTopbar
                  productCount={products.length}
                  sortedProductCount={sortedProducts.length}
                />
                <ShopProducts layout="grid three-column" products={currentData} />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default CategoriesPage;
