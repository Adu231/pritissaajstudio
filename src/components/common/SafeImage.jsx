import React, { useState } from "react";
import { Sparkles } from "lucide-react";

// Curated high-availability jewellery fallback images (reliable direct links + SVG fallbacks)
const CATEGORY_FALLBACK_SVGS = {
  Necklaces: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><circle cx="200" cy="170" r="110" fill="none" stroke="#D4AF37" stroke-width="4" stroke-dasharray="8 6"/><path d="M 120 170 Q 200 280 280 170" fill="none" stroke="#0B3D2E" stroke-width="6"/><circle cx="200" cy="235" r="16" fill="#D4AF37"/><circle cx="160" cy="215" r="10" fill="#D4AF37"/><circle cx="240" cy="215" r="10" fill="#D4AF37"/><text x="200" y="340" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Kolhapuri Saaj & Necklaces</text><text x="200" y="362" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">24K MICRO GOLD FINISH</text></svg>`,
  Bangles: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><ellipse cx="180" cy="190" rx="90" ry="45" fill="none" stroke="#D4AF37" stroke-width="12" transform="rotate(-25 180 190)"/><ellipse cx="220" cy="210" rx="90" ry="45" fill="none" stroke="#0B3D2E" stroke-width="10" transform="rotate(-25 220 210)"/><circle cx="150" cy="150" r="6" fill="#E9C865"/><circle cx="250" cy="250" r="6" fill="#E9C865"/><text x="200" y="340" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Pichodi & Tode Bangles</text><text x="200" y="362" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">AUTHENTIC SIZES 2.4 - 2.10</text></svg>`,
  Earrings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><circle cx="150" cy="130" r="14" fill="#D4AF37"/><path d="M 125 180 Q 150 145 175 180 Z" fill="#0B3D2E" stroke="#D4AF37" stroke-width="2"/><circle cx="150" cy="205" r="5" fill="#D4AF37"/><circle cx="250" cy="130" r="14" fill="#D4AF37"/><path d="M 225 180 Q 250 145 275 180 Z" fill="#0B3D2E" stroke="#D4AF37" stroke-width="2"/><circle cx="250" cy="205" r="5" fill="#D4AF37"/><text x="200" y="340" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Temple Kemp Jhumkas</text><text x="200" y="362" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">HANDCRAFTED DROP EARRINGS</text></svg>`,
  Rings: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><circle cx="200" cy="200" r="65" fill="none" stroke="#D4AF37" stroke-width="10"/><path d="M 200 115 L 225 140 L 200 165 L 175 140 Z" fill="#0B3D2E" stroke="#D4AF37" stroke-width="3"/><circle cx="200" cy="140" r="8" fill="#E9C865"/><text x="200" y="340" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Royal Polki Statement Ring</text><text x="200" y="362" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">COMFORT FIT SHANK</text></svg>`,
  "Bridal Sets": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><path d="M 100 120 Q 200 240 300 120" fill="none" stroke="#D4AF37" stroke-width="8"/><path d="M 130 150 Q 200 270 270 150" fill="none" stroke="#0B3D2E" stroke-width="6"/><circle cx="200" cy="210" r="18" fill="#D4AF37"/><circle cx="200" cy="250" r="14" fill="#D4AF37"/><text x="200" y="340" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Royal Heritage Bridal Set</text><text x="200" y="362" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">COMPLETE HEIRLOOM JEWELLERY</text></svg>`,
  default: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%"><rect width="400" height="400" fill="#F8F7F1"/><circle cx="200" cy="180" r="70" fill="none" stroke="#D4AF37" stroke-width="4"/><polygon points="200,130 240,180 200,230 160,180" fill="#0B3D2E" stroke="#D4AF37" stroke-width="2"/><circle cx="200" cy="180" r="10" fill="#D4AF37"/><text x="200" y="330" font-family="'Playfair Display', serif" font-size="18" font-weight="700" fill="#0B3D2E" text-anchor="middle">Priti's Saaj Studio</text><text x="200" y="352" font-family="'Poppins', sans-serif" font-size="11" fill="#D4AF37" text-anchor="middle">HANDCRAFTED JEWELLERY</text></svg>`,
};

export const SafeImage = ({
  src,
  alt = "Priti's Saaj Studio Jewellery",
  className = "",
  aspectRatio = "aspect-square",
  category = "default",
  fallbackSrc = null,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // SVG Data URI fallback based on product category
  const svgMarkup = CATEGORY_FALLBACK_SVGS[category] || CATEGORY_FALLBACK_SVGS.default;
  const svgDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgMarkup)}`;

  const finalSrc = hasError ? (fallbackSrc || svgDataUri) : (src || svgDataUri);

  return (
    <div className={`relative overflow-hidden bg-brand-ivory ${aspectRatio} ${className}`} onClick={onClick}>
      {/* Shimmer skeleton while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ivory via-brand-sage-light/30 to-brand-ivory animate-pulse flex items-center justify-center z-0">
          <Sparkles className="w-5 h-5 text-brand-gold/40" />
        </div>
      )}

      {/* Actual Image with error handler */}
      <img
        src={finalSrc}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setIsLoading(false);
          }
        }}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};

