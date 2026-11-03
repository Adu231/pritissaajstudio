import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_COUPONS,
  INITIAL_USERS,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_BANNERS,
} from "./mockData";

const STORAGE_KEYS = {
  PRODUCTS: "saaj_db_products_v1",
  CATEGORIES: "saaj_db_categories_v1",
  COUPONS: "saaj_db_coupons_v1",
  USERS: "saaj_db_users_v1",
  ORDERS: "saaj_db_orders_v1",
  REVIEWS: "saaj_db_reviews_v1",
  BANNERS: "saaj_db_banners_v1",
  CURRENT_USER: "saaj_db_current_user_v1",
  CART: "saaj_db_cart_v1",
};

// Seed database on first run
export const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.COUPONS)) {
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  }
};

// Reset database helper
export const resetToDefaultData = () => {
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(INITIAL_COUPONS));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(INITIAL_ORDERS));
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(INITIAL_REVIEWS));
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  localStorage.removeItem(STORAGE_KEYS.CART);
  return true;
};

// --- PRODUCTS ---
export const getStoredProducts = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS)) || [];
  } catch {
    return INITIAL_PRODUCTS;
  }
};

export const saveStoredProduct = (product) => {
  const products = getStoredProducts();
  const existingIndex = products.findIndex((p) => p.id === product.id);

  if (existingIndex >= 0) {
    products[existingIndex] = {
      ...products[existingIndex],
      ...product,
      updatedAt: new Date().toISOString(),
    };
  } else {
    products.unshift({
      ...product,
      id: product.id || `prod_${Date.now()}`,
      rating: product.rating || 5.0,
      reviewCount: product.reviewCount || 0,
      isActive: product.isActive !== undefined ? product.isActive : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products;
};

export const deleteStoredProduct = (productId) => {
  const products = getStoredProducts().filter((p) => p.id !== productId);
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  return products;
};

export const updateSizeStock = (productId, sizeName, quantity) => {
  const products = getStoredProducts();
  const target = products.find((p) => p.id === productId);
  if (target) {
    if (!target.stockBySize) target.stockBySize = {};
    target.stockBySize[sizeName] = Math.max(0, parseInt(quantity, 10) || 0);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }
  return products;
};

// --- BANNERS ---
export const getStoredBanners = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.BANNERS)) || [];
  } catch {
    return INITIAL_BANNERS;
  }
};

export const saveStoredBanner = (banner) => {
  const banners = getStoredBanners();
  const existingIndex = banners.findIndex((b) => b.id === banner.id);
  if (existingIndex >= 0) {
    banners[existingIndex] = { ...banners[existingIndex], ...banner };
  } else {
    banners.push({
      ...banner,
      id: banner.id || `ban_${Date.now()}`,
      displayOrder: banner.displayOrder || banners.length + 1,
      isActive: banner.isActive !== undefined ? banner.isActive : true,
    });
  }
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  return banners;
};

export const deleteStoredBanner = (bannerId) => {
  const banners = getStoredBanners().filter((b) => b.id !== bannerId);
  localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  return banners;
};

// --- COUPONS ---
export const getStoredCoupons = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.COUPONS)) || [];
  } catch {
    return INITIAL_COUPONS;
  }
};

export const saveStoredCoupon = (coupon) => {
  const coupons = getStoredCoupons();
  const existingIndex = coupons.findIndex((c) => c.code.toUpperCase() === coupon.code.toUpperCase());
  if (existingIndex >= 0) {
    coupons[existingIndex] = { ...coupons[existingIndex], ...coupon, code: coupon.code.toUpperCase() };
  } else {
    coupons.push({ ...coupon, code: coupon.code.toUpperCase(), isActive: coupon.isActive !== undefined ? coupon.isActive : true });
  }
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  return coupons;
};

export const deleteStoredCoupon = (couponCode) => {
  const coupons = getStoredCoupons().filter((c) => c.code.toUpperCase() !== couponCode.toUpperCase());
  localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
  return coupons;
};

