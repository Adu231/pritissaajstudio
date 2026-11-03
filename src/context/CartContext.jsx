import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredCart,
  saveStoredCart,
  validateAndCalculateCoupon,
} from "../services/storage";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const loadedCart = getStoredCart();
    setItems(loadedCart);
  }, []);

  const saveItems = (newItems) => {
    setItems(newItems);
    saveStoredCart(newItems);
  };

  const addToCart = (product, selectedSize, quantity = 1) => {
    // 1. Validate size requirement
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      return { success: false, message: "Please select a size before adding to cart." };
    }

    const sizeKey = selectedSize || "Standard";

    // 2. Validate stock availability
    const availableStock = product.stockBySize ? (product.stockBySize[sizeKey] ?? 10) : 10;
    if (availableStock <= 0) {
      return { success: false, message: `Size ${sizeKey} is currently out of stock.` };
    }

    const existingIndex = items.findIndex(
      (item) => item.productId === product.id && item.size === sizeKey
    );

    let updatedItems = [...items];
    const unitPrice = product.discountPrice || product.price;

    if (existingIndex >= 0) {
      const currentQty = updatedItems[existingIndex].quantity;
      const newQty = currentQty + quantity;

      if (newQty > availableStock) {
        return {
          success: false,
          message: `Only ${availableStock} units available for size ${sizeKey}.`,
        };
      }

      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: newQty,
        stockAvailable: availableStock,
      };
    } else {
      if (quantity > availableStock) {
        return {
          success: false,
          message: `Only ${availableStock} units available for size ${sizeKey}.`,
        };
      }

      updatedItems.push({
        productId: product.id,
        name: product.name,
        image: product.images?.[0] || "",
        category: product.category,
        size: sizeKey,
        unitPrice: unitPrice,
        originalPrice: product.price,
        quantity: quantity,
        stockAvailable: availableStock,
      });
    }

    saveItems(updatedItems);
    setIsCartOpen(true);
    return { success: true, message: `Added ${product.name} (${sizeKey}) to cart!` };
  };

  const updateQuantity = (productId, size, newQty) => {
    if (newQty <= 0) {
      removeFromCart(productId, size);
      return;
    }

    const updated = items.map((item) => {
      if (item.productId === productId && item.size === size) {
        const cappedQty = item.stockAvailable ? Math.min(newQty, item.stockAvailable) : newQty;
        return { ...item, quantity: cappedQty };
      }
      return item;
    });

    saveItems(updated);
  };

  const removeFromCart = (productId, size) => {
    const updated = items.filter(
      (item) => !(item.productId === productId && item.size === size)
    );
    saveItems(updated);
  };

  const clearCart = () => {
    saveItems([]);
    setAppliedCoupon(null);
    setCouponError("");
    setCouponSuccess("");
  };

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  const FREE_SHIPPING_THRESHOLD = 1499;
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 99;

  let discount = 0;
  if (appliedCoupon && subtotal > 0) {
    const validation = validateAndCalculateCoupon(appliedCoupon.code, subtotal);
    if (validation.valid) {
      discount = validation.discountAmount;
    } else {
      // Coupon became invalid due to subtotal change
      setAppliedCoupon(null);
      setCouponError(validation.message);
    }
  }

  const total = Math.max(0, subtotal - discount + shipping);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const applyCoupon = (code) => {
    setCouponError("");
    setCouponSuccess("");
    const result = validateAndCalculateCoupon(code, subtotal);
    if (result.valid) {
      setAppliedCoupon(result.coupon);
      setCouponSuccess(result.message);
      return { success: true, message: result.message };
    } else {
      setAppliedCoupon(null);
      setCouponError(result.message);
      return { success: false, message: result.message };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError("");
    setCouponSuccess("Coupon removed.");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        discount,
        shipping,
        total,
        cartCount,
        FREE_SHIPPING_THRESHOLD,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponError,
        couponSuccess,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

