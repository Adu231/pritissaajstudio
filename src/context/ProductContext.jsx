import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
  updateSizeStock,
  getStoredBanners,
  saveStoredBanner,
  deleteStoredBanner,
  getStoredCoupons,
  saveStoredCoupon,
  deleteStoredCoupon,
  getStoredOrders,
  createStoredOrder,
  updateStoredOrderStatus,
  getStoredReviews,
  addStoredReview,
  updateStoredReviewApproval,
  deleteStoredReview,
  resetToDefaultData,
} from "../services/storage";
import { INITIAL_CATEGORIES } from "../services/mockData";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(10000);
  const [selectedSizeFilter, setSelectedSizeFilter] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const refreshAllData = () => {
    setProducts(getStoredProducts());
    setBanners(getStoredBanners());
    setOrders(getStoredOrders());
    setReviews(getStoredReviews());
    setCoupons(getStoredCoupons());
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Filtered Products computation
  const filteredProducts = products.filter((p) => {
    if (!p.isActive) return false;

    // Category filter
    if (selectedCategory !== "All" && p.category !== selectedCategory) {
      return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchDesc = p.description?.toLowerCase().includes(q);
      const matchCat = p.category?.toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchCat) return false;
    }

    // Price filter
    const effectivePrice = p.discountPrice || p.price;
    if (effectivePrice > maxPrice) return false;

    // Size filter
    if (selectedSizeFilter) {
      if (!p.sizes || !p.sizes.includes(selectedSizeFilter)) return false;
    }

    // In stock only filter
    if (inStockOnly) {
      const totalStock = p.stockBySize
        ? Object.values(p.stockBySize).reduce((a, b) => a + b, 0)
        : 1;
      if (totalStock <= 0) return false;
    }

    return true;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = a.discountPrice || a.price;
    const priceB = b.discountPrice || b.price;

    if (sortBy === "price-low") return priceA - priceB;
    if (sortBy === "price-high") return priceB - priceA;
    if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
    if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    // Default 'featured'
    if (b.isBestseller !== a.isBestseller) return b.isBestseller ? 1 : -1;
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
  });

  // Admin Mutations
  const addProduct = (productData) => {
    const updated = saveStoredProduct(productData);
    setProducts([...updated]);
    return true;
  };

  const updateProduct = (productData) => {
    const updated = saveStoredProduct(productData);
    setProducts([...updated]);
    return true;
  };

  const deleteProduct = (productId) => {
    const updated = deleteStoredProduct(productId);
    setProducts([...updated]);
    return true;
  };

  const updateStock = (productId, sizeName, quantity) => {
    const updated = updateSizeStock(productId, sizeName, quantity);
    setProducts([...updated]);
  };

  // Banners
  const addBanner = (bannerData) => {
    const updated = saveStoredBanner(bannerData);
    setBanners([...updated]);
  };

  const updateBanner = (bannerData) => {
    const updated = saveStoredBanner(bannerData);
    setBanners([...updated]);
  };

  const deleteBanner = (bannerId) => {
    const updated = deleteStoredBanner(bannerId);
    setBanners([...updated]);
  };

  // Coupons
  const addCoupon = (couponData) => {
    const updated = saveStoredCoupon(couponData);
    setCoupons([...updated]);
  };

  const updateCoupon = (couponData) => {
    const updated = saveStoredCoupon(couponData);
    setCoupons([...updated]);
  };

  const deleteCoupon = (code) => {
    const updated = deleteStoredCoupon(code);
    setCoupons([...updated]);
  };

  // Orders
  const placeOrder = (orderData) => {
    const newOrder = createStoredOrder(orderData);
    refreshAllData(); // Updates stock on products as well
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, note, trackingNumber, courier) => {
    const updated = updateStoredOrderStatus(orderId, newStatus, note, trackingNumber, courier);
    setOrders([...updated]);
  };

  // Reviews
  const submitReview = (reviewData) => {
    const updated = addStoredReview(reviewData);
    setReviews([...updated]);
    // Refresh products because rating changed
    setProducts(getStoredProducts());
  };

  const moderateReview = (reviewId, isApproved) => {
    const updated = updateStoredReviewApproval(reviewId, isApproved);
    setReviews([...updated]);
  };

  const deleteReview = (reviewId) => {
    const updated = deleteStoredReview(reviewId);
    setReviews([...updated]);
  };

  const resetAllData = () => {
    resetToDefaultData();
    refreshAllData();
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts: sortedProducts,
        allProductsCount: products.length,
        categories,
        banners,
        activeBanners: banners.filter((b) => b.isActive).sort((a, b) => a.displayOrder - b.displayOrder),
        orders,
        reviews,
        coupons,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        maxPrice,
        setMaxPrice,
        selectedSizeFilter,
        setSelectedSizeFilter,
        inStockOnly,
        setInStockOnly,
        // Admin operations
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        addBanner,
        updateBanner,
        deleteBanner,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        placeOrder,
        updateOrderStatus,
        submitReview,
        moderateReview,
        deleteReview,
        resetAllData,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);

