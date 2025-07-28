import React, { Fragment, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import client from "../../data/contentful";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ShopTopbarFilter from "../../wrappers/product/ShopTopbarFilter";
import ShopProducts from "../../wrappers/product/ShopProducts";

const RingsAccessoriesPage = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [currentData, setCurrentData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedColors, setSelectedColors] = useState([]);
  const [pageLimit] = useState(12);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const entries = await client.getEntries({ content_type: "product" });
        const items = entries.items.map((item) => {
          const { fields } = item;
          return {
            id: item.sys.id,
            title: fields.title,
            price: fields.price,
            comparePrice: fields.comparePrice,
            images: fields.images,
            category: fields.category,
            colors: fields.colors,
            sizes: fields.sizes,
            description: fields.description,
            slug: fields.slug,
            rating: fields.rating,
            reviews: fields.reviews,
            availability: fields.availability,
            tags: fields.tags,
            brand: fields.brand,
            model: fields.model,
            material: fields.material,
            warranty: fields.warranty,
            shipping: fields.shipping,
            returnPolicy: fields.returnPolicy,
            features: fields.features,
            specifications: fields.specifications,
            careInstructions: fields.careInstructions,
            createdAt: item.sys.createdAt,
            updatedAt: item.sys.updatedAt,
          };
        });

        // Filter for rings & accessories category
        const ringsAccessoriesProducts = items.filter(product =>
          product.category && product.category.includes("ringsaccessories")
        );

        setProducts(ringsAccessoriesProducts);
        setSortedProducts(ringsAccessoriesProducts);
        setCurrentData(ringsAccessoriesProducts.slice(0, pageLimit));
      } catch (error) {
        console.error("Failed to fetch products from Contentful", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    let filteredProducts = sortedProducts;

    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by selected colors
    if (selectedColors.length > 0) {
      filteredProducts = filteredProducts.filter(product =>
        product.colors && product.colors.some(color => selectedColors.includes(color))
      );
    }

    setCurrentData(filteredProducts.slice(0, pageLimit));
  }, [searchTerm, selectedColors, sortedProducts, pageLimit]);

  return (
    <Fragment>
      <SEO
        titleTemplate="Rings & Accessories - IFIwatches"
        description="Shop elegant rings and accessories at IFIwatches. Fashion rings, chains, and bracelets for every style."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            { label: "Home", path: process.env.PUBLIC_URL + "/" },
            { label: "Rings & Accessories", path: process.env.PUBLIC_URL + "/rings-accessories" },
          ]}
        />
        <div className="shop-area pt-95 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <ShopTopbarFilter
                  getLayout={setSortedProducts}
                  getFilterSortParams={setSortedProducts}
                  productCount={products.length}
                  sortedProductCount={currentData.length}
                  products={products}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedColors={selectedColors}
                  setSelectedColors={setSelectedColors}
                />
                <ShopProducts layout={sortedProducts} products={currentData} loading={loading} />
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default RingsAccessoriesPage; 