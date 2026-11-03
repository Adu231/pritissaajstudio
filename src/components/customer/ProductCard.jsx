import React from "react";
import { Star, ShoppingBag, Eye, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { SafeImage } from "../common/SafeImage";

export const ProductCard = ({ product, onSelectProduct, onOpenSizeGuide }) => {
  const { addToCart } = useCart();

  const price = product.price;
  const discountPrice = product.discountPrice;
  const hasDiscount = discountPrice && discountPrice < price;
  const discountPercentage = hasDiscount
    ? Math.round(((price - discountPrice) / price) * 100)
    : 0;

  // Stock calculation across sizes
  const totalStock = product.stockBySize
    ? Object.values(product.stockBySize).reduce((sum, qty) => sum + qty, 0)
    : 10;
  const isOutOfStock = totalStock <= 0;
  const isLowStock = totalStock > 0 && totalStock <= 4;

  const handleQuickAdd = (e) => {
    e.stopPropagation();
    // If product has multiple sizes, open detail modal so user picks their size
    if (product.sizes && product.sizes.length > 1) {
      onSelectProduct(product);
    } else {
      const defaultSize = product.sizes?.[0] || "Standard";
      addToCart(product, defaultSize, 1);
    }
  };

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="group bg-white rounded-2xl overflow-hidden border border-brand-sage-light/70 hover:border-brand-gold/60 hover:shadow-luxury transition-all duration-300 flex flex-col justify-between cursor-pointer relative"
    >
      {/* Top Floating Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1 items-start pointer-events-none">
        {hasDiscount && (
          <span className="bg-brand-gold text-brand-charcoal text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm">
            {discountPercentage}% OFF
          </span>
        )}
        {product.isBestseller && (
          <span className="bg-brand-emerald text-brand-ivory text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-md shadow-sm flex items-center space-x-1">
            <Sparkles className="w-2.5 h-2.5 text-brand-gold" />
            <span>Bestseller</span>
          </span>
        )}
        {isLowStock && (
          <span className="bg-amber-100 text-amber-900 text-[8px] sm:text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-amber-200">
            Only {totalStock} Left
          </span>
        )}
      </div>

      {/* Product Image with SafeImage fallback */}
      <div className="relative aspect-square overflow-hidden bg-brand-ivory">
        <SafeImage
          src={product.images[0]}
          alt={product.name}
          category={product.category}
          aspectRatio="aspect-square"
          className="group-hover:scale-105 transition-transform duration-500"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-brand-charcoal/65 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-white text-red-700 text-[10px] sm:text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Desktop Quick View Overlay */}
        <div className="hidden sm:flex absolute inset-0 bg-brand-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center z-10">
          <span className="bg-white/95 text-brand-emerald text-xs font-semibold px-3 py-1.5 rounded-xl shadow-lg flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </span>
        </div>
      </div>

      {/* Product Meta Body */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 justify-between space-y-2">
        <div>
          {/* Category & Star Rating */}
          <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-brand-charcoal-muted mb-1">
            <span className="uppercase tracking-wider font-semibold text-brand-emerald truncate max-w-[90px] sm:max-w-none">
              {product.category}
            </span>
            <div className="flex items-center space-x-0.5 sm:space-x-1 text-brand-gold-dark font-bold shrink-0">
              <Star className="w-3 h-3 fill-brand-gold text-brand-gold" />
              <span>{product.rating || "4.8"}</span>
              <span className="text-gray-400 font-normal">({product.reviewCount || 12})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3 className="font-serif text-xs sm:text-sm font-bold text-brand-charcoal line-clamp-2 group-hover:text-brand-emerald transition-colors leading-snug">
            {product.name}
          </h3>

          {/* Sizes preview chips */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center space-x-1 mt-1.5 overflow-hidden">
              <span className="text-[9px] sm:text-[10px] text-gray-400 shrink-0">Sizes:</span>
              <div className="flex space-x-1 overflow-x-auto no-scrollbar py-0.5">
                {product.sizes.map((s) => {
                  const stock = product.stockBySize ? product.stockBySize[s] : 1;
                  const available = stock > 0;
                  return (
                    <span
                      key={s}
                      className={`text-[8px] sm:text-[9px] px-1.5 py-0.2 rounded border whitespace-nowrap ${
                        available
                          ? "bg-brand-ivory border-brand-sage-light text-brand-charcoal font-medium"
                          : "bg-gray-100 border-gray-200 text-gray-400 line-through"
                      }`}
                    >
                      {s}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Pricing & Add to Cart action */}
        <div className="pt-2 border-t border-brand-sage-light/50 flex items-center justify-between gap-1">
          <div className="min-w-0">
            <div className="flex items-baseline space-x-1 truncate">
              <span className="font-poppins font-bold text-xs sm:text-base text-brand-emerald">
                ₹{(discountPrice || price).toLocaleString("en-IN")}
              </span>
              {hasDiscount && (
                <span className="text-[9px] sm:text-xs text-gray-400 line-through font-poppins">
                  ₹{price.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`p-2 rounded-xl text-xs font-semibold transition flex items-center justify-center shrink-0 min-w-[36px] min-h-[36px] ${
              isOutOfStock
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-brand-sage/20 hover:bg-brand-emerald text-brand-emerald hover:text-white"
            }`}
            title={product.sizes?.length > 1 ? "Select Size & Add" : "Add to Bag"}
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
