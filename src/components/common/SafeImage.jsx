import React, { useState, useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";

// Curated high-availability jewellery vector artwork (Deep Forest Green #0B3B24 & Champagne Gold #E3CBA9)
const JewelleryVectorFallback = ({ category = "default" }) => {
  switch (category) {
    case "Bangles":
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <ellipse cx="125" cy="135" rx="68" ry="34" stroke="#E3CBA9" strokeWidth="8" transform="rotate(-25 125 135)" />
          <ellipse cx="165" cy="155" rx="68" ry="34" stroke="#0B3B24" strokeWidth="7" transform="rotate(-25 165 155)" />
          <circle cx="95" cy="108" r="5" fill="#E3CBA9" />
          <circle cx="195" cy="182" r="5" fill="#E3CBA9" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="13" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Heritage Pichodi & Tode Bangles
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            PRITI'S SAAJ STUDIO • 24K MICRO GOLD
          </text>
        </svg>
      );
    case "Necklaces":
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <path d="M 70 105 Q 150 210 230 105" stroke="#0B3B24" strokeWidth="5" strokeLinecap="round" />
          <path d="M 85 120 Q 150 195 215 120" stroke="#E3CBA9" strokeWidth="3" strokeDasharray="5 4" />
          <circle cx="150" cy="170" r="14" fill="#E3CBA9" />
          <circle cx="150" cy="170" r="7" fill="#0B3B24" />
          <circle cx="120" cy="154" r="6" fill="#E3CBA9" />
          <circle cx="180" cy="154" r="6" fill="#E3CBA9" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="13" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Authentic 21-Pan Kolhapuri Saaj
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            PRITI'S SAAJ STUDIO • 24K MICRO GOLD
          </text>
        </svg>
      );
    case "Earrings":
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <circle cx="110" cy="95" r="10" fill="#E3CBA9" />
          <path d="M 90 135 Q 110 108 130 135 Z" fill="#0B3B24" stroke="#E3CBA9" strokeWidth="2" />
          <circle cx="110" cy="155" r="4" fill="#E3CBA9" />
          <circle cx="190" cy="95" r="10" fill="#E3CBA9" />
          <path d="M 170 135 Q 190 108 210 135 Z" fill="#0B3B24" stroke="#E3CBA9" strokeWidth="2" />
          <circle cx="190" cy="155" r="4" fill="#E3CBA9" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="13" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Temple Kemp Stone Jhumkas
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            PRITI'S SAAJ STUDIO • 24K MICRO GOLD
          </text>
        </svg>
      );
    case "Rings":
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <circle cx="150" cy="145" r="46" stroke="#E3CBA9" strokeWidth="8" />
          <polygon points="150,85 168,105 150,125 132,105" fill="#0B3B24" stroke="#E3CBA9" strokeWidth="2" />
          <circle cx="150" cy="105" r="6" fill="#E3CBA9" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="13" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Royal Polki Statement Ring
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            PRITI'S SAAJ STUDIO • 24K MICRO GOLD
          </text>
        </svg>
      );
    case "Bridal Sets":
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <path d="M 60 90 Q 150 180 240 90" stroke="#E3CBA9" strokeWidth="6" />
          <path d="M 85 110 Q 150 195 215 110" stroke="#0B3B24" strokeWidth="5" />
          <circle cx="150" cy="160" r="14" fill="#E3CBA9" />
          <circle cx="150" cy="190" r="9" fill="#0B3B24" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="13" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Royal Heritage Bridal Set
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            PRITI'S SAAJ STUDIO • 24K MICRO GOLD
          </text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 300 300" className="w-full h-full p-4 select-none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="300" height="300" rx="16" fill="#FAF8F5" />
          <circle cx="150" cy="130" r="48" stroke="#E3CBA9" strokeWidth="4" />
          <polygon points="150,95 178,130 150,165 122,130" fill="#0B3B24" stroke="#E3CBA9" strokeWidth="2" />
          <circle cx="150" cy="130" r="8" fill="#E3CBA9" />
          <text x="150" y="235" fontFamily="'Playfair Display', serif" fontSize="14" fontWeight="700" fill="#0B3B24" textAnchor="middle">
            Priti's Saaj Studio
          </text>
          <text x="150" y="254" fontFamily="'Poppins', sans-serif" fontSize="9" fontWeight="600" fill="#C5A87F" letterSpacing="1" textAnchor="middle">
            HANDCRAFTED HERITAGE JEWELLERY
          </text>
        </svg>
      );
  }
};

export const SafeImage = ({
  src,
  alt = "Priti's Saaj Studio Jewellery",
  className = "",
  aspectRatio = "aspect-square",
  category = "default",
  fallbackSrc = null,
  loading = "lazy",
  priority = false,
  onClick,
}) => {
  const [hasError, setHasError] = useState(!src);
  const [isLoading, setIsLoading] = useState(Boolean(src));
  const imgRef = useRef(null);

  // Reset loading and error state when src changes
  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
    } else {
      setHasError(false);
      setIsLoading(true);
      if (imgRef.current?.complete && imgRef.current?.naturalWidth > 0) {
        setIsLoading(false);
      }
    }
  }, [src]);

  // If there's an error or no src provided, render the native SVG JSX fallback directly!
  // This guarantees that no broken image icon can ever appear in the browser DOM.
  if (hasError || !src) {
    return (
      <div
        className={`relative overflow-hidden bg-brand-offwhite flex items-center justify-center ${aspectRatio} ${className}`}
        onClick={onClick}
        title={alt}
        role="img"
        aria-label={alt}
      >
        {fallbackSrc ? (
          <img
            src={fallbackSrc}
            alt={alt}
            className="w-full h-full object-cover object-center"
            onError={() => setHasError(true)}
          />
        ) : (
          <JewelleryVectorFallback category={category} />
        )}
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-brand-offwhite ${aspectRatio} ${className}`} onClick={onClick}>
      {/* Soft warm shimmer skeleton while loading */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-brand-offwhite via-brand-border/30 to-brand-offwhite animate-pulse flex items-center justify-center z-0">
          <Sparkles className="w-5 h-5 text-brand-champagne/60" />
        </div>
      )}

      {/* Actual Image with automatic instant error recovery */}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        loading={priority ? "eager" : loading}
        decoding="async"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`w-full h-full object-cover object-center transition-opacity duration-300 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
};
