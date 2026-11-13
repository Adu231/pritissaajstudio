import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Star,
  Ruler,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  AlertCircle,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { SafeImage } from "../common/SafeImage";

export const ProductDetailModal = ({
  product,
  onClose,
  onOpenSizeGuide,
  onProceedToCheckout,
  onOpenAuth,
  onSelectProduct,
}) => {
  const { addToCart } = useCart();
  const { products, reviews, submitReview } = useProducts();
  const { user } = useAuth();

  const modalScrollRef = useRef(null);
  const relatedScrollRef = useRef(null);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(
    product?.sizes?.length === 1 ? product.sizes[0] : ""
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description"); // 'description' | 'reviews' | 'craftsmanship'
  const [validationError, setValidationError] = useState("");
  const [addedSuccess, setAddedSuccess] = useState(false);

  // New review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Lock body scroll and restore smoothly; close on Escape key
  useEffect(() => {
    if (product) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [product, onClose]);

  // Reset modal state and scroll to top when active product changes
  useEffect(() => {
    if (product) {
      setActiveImageIndex(0);
      setSelectedSize(product.sizes?.length === 1 ? product.sizes[0] : "");
      setQuantity(1);
      setValidationError("");
      setAddedSuccess(false);
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [product?.id]);

  if (!product) return null;

  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Selected size stock check
  const stockForSelected = selectedSize && product.stockBySize
    ? product.stockBySize[selectedSize] ?? 10
    : 10;

  const productReviews = reviews.filter(
    (r) => r.productId === product.id && r.isApproved
  );

  const handleAddToCart = (e, isBuyNow = false) => {
    e?.preventDefault();
    setValidationError("");

    // Size validation
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      setValidationError("Please select your size before adding to bag.");
      return;
    }

    const res = addToCart(product, selectedSize, quantity);
    if (!res.success) {
      setValidationError(res.message);
      return;
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 2500);

    if (isBuyNow) {
      onClose();
      if (onProceedToCheckout) onProceedToCheckout();
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      if (onOpenAuth) onOpenAuth();
      return;
    }
    if (!reviewComment.trim()) return;

    submitReview({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewComment("");
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  // Recommendations: prioritize same category, then bestsellers
  const relatedProducts = (products || [])
    .filter((p) => p.id !== product?.id && p.isActive !== false)
    .sort((a, b) => {
      if (a.category === product?.category && b.category !== product?.category) return -1;
      if (b.category === product?.category && a.category !== product?.category) return 1;
      if (a.isBestseller && !b.isBestseller) return -1;
      if (b.isBestseller && !a.isBestseller) return 1;
      return 0;
    });

  const handleSelectRelated = (item) => {
    if (onSelectProduct) {
      onSelectProduct(item);
    }
    if (modalScrollRef.current) {
      modalScrollRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const scrollRelated = (direction) => {
    if (relatedScrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      relatedScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-5 bg-brand-dark/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
          onClick={onClose}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-brand-border"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-brand-border bg-brand-offwhite shrink-0">
              <div className="flex items-center space-x-1.5 text-xs text-brand-muted truncate pr-2">
                <span className="font-bold text-brand-forest shrink-0">{product.category}</span>
                <span>/</span>
                <span className="truncate text-brand-dark font-medium">{product.name}</span>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl hover:bg-brand-border/60 active:scale-95 transition text-brand-dark shrink-0 ml-2"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        {/* Modal Scrollable Body */}
        <div ref={modalScrollRef} className="overflow-y-auto flex-1 bg-white overscroll-contain">
          {/* Main 2-Column Product Details Grid */}
          <div className="p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8 bg-white">
          {/* Left Column: Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-offwhite border border-brand-border shadow-xs">
              <SafeImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                category={product.category}
                aspectRatio="aspect-square"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-brand-champagne text-brand-forest text-xs font-bold px-2.5 py-1 rounded-md shadow-xs border border-brand-champagne-dark/30 z-10">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition shrink-0 ${
                      activeImageIndex === idx
                        ? "border-brand-forest shadow-md scale-95"
                        : "border-brand-border hover:border-brand-champagne"
                    }`}
                  >
                    <SafeImage
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      category={product.category}
                      aspectRatio="aspect-square"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Reassurance Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] sm:text-xs text-brand-dark/80">
              <div className="p-2 rounded-xl bg-brand-offwhite border border-brand-border flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-brand-champagne-dark mb-1" />
                <span className="font-medium">24K Micro Gold</span>
              </div>
              <div className="p-2 rounded-xl bg-brand-offwhite border border-brand-border flex flex-col items-center">
                <Truck className="w-4 h-4 text-brand-champagne-dark mb-1" />
                <span className="font-medium">Insured Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-brand-offwhite border border-brand-border flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-brand-champagne-dark mb-1" />
                <span className="font-medium">Size Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div className="space-y-4">
              {/* Title & Ratings */}
              <div>
                <div className="flex items-center space-x-2 mb-1.5 flex-wrap gap-1">
                  <div className="flex items-center text-brand-champagne-dark font-bold text-xs bg-brand-champagne/15 px-2 py-0.5 rounded-md border border-brand-champagne/30">
                    <Star className="w-3.5 h-3.5 fill-brand-champagne text-brand-champagne mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-brand-muted">
                    ({productReviews.length || product.reviewCount} customer reviews)
                  </span>
                  {product.isBestseller && (
                    <span className="text-[10px] bg-brand-forest text-white font-semibold px-2 py-0.5 rounded-md">
                      Bestseller
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-lg sm:text-2xl font-bold text-brand-forest leading-snug">
                  {product.name}
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-2.5 p-3 bg-brand-offwhite rounded-xl border border-brand-border">
                <span className="font-poppins font-bold text-xl sm:text-2xl text-brand-forest">
                  ₹{(discountPrice || price).toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xs sm:text-sm text-brand-muted line-through">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-brand-champagne-dark">
                      Save ₹{(price - discountPrice).toLocaleString("en-IN")} ({discountPercentage}%)
                    </span>
                  </>
                )}
                <span className="text-[10px] sm:text-[11px] text-brand-muted block">
                  (Incl. of all taxes)
                </span>
              </div>

              {/* Size Selector Section */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-dark flex items-center space-x-1">
                      <span>Select Size:</span>
                      {selectedSize && (
                        <span className="text-brand-forest font-semibold normal-case">
                          {selectedSize}
                        </span>
                      )}
                    </label>

                    {/* Size Guide Trigger */}
                    <button
                      type="button"
                      onClick={() => onOpenSizeGuide(selectedSize, (sz) => setSelectedSize(sz))}
                      className="text-xs font-semibold text-brand-forest hover:text-brand-forest-dark flex items-center space-x-1 underline transition"
                    >
                      <Ruler className="w-3.5 h-3.5 text-brand-champagne-dark" />
                      <span>Bangle Size Guide</span>
                    </button>
                  </div>

                  {/* Size Chips */}
                  <div className="grid grid-cols-4 gap-2">
                    {product.sizes.map((s) => {
                      const stock = product.stockBySize ? product.stockBySize[s] : 10;
                      const isAvailable = stock > 0;
                      const isSelected = selectedSize === s;

                      return (
                        <button
                          key={s}
                          type="button"
                          disabled={!isAvailable}
                          onClick={() => {
                            setSelectedSize(s);
                            setValidationError("");
                          }}
                          className={`min-h-[44px] py-2 px-2 rounded-xl border text-xs font-medium transition text-center relative flex flex-col items-center justify-center ${
                            isSelected
                              ? "border-brand-forest bg-brand-forest text-white shadow-md font-bold"
                              : isAvailable
                              ? "border-brand-border bg-white hover:border-brand-forest text-brand-dark"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                          }`}
                        >
                          <div className="font-bold">{s}</div>
                          {isAvailable ? (
                            <span
                              className={`text-[8px] sm:text-[9px] block ${
                                isSelected ? "text-brand-champagne-light" : "text-brand-muted"
                              }`}
                            >
                              {stock <= 3 ? `Only ${stock} left` : "In Stock"}
                            </span>
                          ) : (
                            <span className="text-[8px] sm:text-[9px] block text-red-500 font-semibold">
                              Sold Out
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Dynamic stock feedback */}
                  {selectedSize && (
                    <div className="text-xs pt-1 flex items-center space-x-1">
                      {stockForSelected > 0 ? (
                        <span className="text-brand-forest flex items-center space-x-1 text-[11px] sm:text-xs font-medium">
                          <Check className="w-3.5 h-3.5 shrink-0 text-brand-champagne-dark" />
                          <span>
                            Size {selectedSize} is in stock ({stockForSelected} available). Ready to dispatch.
                          </span>
                        </span>
                      ) : (
                        <span className="text-red-600 flex items-center space-x-1 text-[11px] sm:text-xs">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Size {selectedSize} is currently out of stock.</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Quantity:
                </span>
                <div className="flex items-center border border-brand-border rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="min-w-[36px] min-h-[36px] px-3 py-1 text-brand-dark hover:bg-brand-offwhite transition text-sm font-semibold flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-brand-forest">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(stockForSelected > 0 ? stockForSelected : 10, prev + 1)
                      )
                    }
                    className="min-w-[36px] min-h-[36px] px-3 py-1 text-brand-dark hover:bg-brand-offwhite transition text-sm font-semibold flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Validation Error Message */}
              {validationError && (
                <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Added to Bag Toast inside modal */}
              {addedSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-brand-forest text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-brand-forest shrink-0" />
                  <span>Added {quantity} unit(s) of size {selectedSize || "Standard"} to bag!</span>
                </div>
              )}

              {/* Action Buttons: Add to Bag (Secondary) & Buy Now (Primary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={(e) => handleAddToCart(e, false)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border-2 border-brand-forest bg-white hover:bg-brand-offwhite text-brand-forest font-bold text-xs sm:text-sm tracking-wide transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={(e) => handleAddToCart(e, true)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-luxury flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-brand-champagne" />
                  <span>Buy Now (Instant)</span>
                </button>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="pt-3 border-t border-brand-border">
              <div className="flex border-b border-brand-border space-x-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-2 transition ${
                    activeTab === "description"
                      ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
                      : "text-brand-muted hover:text-brand-forest"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("craftsmanship")}
                  className={`pb-2 transition ${
                    activeTab === "craftsmanship"
                      ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
                      : "text-brand-muted hover:text-brand-forest"
                  }`}
                >
                  Craftsmanship
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2 transition ${
                    activeTab === "reviews"
                      ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
                      : "text-brand-muted hover:text-brand-forest"
                  }`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              <div className="py-2.5 text-xs text-brand-dark leading-relaxed max-h-40 overflow-y-auto">
                {activeTab === "description" && (
                  <p>{product.description}</p>
                )}

                {activeTab === "craftsmanship" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-brand-offwhite p-2 rounded-lg border border-brand-border">
                        <span className="text-brand-muted block text-[10px]">Metal & Plating</span>
                        <span className="font-semibold text-brand-dark">{product.metal || "24K Micro Gold Plated Brass"}</span>
                      </div>
                      <div className="bg-brand-offwhite p-2 rounded-lg border border-brand-border">
                        <span className="text-brand-muted block text-[10px]">Approx Weight</span>
                        <span className="font-semibold text-brand-dark">{product.weight || "45 grams"}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-muted pt-1">
                      Care: Keep away from water and direct sprays. Store safely inside your Priti's Saaj velvet pouch.
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {/* Add Review Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-brand-offwhite p-3 rounded-xl border border-brand-border space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-forest">Write a Customer Review</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-brand-champagne"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= reviewRating ? "fill-brand-champagne text-brand-champagne" : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={2}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Share your experience regarding craftsmanship, fit, or styling..."
                        className="w-full p-2 text-xs border border-brand-border rounded-lg focus:outline-none focus:border-brand-forest bg-white text-brand-dark"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-brand-forest text-white rounded-lg text-xs font-semibold hover:bg-brand-forest-dark transition"
                        >
                          Submit Review
                        </button>
                      </div>

                      {reviewSubmitted && (
                        <p className="text-[11px] text-brand-forest font-semibold">
                          Thank you! Your verified review has been recorded.
                        </p>
                      )}
                    </form>

                    {/* Existing Reviews */}
                    {productReviews.length > 0 ? (
                      <div className="space-y-2">
                        {productReviews.map((rev) => (
                          <div
                            key={rev.id}
                            className="p-2.5 rounded-xl bg-brand-offwhite border border-brand-border/60 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-brand-dark text-xs">
                                {rev.userName}
                              </span>
                              <div className="flex text-brand-champagne">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-brand-champagne" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-brand-dark/80">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-brand-muted text-center py-2">
                        No reviews yet for this piece. Be the first to review!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          </div>

          {/* Related Pieces Horizontal Carousel */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-brand-border bg-brand-offwhite/50 px-4 sm:px-6 md:px-8 py-5 sm:py-6">
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <div className="flex items-center space-x-1.5 text-brand-champagne-dark text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-brand-champagne-dark" />
                    <span>Complete Your Ensemble</span>
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-brand-forest mt-0.5">
                    You May Also Adore
                  </h3>
                </div>

                {/* Desktop Carousel Navigation Arrows */}
                <div className="hidden sm:flex items-center space-x-1.5">
                  <button
                    type="button"
                    onClick={() => scrollRelated("left")}
                    className="w-8 h-8 rounded-full border border-brand-border bg-white text-brand-dark hover:bg-brand-offwhite hover:border-brand-forest/50 transition flex items-center justify-center shadow-2xs active:scale-95"
                    aria-label="Scroll left"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => scrollRelated("right")}
                    className="w-8 h-8 rounded-full border border-brand-border bg-white text-brand-dark hover:bg-brand-offwhite hover:border-brand-forest/50 transition flex items-center justify-center shadow-2xs active:scale-95"
                    aria-label="Scroll right"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Horizontal Scroll Track */}
              <div
                ref={relatedScrollRef}
                className="flex space-x-3 sm:space-x-4 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
              >
                {relatedProducts.map((rel) => {
                  const relPrice = rel.price;
                  const relDiscountPrice = rel.discountPrice;
                  const relHasDiscount = relDiscountPrice && relDiscountPrice < relPrice;

                  return (
                    <div
                      key={rel.id}
                      onClick={() => handleSelectRelated(rel)}
                      className="snap-start shrink-0 w-[155px] sm:w-[185px] md:w-[200px] bg-white rounded-xl sm:rounded-2xl border border-brand-border hover:border-brand-champagne hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden text-left cursor-pointer group focus:outline-none focus:ring-2 focus:ring-brand-forest"
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleSelectRelated(rel);
                        }
                      }}
                      aria-label={`View ${rel.name}`}
                    >
                      {/* Product Thumbnail with Badges */}
                      <div className="relative aspect-square w-full overflow-hidden bg-brand-offwhite border-b border-brand-border/60">
                        <SafeImage
                          src={rel.images?.[0]}
                          alt={rel.name}
                          category={rel.category}
                          aspectRatio="aspect-square"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {relHasDiscount && (
                          <span className="absolute top-2 left-2 bg-brand-champagne text-brand-forest text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs border border-brand-champagne-dark/30 z-10">
                            {Math.round(((relPrice - relDiscountPrice) / relPrice) * 100)}% OFF
                          </span>
                        )}
                        {rel.rating && (
                          <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-xs text-[9px] sm:text-[10px] font-bold text-brand-forest px-1.5 py-0.5 rounded-full flex items-center shadow-xs border border-brand-border/60 z-10">
                            <Star className="w-2.5 h-2.5 fill-brand-champagne text-brand-champagne mr-0.5" />
                            <span>{rel.rating}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content */}
                      <div className="p-2.5 sm:p-3 flex flex-col justify-between flex-1 space-y-1.5">
                        <div>
                          <span className="text-[9px] sm:text-[10px] font-semibold text-brand-champagne-dark uppercase tracking-wider block">
                            {rel.category}
                          </span>
                          <h4 className="font-serif text-xs sm:text-sm font-bold text-brand-dark group-hover:text-brand-forest line-clamp-1 transition-colors">
                            {rel.name}
                          </h4>
                        </div>

                        {/* Price & CTA */}
                        <div className="pt-1 border-t border-brand-border/50">
                          <div className="flex items-baseline space-x-1.5">
                            <span className="font-poppins font-bold text-xs sm:text-sm text-brand-forest">
                              ₹{(relDiscountPrice || relPrice).toLocaleString("en-IN")}
                            </span>
                            {relHasDiscount && (
                              <span className="text-[10px] text-brand-muted line-through">
                                ₹{relPrice.toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center justify-between text-[11px] font-semibold text-brand-forest group-hover:text-brand-forest-dark transition-colors">
                            <span>View Piece</span>
                            <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform text-brand-champagne-dark" />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
