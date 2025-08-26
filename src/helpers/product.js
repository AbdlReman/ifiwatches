// get products
export const getProducts = (products, category, type, limit) => {
  const finalProducts = category
    ? products.filter(
        product => product.category.filter(single => single === category)[0]
      )
    : products;

  if (type && type === "new") {
    const newProducts = finalProducts.filter(single => single.new);
    return newProducts.slice(0, limit ? limit : newProducts.length);
  }
  if (type && type === "bestSeller") {
    return finalProducts
      .sort((a, b) => {
        return b.saleCount - a.saleCount;
      })
      .slice(0, limit ? limit : finalProducts.length);
  }
  if (type && type === "saleItems") {
    const saleItems = finalProducts.filter(
      single => single.discount && single.discount > 0
    );
    return saleItems.slice(0, limit ? limit : saleItems.length);
  }
  return finalProducts.slice(0, limit ? limit : finalProducts.length);
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
  return discount && discount > 0 ? price - price * (discount / 100) : null;
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
  let productInCart = cartItems.find(
    single =>
      single.id === product.id &&
      (single.selectedProductColor
        ? single.selectedProductColor === color
        : true) &&
      (single.selectedProductSize ? single.selectedProductSize === size : true)
  );
  if (cartItems.length >= 1 && productInCart) {
    if (product.variation) {
      const foundItem = cartItems.find(
        single =>
          single.id === product.id &&
          single.selectedProductColor === color &&
          single.selectedProductSize === size
      );
      return foundItem ? foundItem.quantity : 0;
    } else {
      const foundItem = cartItems.find(single => product.id === single.id);
      return foundItem ? foundItem.quantity : 0;
    }
  } else {
    return 0;
  }
};

export const cartItemStock = (item, color, size) => {
  if (item.stock) {
    return item.stock;
  } else {
    return item.variation
      .filter(single => single.color === color)[0]
      .size.filter(single => single.name === size)[0].stock;
  }
};

//get products based on category
export const getSortedProducts = (products, sortType, sortValue) => {
  if (products && sortType && sortValue) {
    if (sortType === "category") {
      return products.filter(product => {
        if (product.category) {
          if (Array.isArray(product.category)) {
            return product.category.includes(sortValue);
          } else {
            return product.category === sortValue;
          }
        }
        return false;
      });
    }
    if (sortType === "tag") {
      return products.filter(
        product => product.tag.filter(single => single === sortValue)[0]
      );
    }
    if (sortType === "color") {
      return products.filter(
        product =>
          product.variation &&
          product.variation.filter(single => single.color === sortValue)[0]
      );
    }
    if (sortType === "size") {
      return products.filter(
        product =>
          product.variation &&
          product.variation.filter(
            single => single.size.filter(single => single.name === sortValue)[0]
          )[0]
      );
    }
    if (sortType === "filterSort") {
      let sortProducts = [...products];
      if (sortValue === "default") {
        return sortProducts;
      }
      if (sortValue === "priceHighToLow") {
        return sortProducts.sort((a, b) => {
          return b.price - a.price;
        });
      }
      if (sortValue === "priceLowToHigh") {
        return sortProducts.sort((a, b) => {
          return a.price - b.price;
        });
      }
    }
  }
  return products;
};

// get individual element
const getIndividualItemArray = array => {
  let individualItemArray = array.filter(function(v, i, self) {
    return i === self.indexOf(v);
  });
  return individualItemArray;
};

// get individual categories
export const getIndividualCategories = products => {
  let productCategories = [];
  
  products &&
    products.map(product => {
      if (product.category) {
        if (Array.isArray(product.category)) {
          product.category.forEach(single => {
            if (single && single.trim()) {
              productCategories.push(single.trim());
            }
          });
        } else {
          // If category is a single string
          if (product.category && product.category.trim()) {
            productCategories.push(product.category.trim());
          }
        }
      }
    });
  
  const individualProductCategories = getIndividualItemArray(productCategories);
  
  // Filter out categories with 0 products
  const categoriesWithProducts = individualProductCategories.filter(category => {
    const categoryCount = products.filter(product => {
      if (!product.category) return false;
      if (Array.isArray(product.category)) {
        return product.category.some(cat => 
          cat.toLowerCase() === category.toLowerCase()
        );
      }
      return product.category.toLowerCase() === category.toLowerCase();
    }).length;
    
    return categoryCount > 0;
  });
  
  return categoriesWithProducts;
};

// get individual tags
export const getIndividualTags = products => {
  let productTags = [];
  products &&
    products.map(product => {
      return (
        product.tag &&
        product.tag.map(single => {
          return productTags.push(single);
        })
      );
    });
  const individualProductTags = getIndividualItemArray(productTags);
  return individualProductTags;
};

// get individual colors
export const getIndividualColors = products => {
  let productColors = [];
  products &&
    products.map(product => {
      return (
        product.color &&
        product.color.map(single => {
          return productColors.push(single);
        })
      );
    });
  const individualProductColors = getIndividualItemArray(productColors);
  
  // Filter out colors with 0 products
  const colorsWithProducts = individualProductColors.filter(color => {
    const colorCount = products.filter(product => 
      product.color && product.color.includes(color)
    ).length;
    
    return colorCount > 0;
  });
  
  return colorsWithProducts;
};

// get individual sizes
export const getProductsIndividualSizes = products => {
  let productSizes = [];
  products &&
    products.map(product => {
      return (
        product.variation &&
        product.variation.map(single => {
          return single.size.map(single => {
            return productSizes.push(single.name);
          });
        })
      );
    });
  const individualProductSizes = getIndividualItemArray(productSizes);
  return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = product => {
  let productSizes = [];
  product.variation &&
    product.variation.map(singleVariation => {
      return (
        singleVariation.size &&
        singleVariation.size.map(singleSize => {
          return productSizes.push(singleSize.name);
        })
      );
    });
  const individualSizes = getIndividualItemArray(productSizes);
  return individualSizes;
};

export const setActiveSort = e => {
  const filterButtons = document.querySelectorAll(
    ".sidebar-widget-list-left button, .sidebar-widget-tag button, .product-filter button"
  );
  filterButtons.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const setActiveLayout = e => {
  const gridSwitchBtn = document.querySelectorAll(".shop-tab button");
  gridSwitchBtn.forEach(item => {
    item.classList.remove("active");
  });
  e.currentTarget.classList.add("active");
};

export const toggleShopTopFilter = e => {
  const shopTopFilterWrapper = document.querySelector(
    "#product-filter-wrapper"
  );
  shopTopFilterWrapper.classList.toggle("active");
  if (shopTopFilterWrapper.style.height) {
    shopTopFilterWrapper.style.height = null;
  } else {
    shopTopFilterWrapper.style.height =
      shopTopFilterWrapper.scrollHeight + "px";
  }
  e.currentTarget.classList.toggle("active");
};

export const truncateTitle = (title, maxLength = 20) => {
  if (!title) return "";
  if (title.length <= maxLength) return title;
  return title.substring(0, maxLength) + "...";
};

// Calculate quantity-based discount
export const getQuantityDiscount = (quantity) => {
  if (quantity >= 3) {
    return 10; // 10% off for 3 or more
  } else if (quantity >= 2) {
    return 5; // 5% off for 2
  }
  return 0; // No discount for 1
};

// Calculate final price with quantity discount
export const getQuantityDiscountedPrice = (basePrice, quantity) => {
  const discountPercent = getQuantityDiscount(quantity);
  if (discountPercent === 0) {
    return basePrice;
  }
  return basePrice * (1 - discountPercent / 100);
};
