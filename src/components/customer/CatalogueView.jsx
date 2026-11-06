import React, { useState } from "react";
import {
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  X,
  RotateCcw,
  Sparkles,
  Ruler,
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
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 bg-white">
      {/* Page Header */}
      <div className="mb-5 sm:mb-8 text-center sm:text-left sm:flex sm:items-end sm:justify-between border-b border-brand-border/60 pb-5">
        <div>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-champagne-dark font-bold font-poppins">
            Royal Heirloom Jewels
          </span>
          <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-forest mt-1">
            {selectedCategory === "All" ? "All Jewellery Collection" : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            Showing {filteredProducts.length} handcrafted pieces
          </p>
        </div>

        {/* Quick Size Guide link */}
        <button
          onClick={() => onOpenSizeGuide()}
          className="mt-3 sm:mt-0 inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-brand-champagne/20 hover:bg-brand-champagne/30 text-brand-forest text-xs font-bold border border-brand-champagne/50 transition"
        >
          <Ruler className="w-3.5 h-3.5 text-brand-champagne-dark shrink-0" />
          <span>Bangle Measurement Guide</span>
        </button>
      </div>

      {/* Main Layout: Filter Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-xs space-y-5">
            {/* Filter Header */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <span className="font-serif font-bold text-sm text-brand-forest flex items-center space-x-1.5">
                <SlidersHorizontal className="w-4 h-4 text-brand-champagne-dark" />
                <span>Filters</span>
              </span>
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-champagne-dark hover:underline flex items-center space-x-1 font-semibold"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
            </div>

            {/* Categories */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                Categories
              </h4>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory("All")}
                  className={`w-full text-left px-2.5 py-1.5 rounded-xl transition ${
                    selectedCategory === "All"
                      ? "bg-brand-forest text-white font-bold"
                      : "text-brand-dark/80 hover:bg-brand-offwhite"
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
                        ? "bg-brand-forest text-white font-bold"
                        : "text-brand-dark/80 hover:bg-brand-offwhite"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span
                      className={`text-[10px] ${
                        selectedCategory === c.name ? "text-brand-champagne-light" : "text-brand-muted"
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
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark">
                  Max Price
                </h4>
                <span className="text-xs font-bold text-brand-forest">
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
                className="w-full accent-brand-forest cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-brand-muted mt-1">
                <span>₹1,000</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
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
                        ? "bg-brand-forest border-brand-forest text-white font-bold"
                        : "bg-brand-offwhite border-brand-border text-brand-dark hover:border-brand-forest"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability Checkbox */}
            <div className="pt-2 border-t border-brand-border/60">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs text-brand-dark">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded border-brand-border text-brand-forest focus:ring-brand-forest h-4 w-4"
                />
                <span className="font-medium">In Stock Items Only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Products Column */}
        <main className="flex-1 min-w-0">
          {/* Top Bar: Sort & Filter Trigger for Mobile */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-brand-border shadow-xs mb-5 flex flex-wrap items-center justify-between gap-2.5">
            {/* Left: Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3 py-2 bg-brand-offwhite border border-brand-border rounded-xl text-xs font-bold text-brand-forest flex items-center space-x-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-brand-champagne-dark shrink-0" />
              <span>Filters {hasActiveFilters && "• Active"}</span>
            </button>

            {/* Inline search for desktop */}
            <div className="flex-1 max-w-xs relative hidden sm:block">
              <Search className="w-3.5 h-3.5 text-brand-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by keyword..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-brand-offwhite border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark placeholder-brand-muted"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-brand-muted hover:text-brand-dark"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Right: Sort By Dropdown */}
            <div className="flex items-center space-x-1.5 text-xs ml-auto">
              <ArrowUpDown className="w-3.5 h-3.5 text-brand-champagne-dark shrink-0" />
              <span className="text-brand-muted hidden sm:inline">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-brand-offwhite border border-brand-border rounded-xl px-2.5 py-1.5 text-xs text-brand-dark font-semibold focus:outline-none focus:border-brand-forest cursor-pointer"
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
              <span className="text-[10px] sm:text-[11px] text-brand-muted">Active:</span>
              {selectedCategory !== "All" && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-champagne/20 text-brand-forest px-2.5 py-0.5 rounded-full font-medium border border-brand-champagne/40">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory("All")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {selectedSizeFilter && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-champagne/20 text-brand-forest px-2.5 py-0.5 rounded-full font-medium border border-brand-champagne/40">
                  <span>Size: {selectedSizeFilter}</span>
                  <button onClick={() => setSelectedSizeFilter("")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {maxPrice < 10000 && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-champagne/20 text-brand-forest px-2.5 py-0.5 rounded-full font-medium border border-brand-champagne/40">
                  <span>Under ₹{maxPrice.toLocaleString("en-IN")}</span>
                  <button onClick={() => setMaxPrice(10000)}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {inStockOnly && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-champagne/20 text-brand-forest px-2.5 py-0.5 rounded-full font-medium border border-brand-champagne/40">
                  <span>In Stock</span>
                  <button onClick={() => setInStockOnly(false)}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center space-x-1 text-[11px] sm:text-xs bg-brand-champagne/20 text-brand-forest px-2.5 py-0.5 rounded-full font-medium border border-brand-champagne/40">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery("")}>
                    <X className="w-3 h-3 hover:text-red-600" />
                  </button>
                </span>
              )}
              <button
                onClick={handleResetFilters}
                className="text-xs text-brand-champagne-dark hover:underline font-bold ml-1"
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
            <div className="bg-white rounded-2xl border border-brand-border p-10 text-center max-w-md mx-auto my-6 space-y-3 shadow-xs">
              <div className="w-14 h-14 rounded-full bg-brand-offwhite border border-brand-border flex items-center justify-center mx-auto text-brand-champagne-dark">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-brand-forest">
                No matching jewellery found
              </h3>
              <p className="text-xs text-brand-muted">
                Try widening your price range, clearing selected size, or removing search keywords.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition shadow-luxury"
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
            className="fixed inset-0 bg-brand-dark/60 backdrop-blur-sm"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInLeft">
            {/* Header */}
            <div className="p-4 bg-brand-forest text-white flex items-center justify-between border-b border-brand-champagne/40">
              <span className="font-serif font-bold text-base flex items-center space-x-2">
                <SlidersHorizontal className="w-4 h-4 text-brand-champagne" />
                <span>Filter Jewellery</span>
              </span>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filters Content */}
            <div className="p-4 space-y-5 overflow-y-auto bg-white">
              {/* Category */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Category
                </h4>
                <div className="space-y-1 text-xs">
                  <button
                    onClick={() => setSelectedCategory("All")}
                    className={`w-full text-left px-3 py-2 rounded-xl transition ${
                      selectedCategory === "All" ? "bg-brand-forest text-white font-bold" : "bg-brand-offwhite text-brand-dark"
                    }`}
                  >
                    All Jewellery
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl transition ${
                        selectedCategory === c.name ? "bg-brand-forest text-white font-bold" : "bg-brand-offwhite text-brand-dark"
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
                  <span className="font-bold uppercase tracking-wider text-brand-dark">Max Price</span>
                  <span className="font-bold text-brand-forest">₹{maxPrice.toLocaleString("en-IN")}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000"
                  step="500"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-brand-forest"
                />
              </div>

              {/* Sizes */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-brand-dark mb-2">
                  Bangle / Ring Size
                </h4>
                <div className="grid grid-cols-3 gap-1.5">
                  {ALL_SIZES.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSizeFilter(selectedSizeFilter === sz ? "" : sz)}
                      className={`text-xs py-2 px-1 rounded-xl border text-center transition ${
                        selectedSizeFilter === sz
                          ? "bg-brand-forest text-white border-brand-forest font-bold"
                          : "bg-brand-offwhite border-brand-border text-brand-dark"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock only */}
              <div>
                <label className="flex items-center space-x-2 text-xs cursor-pointer text-brand-dark">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded text-brand-forest h-4 w-4"
                  />
                  <span className="font-semibold">In Stock Items Only</span>
                </label>
              </div>
            </div>

            {/* Mobile Footer Apply Button */}
            <div className="p-4 bg-brand-offwhite border-t border-brand-border flex space-x-2">
              <button
                onClick={handleResetFilters}
                className="w-1/3 py-2.5 rounded-xl border border-brand-border text-xs font-semibold text-brand-dark hover:bg-white"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-2/3 py-2.5 rounded-xl bg-brand-forest text-white text-xs font-bold hover:bg-brand-forest-dark shadow-md"
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