export const validateAndCalculateCoupon = (code, subtotal) => {
  if (!code) return { valid: false, message: "Please enter a coupon code." };
  const coupons = getStoredCoupons();
  const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }
  if (!coupon.isActive) {
    return { valid: false, message: "This coupon is currently inactive." };
  }
  if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Minimum order value for ${coupon.code} is ₹${coupon.minOrderValue.toLocaleString('en-IN')}.`,
    };
  }

  let discountAmount = 0;
  if (coupon.discountType === "percentage") {
    discountAmount = Math.round((subtotal * coupon.discountValue) / 100);
  } else {
    discountAmount = Math.min(coupon.discountValue, subtotal);
  }

  return {
    valid: true,
    coupon,
    discountAmount,
    message: `Coupon ${coupon.code} applied successfully! You saved ₹${discountAmount.toLocaleString('en-IN')}`,
  };
};

// --- ORDERS ---
export const getStoredOrders = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
  } catch {
    return INITIAL_ORDERS;
  }
};

export const createStoredOrder = (orderData) => {
  const orders = getStoredOrders();
  const newOrder = {
    ...orderData,
    id: `ord_${Date.now()}`,
    orderNumber: `PSS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    orderStatus: "Order Placed",
    paymentStatus: orderData.paymentMethod === "online" ? "Paid" : "Pending on Delivery",
    timeline: [
      {
        status: "Order Placed",
        timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
        note: orderData.paymentMethod === "online" ? "Online payment authorized & order placed" : "Cash on delivery order placed",
      },
    ],
  };

  orders.unshift(newOrder);
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

  // Deduct inventory for ordered items
  const products = getStoredProducts();
  newOrder.items.forEach((item) => {
    const prod = products.find((p) => p.id === item.productId);
    if (prod && prod.stockBySize && prod.stockBySize[item.size] !== undefined) {
      prod.stockBySize[item.size] = Math.max(0, prod.stockBySize[item.size] - item.quantity);
    }
  });
  localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));

  return newOrder;
};

export const updateStoredOrderStatus = (orderId, newStatus, note = "", trackingNumber = "", courier = "") => {
  const orders = getStoredOrders();
  const order = orders.find((o) => o.id === orderId);
  if (order) {
    order.orderStatus = newStatus;
    if (newStatus === "Delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "Paid";
    }
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (courier) order.courier = courier;

    const timelineEntry = {
      status: newStatus,
      timestamp: new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" }),
      note: note || `Order status updated to ${newStatus}`,
    };
    order.timeline = order.timeline || [];
    order.timeline.push(timelineEntry);

    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
  return orders;
};

// --- REVIEWS ---
export const getStoredReviews = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.REVIEWS)) || [];
  } catch {
    return INITIAL_REVIEWS;
  }
};

export const addStoredReview = (reviewData) => {
  const reviews = getStoredReviews();
  const newReview = {
    ...reviewData,
    id: `rev_${Date.now()}`,
    isApproved: true, // Auto-approve demo reviews or moderate via admin
    createdAt: new Date().toISOString(),
  };
  reviews.unshift(newReview);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));

  // Recalculate product rating
  const prodReviews = reviews.filter((r) => r.productId === reviewData.productId && r.isApproved);
  if (prodReviews.length > 0) {
    const avg = prodReviews.reduce((sum, r) => sum + r.rating, 0) / prodReviews.length;
    const products = getStoredProducts();
    const prod = products.find((p) => p.id === reviewData.productId);
    if (prod) {
      prod.rating = parseFloat(avg.toFixed(1));
      prod.reviewCount = prodReviews.length;
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }

  return reviews;
};

export const updateStoredReviewApproval = (reviewId, isApproved) => {
  const reviews = getStoredReviews();
  const rev = reviews.find((r) => r.id === reviewId);
  if (rev) {
    rev.isApproved = isApproved;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }
  return reviews;
};

export const deleteStoredReview = (reviewId) => {
  const reviews = getStoredReviews().filter((r) => r.id !== reviewId);
  localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  return reviews;
};

// --- USERS & AUTH ---
export const getStoredUsers = () => {
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS)) || [];
  } catch {
    return INITIAL_USERS;
  }
};

export const getStoredCurrentUser = () => {
  try {
    const userStr = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (userStr) return JSON.parse(userStr);
  } catch {
    // fallback
  }
  return null;
};

export const setStoredCurrentUser = (user) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};

export const updateStoredUser = (updatedUser) => {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === updatedUser.id);
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...updatedUser };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  setStoredCurrentUser(updatedUser);
  return updatedUser;
};

// --- CART ---
export const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
  } catch {
    return [];
  }
};

export const saveStoredCart = (items) => {
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
  return items;
};

