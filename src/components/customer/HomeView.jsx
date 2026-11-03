import React from "react";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Award, Star, Ruler } from "lucide-react";
import { HeroBannerCarousel } from "./HeroBannerCarousel";
import { CategorySection } from "./CategorySection";
import { ProductCard } from "./ProductCard";
import { useProducts } from "../../context/ProductContext";
import { SafeImage } from "../common/SafeImage";

export const HomeView = ({
  setCurrentView,
  onSelectProduct,
  onOpenSizeGuide,
}) => {
  const { products, setSelectedCategory } = useProducts();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestsellers = products.filter((p) => p.isBestseller).slice(0, 4);

  return (
    <div className="space-y-10 sm:space-y-16 pb-12 overflow-x-hidden">
      {/* 1. Hero Carousel with Touch Swipe */}
      <HeroBannerCarousel
        setCurrentView={setCurrentView}
        onOpenSizeGuide={onOpenSizeGuide}
      />

      {/* 2. Shop by Category */}
      <CategorySection setCurrentView={setCurrentView} />

      {/* 3. Featured Heirloom Jewellery */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-brand-sage-light/60">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-gold-dark font-bold font-poppins flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Royal Curation</span>
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-brand-emerald mt-1">
              Featured Jewellery
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal-light mt-1">
              Hand-picked statement pieces celebrating timeless Indian elegance.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentView("catalogue");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-2.5 sm:mt-0 text-xs font-bold text-brand-emerald hover:text-brand-gold-dark transition flex items-center space-x-1 group self-start sm:self-auto"
          >
            <span>View Full Catalogue</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Col Mobile, 4-Col Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onOpenSizeGuide={onOpenSizeGuide}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Festive Coupon Callout Banner */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-emerald via-brand-emerald-dark to-brand-emerald text-white p-6 sm:p-10 border border-brand-gold/40 shadow-luxury">
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-brand-gold/25 text-brand-gold text-[10px] sm:text-xs font-bold tracking-wider uppercase border border-brand-gold/40">
              Limited Festive Privileges
            </span>
            <h3 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-ivory leading-tight">
              Enjoy 10% Off Your Entire Heirloom Order
            </h3>
            <p className="text-xs sm:text-sm text-brand-sage-light leading-relaxed">
              Use code <strong className="text-brand-gold text-xs sm:text-sm tracking-wider font-poppins font-bold">SAAJ10</strong> at checkout on all orders above ₹1,999. Complimentary insured shipping and luxury velvet pouch included.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setCurrentView("catalogue");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="min-h-[44px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-gold text-brand-emerald font-bold text-xs sm:text-sm hover:bg-brand-gold-light transition shadow-luxury-gold inline-flex items-center space-x-2"
              >
                <span>Shop Festive Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bestsellers Section */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-5 sm:mb-8 pb-3 sm:pb-4 border-b border-brand-sage-light/60">
          <div>
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-gold-dark font-bold font-poppins flex items-center space-x-1.5">
              <Award className="w-3.5 h-3.5 text-brand-gold" />
              <span>Customer Favorites</span>
            </span>
            <h2 className="font-serif text-xl sm:text-3xl font-extrabold text-brand-emerald mt-1">
              Most Loved Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal-light mt-1">
              Our iconic Kolhapuri Saaj, Pichodi bangles, and temple chokers cherished by brides.
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentView("catalogue");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-2.5 sm:mt-0 text-xs font-bold text-brand-emerald hover:text-brand-gold-dark transition flex items-center space-x-1 group self-start sm:self-auto"
          >
            <span>Explore All</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 2-Col Mobile, 4-Col Desktop Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-5">
          {bestsellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelectProduct={onSelectProduct}
              onOpenSizeGuide={onOpenSizeGuide}
            />
          ))}
        </div>
      </section>

      {/* 6. Brand Legacy Section */}
      <section className="bg-brand-ivory py-10 sm:py-16 border-y border-brand-sage-light/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
            <div className="space-y-3.5 sm:space-y-4">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-brand-gold-dark font-bold font-poppins">
                Our Heritage Story
              </span>
              <h2 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-emerald leading-snug">
                Preserving the Soul of Maharashtrian Royalty
              </h2>
              <p className="text-xs sm:text-sm text-brand-charcoal-light leading-relaxed">
                Founded with a deep devotion to authentic Indian jewellery, <strong>Priti's Saaj Studio</strong> works closely with indigenous artisans in Kolhapur and Pune. We revive historical designs — from the 21 sacred pan of Kolhapuri Saaj to intricate belpan thushi and engraved tode bangles.
              </p>
              <p className="text-xs sm:text-sm text-brand-charcoal-light leading-relaxed">
                Every piece is coated in long-lasting 24K micro-gold plating, hypoallergenic, and paired with custom size options so you feel as regal as the queens who first inspired them.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  onClick={() => onOpenSizeGuide()}
                  className="min-h-[44px] px-5 py-2.5 rounded-xl border border-brand-emerald text-brand-emerald text-xs font-semibold hover:bg-brand-emerald hover:text-white transition flex items-center space-x-1.5"
                >
                  <Ruler className="w-4 h-4 text-brand-gold" />
                  <span>Learn About Bangle Sizing</span>
                </button>
              </div>
            </div>

            {/* Visual Mosaic with SafeImage */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="rounded-2xl shadow-md overflow-hidden aspect-square border border-brand-sage-light">
                <SafeImage
                  src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80"
                  alt="Jewellery Craftsmanship"
                  category="Necklaces"
                  aspectRatio="aspect-square"
                />
              </div>
              <div className="rounded-2xl shadow-md overflow-hidden aspect-square mt-4 sm:mt-6 border border-brand-sage-light">
                <SafeImage
                  src="https://images.unsplash.com/photo-1611591475841-f76ee30c797d?auto=format&fit=crop&w=800&q=80"
                  alt="Heritage Bangles"
                  category="Bangles"
                  aspectRatio="aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
