import React, { useState } from "react";

export const BrandLogo = ({
  variant = "dark", // 'dark' (for white/ivory bg) or 'light' (for emerald/dark bg)
  size = "md", // 'sm' | 'md' | 'lg' | 'xl'
  showBrandName = false,
  className = "",
  onClick,
}) => {
  const [imgError, setImgError] = useState(false);

  // Height and width mappings that preserve the 1:1 original logo proportions
  const dimensions = {
    sm: "h-9 w-9 sm:h-10 sm:w-10",
    md: "h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14",
    lg: "h-16 w-16 sm:h-20 sm:w-20",
    xl: "h-24 w-24 sm:h-28 sm:w-28",
  };

  const isLight = variant === "light";

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center cursor-pointer select-none group ${className}`}
      role={onClick ? "button" : undefined}
      title="Priti's Saaj Studio"
    >
      {/* Official Brand Hallmark Container preserving original colors and 1:1 proportions */}
      <div
        className={`shrink-0 flex items-center justify-center transition-all duration-200 group-hover:scale-105 ${
          isLight
            ? "bg-white p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-md border border-brand-gold/40"
            : "bg-white p-0.5 rounded-xl border border-brand-sage-light/30 shadow-xs"
        }`}
      >
        <img
          src={imgError ? "/logo.jpg" : "/logo.png"}
          alt="Priti's Saaj Studio Official Brand Logo"
          className={`${dimensions[size] || dimensions.md} object-contain rounded-lg`}
          onError={() => {
            if (!imgError) setImgError(true);
          }}
        />
      </div>

      {showBrandName && (
        <div className="ml-2 sm:ml-2.5 flex flex-col text-left">
          <span
            className={`font-serif font-bold text-sm sm:text-base md:text-lg tracking-tight leading-none ${
              isLight ? "text-brand-ivory" : "text-brand-emerald"
            }`}
          >
            Priti's Saaj
          </span>
          <span
            className={`text-[8px] sm:text-[9px] tracking-[0.25em] uppercase font-semibold font-poppins mt-0.5 ${
              isLight ? "text-brand-gold" : "text-brand-gold-dark"
            }`}
          >
            Studio • Pune
          </span>
        </div>
      )}
    </div>
  );
};
