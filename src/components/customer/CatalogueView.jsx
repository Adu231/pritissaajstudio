import React, { useState } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  RotateCcw,
  Sparkles,
  Ruler,
  Check,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { ProductCard } from "./ProductCard";

export const CatalogueView = ({ onSelectProduct, onOpenSizeGuide }) => {
  const {
    filteredProducts,
    categories,
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
  } = useProducts();

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const ALL_SIZES = ["2.4", "2.6", "2.8", "2.10", "Standard", "Free Size (Adjustable)"];

  const hasActiveFilters =
    selectedCategory !== "All" ||
    searchQuery.trim() !== "" ||
    maxPrice < 10000 ||
    selectedSizeFilter !== "" ||
    inStockOnly;

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSearchQuery("");
    setMaxPrice(10000);
    setSelectedSizeFilter("");
    setInStockOnly(false);
    setSortBy("featured");
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Page Header */}
      <div className="mb-5 sm:mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-brand-sage-light/60 pb-5">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-gold-dark font-bold font-poppins">
            Royal Heirloom Jewels
          </span>
          <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-emerald mt-1">
            {selectedCategory === "All" ? "All Jewellery Collection" : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-brand-charcoal-light mt-1">
            Showing {filteredProducts.length} handcrafted pieces
          </p>
        </div>

        {/* Quick Size Guide link */}
        <button
          onClick={() => onOpenSizeGuide()}
          className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 text-brand-emerald text-xs font-bold border border-brand-gold/40 transition"
        >
          <Ruler className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          <span>Bangle Measurement Guide</span>
        </button>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-sage-light shadow-sm space-y-5">
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-brand-sage-light/50 pb-3">
              <span className="font-serif font-bold text-sm text-brand-emerald flex items-center space-x-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-gold-dark hover:underline flex items-center space-x-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                Categories
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition ${
                    selectedCategory === "All"
                      ? "bg-brand-emerald text-white font-bold"
                      : "text-brand-charcoal-light hover:bg-brand-sage-light/30"
                  }`}
                >
                  All Jewellery
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.name)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-xl transition flex items-center justify-between ${
                      selectedCategory === c.name
                        ? "bg-brand-emerald text-white font-bold"
                        : "text-brand-charcoal-light hover:bg-brand-sage-light/30"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`text-[10px] ${
                        selectedCategory === c.name ? "text-brand-sage-light" : "text-gray-400"
                      }`}
                    >
                      {c.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-brand-emerald">
                  ₹{maxPrice.toLocaleString("en-IN")}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-emerald cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                Filter by Size
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {ALL_SIZES.map((sz) => (
                  <button
                    key={sz}
                    onClick={() =>
                      setSelectedSizeFilter(selectedSizeFilter === sz ? "" : sz)
                    }
                    className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                      selectedSizeFilter === sz
                        ? "bg-brand-emerald border-brand-emerald text-white font-bold"
                        : "bg-brand-ivory border-brand-sage-light text-brand-charcoal hover:border-brand-emerald"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-brand-sage-light/50">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-brand-charcoal">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-brand-sage text-brand-emerald focus:ring-brand-emerald h-4 w-4"
                />
                <span className="font-medium">In Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Column */}
        <main className="flex-1 min-w-0">
          {/* Top Bar: Sort & Filter Trigger for Mobile */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-brand-sage-light shadow-sm mb-5 flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-2 bg-brand-ivory border border-brand-sage-light rounded-xl text-xs font-bold text-brand-charcoal flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span>Filters {hasActiveFilters && "• Active"}</span>
            </button>

            {/* Inline search for desktop */}
            <div className="flex-1 max-w-xs relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-brand-ivory border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-gray-400"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right: Sort By Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-gold shrink-0" />
              <span className="text-brand-charcoal-muted hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-ivory border border-brand-sage-light rounded-xl px-2.5 py-1.5 text-xs text-brand-charcoal font-semibold focus:outline-none focus:border-brand-emerald cursor-pointer"
              >
                <option value="featured">Featured & Bestsellers</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
              <span className="text-[10px] sm:text-[11px] text-brand-charcoal-muted">Active:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-sage-light/40 text-brand-emerald px-2.5 py-0.5 rounded-full font-medium">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("All")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {selectedSizeFilter && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-sage-light/40 text-brand-emerald px-2.5 py-0.5 rounded-full font-medium">
                  <span>Size: {selectedSizeFilter}</span>
                  <button onClick={() => setSelectedSizeFilter("")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {maxPrice < 10000 && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-sage-light/40 text-brand-emerald px-2.5 py-0.5 rounded-full font-medium">
                  <span>Under ₹{maxPrice.toLocaleString("en-IN")}</span>
                  <button onClick={() => setMaxPrice(10000)}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-sage-light/40 text-brand-emerald px-2.5 py-0.5 rounded-full font-medium">
                  <span>In Stock</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-sage-light/40 text-brand-emerald px-2.5 py-0.5 rounded-full font-medium">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-gold-dark hover:underline font-bold ml-1"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Products Grid: Exactly 2 columns on mobile, 3 on tablet, 3 on desktop */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelectProduct={onSelectProduct}
                  onOpenSizeGuide={onOpenSizeGuide}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-2xl border border-brand-sage-light p-10 text-center max-w-md mx-auto my-6 space-y-3">
              <div className="w-14 h-14 rounded-full bg-brand-ivory border border-brand-sage-light flex items-center justify-center mx-auto text-brand-gold">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-brand-charcoal">
                No matching jewellery found
              </h3>
              <p className="text-xs text-brand-charcoal-light">
                Try widening your price range, clearing selected size, or removing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition shadow-luxury"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInLeft">
            {/* Header */}
            <div className="p-4 bg-brand-emerald text-white flex items-center justify-between border-b border-brand-gold/40">
              <span className="font-serif font-bold text-base flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-gold" />
                <span>Filter Jewellery</span>
              </span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="p-4 space-y-5 overflow-y-auto">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                  Category
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full text-left px-3 py-2 rounded-xl transition ${
                      selectedCategory === "All" ? "bg-brand-emerald text-white font-bold" : "bg-brand-ivory"
                    }`}
                  >
                    All Jewellery
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        selectedCategory === c.name ? "bg-brand-emerald text-white font-bold" : "bg-brand-ivory"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="font-bold uppercase tracking-wider">Max Price</span>
                  <span className="font-bold text-brand-emerald">₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-emerald"
                />
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal mb-2">
                  Bangle / Ring Size
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? "" : sz)}
                      className={`text-xs py-2 px-1 rounded-xl border text-center transition ${
                        selectedSizeFilter === sz
                          ? "bg-brand-emerald text-white border-brand-emerald font-bold"
                          : "bg-brand-ivory border-brand-sage-light text-brand-charcoal"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock only */}
              <div>
                <label className="flex items-center space-x-2 text-xs cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-brand-emerald h-4 w-4"
                  />
                  <span className="font-semibold">In Stock Items Only</span>
                </label>
              </div>
            </div>

            {/* Mobile Footer Apply Button */}
            <div className="p-4 bg-brand-ivory border-t border-brand-sage-light flex space-x-2">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-2.5 rounded-xl border border-brand-sage-light text-xs font-semibold text-brand-charcoal hover:bg-gray-100"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 rounded-xl bg-brand-emerald text-white text-xs font-bold hover:bg-brand-emerald-light shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
