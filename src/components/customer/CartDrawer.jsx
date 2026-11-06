import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Tag,
  CheckCircle2,
  AlertCircle,
  Truck,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { SafeImage } from "../common/SafeImage";

export const CartDrawer = ({
  onProceedToCheckout,
  onOpenAuth,
  onSelectProduct,
  products,
}) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shipping,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    couponError,
    couponSuccess,
    FREE_SHIPPING_THRESHOLD,
  } = useCart();

  const { user } = useAuth();
  const [couponCodeInput, setCouponCodeInput] = useState("");

  if (!isCartOpen) return null;

  const freeShippingDifference = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    applyCoupon(couponCodeInput.trim());
    setCouponCodeInput("");
  };

  const handleCheckoutClick = () => {
    closeCart();
    if (!user) {
      if (onOpenAuth) onOpenAuth(onProceedToCheckout);
    } else {
      if (onProceedToCheckout) onProceedToCheckout();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInRight">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-brand-forest text-white flex items-center justify-between border-b border-brand-forest-light">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-brand-champagne shrink-0" />
            <h3 className="font-serif text-lg font-bold">Shopping Bag</h3>
            <span className="text-xs bg-brand-champagne text-brand-forest px-2 py-0.5 rounded-full font-bold">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded-full hover:bg-white/10 transition text-brand-champagne-light hover:text-white"
            aria-label="Close bag"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-brand-offwhite p-3 border-b border-brand-border">
          <div className="flex items-center justify-between text-xs text-brand-dark mb-1.5">
            <span className="flex items-center space-x-1.5 font-medium truncate">
              <Truck className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span className="truncate">
                {freeShippingDifference === 0
                  ? "🎉 You unlocked FREE Express Delivery!"
                  : `Add ₹${freeShippingDifference.toLocaleString("en-IN")} more for Free Delivery`}
              </span>
            </span>
            <span className="text-[11px] font-bold text-brand-forest shrink-0 ml-2">
              {freeShippingProgress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-brand-border/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-champagne transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 bg-white">
          {items.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-full bg-brand-offwhite border border-brand-border flex items-center justify-center mx-auto text-brand-champagne-dark">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif text-base font-bold text-brand-forest">
                Your shopping bag is empty
              </h4>
              <p className="text-xs text-brand-muted max-w-xs mx-auto">
                Explore our handcrafted Maharashtrian & temple jewellery to find your signature piece.
              </p>
              <button
                onClick={closeCart}
                className="mt-2 px-5 py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition shadow-luxury"
              >
                Browse Jewellery Catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}_${item.size}`}
                className="flex space-x-3 p-3 bg-brand-offwhite rounded-2xl border border-brand-border relative group"
              >
                {/* Product Image */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-xl overflow-hidden border border-brand-border">
                  <SafeImage
                    src={item.image}
                    alt={item.name}
                    category={item.category || "Jewellery"}
                    aspectRatio="aspect-square"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-dark truncate">
                      {item.name}
                    </h4>

                    {/* Size Badge */}
                    <div className="flex items-center space-x-2 mt-0.5">
                      <span className="text-[10px] bg-white border border-brand-border px-2 py-0.5 rounded-md font-semibold text-brand-forest">
                        Size: {item.size}
                      </span>
                    </div>

                    {/* Unit Price */}
                    <div className="mt-1 flex items-baseline space-x-2">
                      <span className="text-xs sm:text-sm font-bold text-brand-forest font-poppins">
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </span>
                      {item.originalPrice && item.originalPrice > item.unitPrice && (
                        <span className="text-[10px] text-brand-muted line-through">
                          ₹{item.originalPrice.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls & Removal */}
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-brand-border/60">
                    <div className="flex items-center border border-brand-border rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                        className="px-2.5 py-1 text-xs text-brand-dark hover:bg-brand-offwhite transition min-w-[30px] min-h-[30px] flex items-center justify-center font-bold"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2.5 py-1 text-xs font-bold text-brand-forest">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                        className="px-2.5 py-1 text-xs text-brand-dark hover:bg-brand-offwhite transition min-w-[30px] min-h-[30px] flex items-center justify-center font-bold"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Subtotal for item */}
                    <span className="text-xs font-bold text-brand-dark font-poppins">
                      ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                    </span>

                    {/* Delete button */}
                    <button
                      onClick={() => removeFromCart(item.productId, item.size)}
                      className="text-brand-muted hover:text-red-600 transition p-1.5"
                      title="Remove item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Coupon + Summary + Checkout CTA */}
        {items.length > 0 && (
          <div className="p-3.5 sm:p-5 bg-white border-t border-brand-border shadow-lg space-y-3 shrink-0">
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-brand-champagne/20 rounded-xl border border-brand-champagne/50 text-xs">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4 text-brand-champagne-dark shrink-0" />
                    <div>
                      <span className="font-bold text-brand-forest">{appliedCoupon.code}</span>
                      <span className="text-brand-muted block text-[10px]">
                        Saved ₹{discount.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-red-600 text-xs font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={couponCodeInput}
                      onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                      placeholder="Coupon Code (e.g. SAAJ10)"
                      className="w-full pl-8 pr-3 py-1.5 text-xs uppercase font-medium bg-brand-offwhite border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-brand-forest text-white text-xs font-bold rounded-xl hover:bg-brand-forest-dark transition"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-red-600 mt-1 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{couponError}</span>
                </p>
              )}
              {couponSuccess && (
                <p className="text-[11px] text-brand-forest font-medium mt-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3 shrink-0 text-brand-champagne-dark" />
                  <span>{couponSuccess}</span>
                </p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-brand-dark pt-1 border-t border-brand-border">
              <div className="flex justify-between">
                <span className="text-brand-muted">Bag Subtotal</span>
                <span className="font-semibold">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-brand-champagne-dark font-medium">
                  <span>Coupon Discount</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-brand-muted">Delivery Charges</span>
                <span className="font-semibold">
                  {shipping === 0 ? (
                    <span className="text-brand-forest uppercase text-[11px] font-bold">FREE</span>
                  ) : (
                    `₹${shipping}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-sm sm:text-base font-bold text-brand-forest pt-2 border-t border-brand-border">
                <span>Total Payable</span>
                <span className="font-poppins">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckoutClick}
              className="w-full min-h-[44px] py-3 px-4 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-luxury flex items-center justify-center space-x-2"
            >
              <span>
                {user ? "Proceed to Checkout" : "Sign In & Proceed to Checkout"}
              </span>
              <ArrowRight className="w-4 h-4 text-brand-champagne shrink-0" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
