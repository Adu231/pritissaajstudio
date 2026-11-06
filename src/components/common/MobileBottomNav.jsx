import React from "react";
import { Home, Grid, ShoppingBag, User, Ruler, Shield } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

export const MobileBottomNav = ({
  currentView,
  setCurrentView,
  onOpenSizeGuide,
  onOpenAuth,
}) => {
  const { cartCount, openCart } = useCart();
  const { user, isAdmin } = useAuth();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-brand-border shadow-[0_-4px_20px_rgba(11,59,36,0.06)] px-1 py-1.5 flex items-center justify-around safe-area-bottom">
      <button
        onClick={() => {
          setCurrentView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition ${
          currentView === "home" ? "text-brand-forest font-bold bg-brand-champagne/15" : "text-brand-muted hover:text-brand-forest"
        }`}
        aria-label="Home"
      >
        <Home className={`w-5 h-5 ${currentView === "home" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Home</span>
      </button>

      <button
        onClick={() => {
          setCurrentView("catalogue");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition ${
          currentView === "catalogue" ? "text-brand-forest font-bold bg-brand-champagne/15" : "text-brand-muted hover:text-brand-forest"
        }`}
        aria-label="Shop"
      >
        <Grid className={`w-5 h-5 ${currentView === "catalogue" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">Shop</span>
      </button>

      <button
        onClick={onOpenSizeGuide}
        className="flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-brand-forest hover:text-brand-forest-dark transition"
        aria-label="Size Guide"
      >
        <Ruler className="w-5 h-5 text-brand-champagne-dark stroke-[2]" />
        <span className="text-[10px] mt-0.5 font-semibold text-brand-forest tracking-tight">Sizes</span>
      </button>

      <button
        onClick={openCart}
        className="relative flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl text-brand-muted hover:text-brand-forest transition"
        aria-label="Bag"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-brand-champagne text-brand-forest text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] mt-0.5 tracking-tight">Bag</span>
      </button>

      <button
        onClick={() => {
          if (user) {
            setCurrentView("profile");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else {
            onOpenAuth();
          }
        }}
        className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition ${
          currentView === "profile" ? "text-brand-forest font-bold bg-brand-champagne/15" : "text-brand-muted hover:text-brand-forest"
        }`}
        aria-label="Profile"
      >
        <User className={`w-5 h-5 ${currentView === "profile" ? "stroke-[2.5]" : "stroke-[1.75]"}`} />
        <span className="text-[10px] mt-0.5 tracking-tight">{user ? "Profile" : "Sign In"}</span>
      </button>

      {isAdmin && (
        <button
          onClick={() => {
            setCurrentView(currentView === "admin" ? "home" : "admin");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[44px] py-1 px-1.5 rounded-xl transition ${
            currentView === "admin" ? "text-brand-forest font-bold bg-brand-champagne/25 border border-brand-champagne/40" : "text-brand-forest"
          }`}
          aria-label="Admin"
        >
          <Shield className="w-5 h-5 text-brand-champagne-dark stroke-[2]" />
          <span className="text-[10px] mt-0.5 font-bold tracking-tight">Admin</span>
        </button>
      )}
    </nav>
  );
};
