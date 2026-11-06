import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { SafeImage } from "../common/SafeImage";

export const CategorySection = ({ setCurrentView }) => {
  const { categories, setSelectedCategory } = useProducts();

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    setCurrentView("catalogue");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-10 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-10">
        <span className="text-[10px] sm:text-xs uppercase tracking-[0.2em] text-brand-champagne-dark font-bold font-poppins flex items-center justify-center space-x-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-champagne" />
          <span>Curated Heritage Jewellery</span>
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-brand-forest mt-1">
          Shop by Royal Category
        </h2>
        <div className="w-14 h-0.5 bg-brand-champagne mx-auto mt-2 rounded-full" />
        <p className="text-xs sm:text-sm text-brand-muted mt-2 px-4">
          Explore handcrafted designs shaped by centuries of Marathi traditions and royal court artistry.
        </p>
      </div>

      {/* Responsive Categories Grid: 2 cols on small mobile, 3 cols on tablet, 5 cols on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelectCategory(cat.name)}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300 border border-brand-border hover:border-brand-champagne text-left bg-white flex flex-col"
          >
            {/* Image Box with SafeImage */}
            <div className="relative aspect-square overflow-hidden bg-brand-offwhite">
              <SafeImage
                src={cat.image}
                alt={cat.name}
                category={cat.name}
                aspectRatio="aspect-square"
                className="group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-transparent to-transparent opacity-75 group-hover:opacity-85 transition-opacity z-10" />

              {/* Count Badge */}
              <span className="absolute top-2 right-2 text-[9px] sm:text-[10px] bg-white/95 backdrop-blur-sm text-brand-forest font-bold px-2 py-0.5 rounded-md shadow-xs z-20 border border-brand-border/60">
                {cat.count}
              </span>
            </div>

            {/* Title & Action */}
            <div className="p-3 sm:p-4 bg-white flex items-center justify-between">
              <div>
                <h3 className="font-serif text-xs sm:text-sm md:text-base font-bold text-brand-forest group-hover:text-brand-forest-light transition">
                  {cat.name}
                </h3>
                <span className="text-[9px] sm:text-[10px] text-brand-muted uppercase tracking-wider font-medium block">
                  View Collection
                </span>
              </div>
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-brand-offwhite text-brand-forest border border-brand-border flex items-center justify-center group-hover:bg-brand-forest group-hover:text-white transition-colors shrink-0">
                <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};
