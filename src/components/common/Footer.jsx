import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  Phone,
  Mail,
  MapPin,
  Heart,
  Send,
  CheckCircle2,
  X,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { BrandLogo } from "./BrandLogo";
import { WhatsAppIcon } from "./WhatsAppButton";
import { WHATSAPP_CONFIG } from "../../utils/whatsapp";

export const Footer = ({ setCurrentView, onOpenSizeGuide }) => {
  const { setSelectedCategory, categories } = useProducts();
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Informational modals state
  const [infoModal, setInfoModal] = useState(null); // 'care' | 'shipping' | 'cod'

  // Lock body scroll and restore smoothly; close on Escape key
  useEffect(() => {
    if (infoModal) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") setInfoModal(null);
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [infoModal]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setSubscribed(true);
      setEmailInput("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-brand-forest text-white pt-12 pb-24 sm:pb-12 border-t border-brand-champagne/30">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 border-b border-brand-forest-light/60">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 text-center">
          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl bg-brand-forest-dark/60 border border-brand-forest-light">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-brand-champagne shrink-0" />
            <h5 className="font-serif font-bold text-xs sm:text-sm text-white">Authentic Craftsmanship</h5>
            <p className="text-[10px] sm:text-xs text-brand-champagne-light leading-snug">
              21-Pan Kolhapuri Saaj & royal temple motifs
            </p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl bg-brand-forest-dark/60 border border-brand-forest-light">
            <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-champagne shrink-0" />
            <h5 className="font-serif font-bold text-xs sm:text-sm text-white">24K Micro Gold Polish</h5>
            <p className="text-[10px] sm:text-xs text-brand-champagne-light leading-snug">
              High longevity plating with tarnish resistance
            </p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl bg-brand-forest-dark/60 border border-brand-forest-light">
            <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-brand-champagne shrink-0" />
            <h5 className="font-serif font-bold text-xs sm:text-sm text-white">Insured Pan-India Shipping</h5>
            <p className="text-[10px] sm:text-xs text-brand-champagne-light leading-snug">
              Delivered safely in luxury velvet pouches
            </p>
          </div>

          <div className="flex flex-col items-center space-y-1.5 p-3 rounded-2xl bg-brand-forest-dark/60 border border-brand-forest-light">
            <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-brand-champagne shrink-0" />
            <h5 className="font-serif font-bold text-xs sm:text-sm text-white">Size Exchange Guarantee</h5>
            <p className="text-[10px] sm:text-xs text-brand-champagne-light leading-snug">
              Hassle-free size replacement for bangles
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand & Story */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo variant="light" size="lg" showBrandName={true} />
            <p className="text-xs sm:text-sm text-brand-champagne-light leading-relaxed max-w-sm">
              Celebrating the royal heritage of Maharashtra. From authentic 21-Pan Kolhapuri Saaj to heirloom Pichodi bangles and temple jewels, we preserve timeless Indian grandeur for modern royalty.
            </p>

            {/* Newsletter */}
            <div className="pt-2">
              <span className="block text-xs uppercase tracking-wider text-brand-champagne font-semibold mb-2">
                Join Our VIP Circle for Special Offers
              </span>
              {subscribed ? (
                <div className="flex items-center space-x-2 text-xs text-white bg-brand-forest-light p-2.5 rounded-xl border border-brand-champagne/40">
                  <CheckCircle2 className="w-4 h-4 text-brand-champagne shrink-0" />
                  <span>Welcome! Use code <strong>SAAJ10</strong> for 10% OFF your first order.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex max-w-sm">
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3.5 py-2 text-xs bg-brand-forest-dark text-white placeholder-brand-champagne-light/60 border border-brand-forest-light rounded-l-xl focus:outline-none focus:border-brand-champagne"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-champagne text-brand-forest text-xs font-bold rounded-r-xl hover:bg-brand-champagne-dark transition flex items-center space-x-1"
                  >
                    <span>Join</span>
                    <Send className="w-3 h-3" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Jewellery Collections */}
          <div>
            <h5 className="font-serif font-bold text-sm text-brand-champagne mb-3 uppercase tracking-wider">
              Jewellery
            </h5>
            <ul className="space-y-2 text-xs text-brand-champagne-light">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentView("catalogue");
                  }}
                  className="hover:text-white transition"
                >
                  All Jewellery
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentView("catalogue");
                    }}
                    className="hover:text-white transition"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care (Interactive) */}
          <div>
            <h5 className="font-serif font-bold text-sm text-brand-champagne mb-3 uppercase tracking-wider">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-brand-champagne-light">
              <li>
                <button
                  onClick={() => onOpenSizeGuide()}
                  className="hover:text-white transition flex items-center space-x-1"
                >
                  <Ruler className="w-3.5 h-3.5 text-brand-champagne" />
                  <span>Bangle Size Guide</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView("profile")}
                  className="hover:text-white transition flex items-center space-x-1"
                >
                  <Truck className="w-3.5 h-3.5 text-brand-champagne" />
                  <span>Track My Order</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInfoModal("care")}
                  className="hover:text-white transition text-left"
                >
                  Jewellery Care & Cleaning
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInfoModal("shipping")}
                  className="hover:text-white transition text-left"
                >
                  Shipping & Delivery Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => setInfoModal("cod")}
                  className="hover:text-white transition text-left"
                >
                  Cash on Delivery (COD) Terms
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h5 className="font-serif font-bold text-sm text-brand-champagne mb-3 uppercase tracking-wider">
              Studio & Contact
            </h5>
            <ul className="space-y-2.5 text-xs text-brand-champagne-light">
              <li className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-brand-champagne shrink-0 mt-0.5" />
                <span>Prabhat Road, Deccan Gymkhana, Pune, Maharashtra 411004</span>
              </li>
              <li className="flex items-center space-x-2">
                <WhatsAppIcon className="w-4 h-4 text-[#25D366] shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_CONFIG.phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hover:underline transition font-semibold"
                >
                  WhatsApp: {WHATSAPP_CONFIG.displayPhone}
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-brand-champagne shrink-0" />
                <span>Call: +91 93078 68286 (10 AM - 7 PM)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-brand-champagne shrink-0" />
                <span>support@pritis-saaj.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Modes */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 border-t border-brand-forest-light/60 flex flex-col sm:flex-row items-center justify-between text-xs text-brand-champagne-light space-y-4 sm:space-y-0">
        <p className="flex items-center space-x-1 text-center sm:text-left">
          <span>© 2026 Priti's Saaj Studio. Handcrafted with</span>
          <Heart className="w-3.5 h-3.5 text-brand-champagne inline" />
          <span>in Maharashtra, India.</span>
        </p>
        <div className="flex items-center space-x-2 text-[10px] sm:text-[11px] bg-brand-forest-dark/60 px-3 py-1.5 rounded-xl border border-brand-forest-light">
          <span className="text-brand-champagne font-bold">Modes:</span>
          <span>UPI • RuPay • Cards • NetBanking • Cash on Delivery</span>
        </div>
      </div>

      {/* Informative Modals (Portalled to document.body for pristine stacking) */}
      {infoModal &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brand-dark/70 backdrop-blur-sm animate-fadeIn"
            role="dialog"
            aria-modal="true"
            aria-label="Policy Information"
            onClick={() => setInfoModal(null)}
          >
            <div
              className="bg-white text-brand-dark rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-brand-border space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <h3 className="font-serif font-bold text-base sm:text-lg text-brand-forest">
                  {infoModal === "care" && "Jewellery Care & Cleaning"}
                  {infoModal === "shipping" && "Shipping & Delivery Policy"}
                  {infoModal === "cod" && "Cash on Delivery (COD) Terms"}
                </h3>
                <button
                  onClick={() => setInfoModal(null)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl hover:bg-brand-offwhite text-brand-muted hover:text-brand-dark active:scale-95 transition"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-brand-dark/80 leading-relaxed space-y-2">
                {infoModal === "care" && (
                  <>
                    <p>To preserve the radiant lustre of your 24K micro-gold plated jewellery:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Always put your jewellery on after applying perfumes, lotions, and makeup.</li>
                      <li>Store each piece individually in the provided luxury velvet pouch.</li>
                      <li>Avoid direct exposure to chlorine, ocean water, or household detergents.</li>
                      <li>Wipe gently with a clean, dry microfibre cloth after each wear.</li>
                    </ul>
                  </>
                )}

                {infoModal === "shipping" && (
                  <>
                    <p><strong>Pan-India Insured Delivery:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Orders over ₹1,499 receive Complimentary Express Shipping.</li>
                      <li>Orders are dispatched from our Pune studio within 24–48 hours.</li>
                      <li>Metro cities receive delivery within 3–4 business days via Blue Dart.</li>
                      <li>Real-time tracking number with SMS/WhatsApp alerts is provided on dispatch.</li>
                    </ul>
                  </>
                )}

                {infoModal === "cod" && (
                  <>
                    <p><strong>Cash on Delivery Guidelines:</strong></p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>COD is available across all serviceable pin codes in India.</li>
                      <li>Payment can be made in Cash or via UPI scan to the courier representative.</li>
                      <li>Please have the exact cash amount or active UPI app ready upon delivery.</li>
                    </ul>
                  </>
                )}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => setInfoModal(null)}
                  className="px-5 py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark active:scale-98 transition min-h-[40px]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </footer>
  );
};
