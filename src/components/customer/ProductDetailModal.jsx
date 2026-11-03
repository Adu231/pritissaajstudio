import React, { useState } from "react";
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
}) => {
  const { addToCart } = useCart();
  const { reviews, submitReview } = useProducts();
  const { user } = useAuth();

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-5 bg-brand-charcoal/70 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-4xl max-h-[94vh] sm:max-h-[90vh] flex flex-col overflow-hidden border border-brand-sage-light"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-brand-sage-light bg-brand-ivory/70 shrink-0">
          <div className="flex items-center space-x-1.5 text-xs text-brand-charcoal-muted truncate pr-2">
            <span className="font-bold text-brand-emerald shrink-0">{product.category}</span>
            <span>/</span>
            <span className="truncate">{product.name}</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-200 transition text-brand-charcoal shrink-0"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content Grid */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
          {/* Left Column: Image Gallery */}
          <div className="space-y-3 sm:space-y-4">
            {/* Main Active Image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-brand-ivory border border-brand-sage-light shadow-sm">
              <SafeImage
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                category={product.category}
                aspectRatio="aspect-square"
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-brand-gold text-brand-charcoal text-xs font-bold px-2.5 py-1 rounded-md shadow-md z-10">
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
                        ? "border-brand-emerald shadow-md scale-95"
                        : "border-brand-sage-light hover:border-brand-sage"
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
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[10px] sm:text-xs text-brand-charcoal-light">
              <div className="p-2 rounded-xl bg-brand-ivory border border-brand-sage-light/60 flex flex-col items-center">
                <ShieldCheck className="w-4 h-4 text-brand-gold mb-1" />
                <span className="font-medium">24K Micro Gold</span>
              </div>
              <div className="p-2 rounded-xl bg-brand-ivory border border-brand-sage-light/60 flex flex-col items-center">
                <Truck className="w-4 h-4 text-brand-gold mb-1" />
                <span className="font-medium">Insured Delivery</span>
              </div>
              <div className="p-2 rounded-xl bg-brand-ivory border border-brand-sage-light/60 flex flex-col items-center">
                <RotateCcw className="w-4 h-4 text-brand-gold mb-1" />
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
                  <div className="flex items-center text-brand-gold-dark font-bold text-xs bg-brand-gold/15 px-2 py-0.5 rounded-md">
                    <Star className="w-3.5 h-3.5 fill-brand-gold text-brand-gold mr-1" />
                    <span>{product.rating}</span>
                  </div>
                  <span className="text-xs text-brand-charcoal-muted">
                    ({productReviews.length || product.reviewCount} customer reviews)
                  </span>
                  {product.isBestseller && (
                    <span className="text-[10px] bg-brand-emerald text-brand-ivory font-semibold px-2 py-0.5 rounded-md">
                      Bestseller
                    </span>
                  )}
                </div>

                <h2 className="font-serif text-lg sm:text-2xl font-bold text-brand-charcoal leading-snug">
                  {product.name}
                </h2>
              </div>

              {/* Price Row */}
              <div className="flex items-baseline space-x-2.5 p-3 bg-brand-ivory rounded-xl border border-brand-sage-light/80">
                <span className="font-poppins font-bold text-xl sm:text-2xl text-brand-emerald">
                  ₹{(discountPrice || price).toLocaleString("en-IN")}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xs sm:text-sm text-gray-400 line-through">
                      ₹{price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-brand-gold-dark">
                      Save ₹{(price - discountPrice).toLocaleString("en-IN")} ({discountPercentage}%)
                    </span>
                  </>
                )}
                <span className="text-[10px] sm:text-[11px] text-brand-charcoal-muted block">
                  (Incl. of all taxes)
                </span>
              </div>

              {/* Size Selector Section */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-brand-charcoal flex items-center space-x-1">
                      <span>Select Size:</span>
                      {selectedSize && (
                        <span className="text-brand-emerald font-semibold normal-case">
                          {selectedSize}
                        </span>
                      )}
                    </label>

                    {/* Size Guide Trigger */}
                    <button
                      type="button"
                      onClick={() => onOpenSizeGuide(selectedSize, (sz) => setSelectedSize(sz))}
                      className="text-xs font-semibold text-brand-gold-dark hover:text-brand-emerald flex items-center space-x-1 underline transition"
                    >
                      <Ruler className="w-3.5 h-3.5 text-brand-gold" />
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
                              ? "border-brand-emerald bg-brand-emerald text-white shadow-md font-bold"
                              : isAvailable
                              ? "border-brand-sage-light bg-white hover:border-brand-sage text-brand-charcoal"
                              : "border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed line-through"
                          }`}
                        >
                          <div className="font-bold">{s}</div>
                          {isAvailable ? (
                            <span
                              className={`text-[8px] sm:text-[9px] block ${
                                isSelected ? "text-brand-sage-light" : "text-gray-400"
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
                        <span className="text-emerald-700 flex items-center space-x-1 text-[11px] sm:text-xs">
                          <Check className="w-3.5 h-3.5 shrink-0" />
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
                <span className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                  Quantity:
                </span>
                <div className="flex items-center border border-brand-sage-light rounded-xl overflow-hidden bg-white">
                  <button
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="min-w-[36px] min-h-[36px] px-3 py-1 text-brand-charcoal hover:bg-brand-sage-light/30 transition text-sm font-semibold flex items-center justify-center"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-brand-emerald">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((prev) =>
                        Math.min(stockForSelected > 0 ? stockForSelected : 10, prev + 1)
                      )
                    }
                    className="min-w-[36px] min-h-[36px] px-3 py-1 text-brand-charcoal hover:bg-brand-sage-light/30 transition text-sm font-semibold flex items-center justify-center"
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
                <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs rounded-xl flex items-center space-x-2 animate-fadeIn">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Added {quantity} unit(s) of size {selectedSize || "Standard"} to bag!</span>
                </div>
              )}

              {/* Action Buttons: Add to Bag & Buy Now */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={(e) => handleAddToCart(e, false)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border-2 border-brand-emerald bg-white hover:bg-brand-sage/15 text-brand-emerald font-bold text-xs sm:text-sm tracking-wide transition flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={(e) => handleAddToCart(e, true)}
                  className="w-full min-h-[44px] py-2.5 px-4 rounded-xl bg-brand-emerald hover:bg-brand-emerald-light text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-luxury flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-brand-gold" />
                  <span>Buy Now (Instant)</span>
                </button>
              </div>
            </div>

            {/* Information Tabs */}
            <div className="pt-3 border-t border-brand-sage-light/60">
              <div className="flex border-b border-brand-sage-light space-x-4 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab("description")}
                  className={`pb-2 transition ${
                    activeTab === "description"
                      ? "text-brand-emerald border-b-2 border-brand-gold font-bold"
                      : "text-brand-charcoal-muted hover:text-brand-emerald"
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab("craftsmanship")}
                  className={`pb-2 transition ${
                    activeTab === "craftsmanship"
                      ? "text-brand-emerald border-b-2 border-brand-gold font-bold"
                      : "text-brand-charcoal-muted hover:text-brand-emerald"
                  }`}
                >
                  Craftsmanship
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`pb-2 transition ${
                    activeTab === "reviews"
                      ? "text-brand-emerald border-b-2 border-brand-gold font-bold"
                      : "text-brand-charcoal-muted hover:text-brand-emerald"
                  }`}
                >
                  Reviews ({productReviews.length})
                </button>
              </div>

              <div className="py-2.5 text-xs text-brand-charcoal leading-relaxed max-h-40 overflow-y-auto">
                {activeTab === "description" && (
                  <p>{product.description}</p>
                )}

                {activeTab === "craftsmanship" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-brand-ivory p-2 rounded-lg">
                        <span className="text-gray-400 block text-[10px]">Metal & Plating</span>
                        <span className="font-semibold text-brand-charcoal">{product.metal || "24K Micro Gold Plated Brass"}</span>
                      </div>
                      <div className="bg-brand-ivory p-2 rounded-lg">
                        <span className="text-gray-400 block text-[10px]">Approx Weight</span>
                        <span className="font-semibold text-brand-charcoal">{product.weight || "45 grams"}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-brand-charcoal-muted pt-1">
                      Care: Keep away from water and direct sprays. Store safely inside your Priti's Saaj velvet pouch.
                    </p>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-3">
                    {/* Add Review Form */}
                    <form onSubmit={handleReviewSubmit} className="bg-brand-ivory p-3 rounded-xl border border-brand-sage-light/60 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-brand-emerald">Write a Customer Review</span>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              className="text-brand-gold"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= reviewRating ? "fill-brand-gold text-brand-gold" : "text-gray-300"
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
                        className="w-full p-2 text-xs border border-brand-sage-light rounded-lg focus:outline-none focus:border-brand-emerald bg-white"
                      />

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-3 py-1 bg-brand-emerald text-white rounded-lg text-xs font-semibold hover:bg-brand-emerald-light transition"
                        >
                          Submit Review
                        </button>
                      </div>

                      {reviewSubmitted && (
                        <p className="text-[11px] text-emerald-700 font-semibold">
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
                            className="p-2.5 rounded-xl bg-brand-ivory/50 border border-brand-sage-light/40 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-brand-charcoal text-xs">
                                {rev.userName}
                              </span>
                              <div className="flex text-brand-gold">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-brand-gold" />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-brand-charcoal-light">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-brand-charcoal-muted text-center py-2">
                        No reviews yet for this piece. Be the first to review!
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
