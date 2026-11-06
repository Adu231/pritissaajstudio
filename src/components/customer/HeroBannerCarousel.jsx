import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { SafeImage } from "../common/SafeImage";

export const HeroBannerCarousel = ({ setCurrentView, onOpenSizeGuide }) => {
  const { activeBanners, setSelectedCategory } = useProducts();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Touch swipe handling for mobile
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  // Auto-advance banner every 6 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (!activeBanners || activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handleCtaClick = (link) => {
    if (link?.includes("Bangles") || link?.includes("Guide")) {
      setSelectedCategory("Bangles");
      setCurrentView("catalogue");
    } else if (link?.includes("Bridal")) {
      setSelectedCategory("Bridal Sets");
      setCurrentView("catalogue");
    } else if (link?.includes("Necklaces")) {
      setSelectedCategory("Necklaces");
      setCurrentView("catalogue");
    } else {
      setSelectedCategory("All");
      setCurrentView("catalogue");
    }
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    } else if (diff < -50) {
      setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <div
      className="relative w-full overflow-hidden bg-brand-offwhite border-b border-brand-border/60"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Slide */}
      <div className="relative min-h-[380px] sm:min-h-[460px] md:min-h-[520px] flex items-center">
        {/* Background SafeImage with luminous luxury overlay */}
        <div className="absolute inset-0 z-0">
          <SafeImage
            src={currentBanner.imageUrl}
            alt={currentBanner.title}
            category="Necklaces"
            aspectRatio="h-full w-full"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Sophisticated White & Champagne Gold Gradient Overlay for high readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/30 sm:w-4/5 z-10" />
          <div className="absolute inset-0 bg-brand-offwhite/10 z-10" />
        </div>

        {/* Content Box */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-16 w-full">
          <div className="max-w-xl space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-champagne/25 border border-brand-champagne text-brand-forest text-[10px] sm:text-xs font-bold tracking-wider uppercase backdrop-blur-sm shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-champagne-dark shrink-0" />
              <span>Royal Maharashtrian Heritage</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight text-brand-forest drop-shadow-xs">
              {currentBanner.title}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-brand-dark/85 leading-relaxed font-poppins">
              {currentBanner.subtitle}
            </p>

            <div className="pt-2 flex flex-wrap gap-2.5 sm:gap-3">
              <button
                onClick={() => handleCtaClick(currentBanner.link)}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-luxury flex items-center space-x-2 group"
              >
                <span>{currentBanner.ctaText || "Explore Collection"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenSizeGuide}
                className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/90 hover:bg-white text-brand-forest font-semibold text-xs sm:text-sm border border-brand-forest/30 backdrop-blur-sm transition shadow-xs"
              >
                Bangle Size Guide
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows (Desktop) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)
            }
            className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-forest items-center justify-center backdrop-blur-sm border border-brand-border shadow-md transition"
            aria-label="Previous banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
            className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-brand-forest items-center justify-center backdrop-blur-sm border border-brand-border shadow-md transition"
            aria-label="Next banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 z-20 flex justify-center space-x-2">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 sm:w-8 bg-brand-champagne" : "w-2 bg-brand-border hover:bg-brand-champagne/60"
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
