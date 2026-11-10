import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Ruler,
  Shield,
  LogOut,
  ChevronDown,
  Package,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { BrandLogo } from "./BrandLogo";
import { SafeImage } from "./SafeImage";

export const Header = ({
  currentView,
  setCurrentView,
  onOpenSizeGuide,
  onOpenAuth,
  onSelectProduct,
}) => {
  const { user, logout, switchAccount, isAdmin } = useAuth();
  const { cartCount, openCart } = useCart();
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    products,
  } = useProducts();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const userDropdownRef = useRef(null);

  // Prevent background scrolling and restore smoothly when mobile drawer is open; support Escape key
  useEffect(() => {
    if (mobileMenuOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") setMobileMenuOpen(false);
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [mobileMenuOpen]);

  // Click-outside and Escape key listener for the user account dropdown (especially for mobile touch)
  useEffect(() => {
    if (!userDropdownOpen) return;

    const handleClickOutside = (e) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target)) {
        setUserDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setUserDropdownOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [userDropdownOpen]);

  // Coordinated panel open/close handlers to avoid overlapping popups
  const handleOpenMobileMenu = () => {
    setUserDropdownOpen(false);
    setMobileSearchOpen(false);
    setMobileMenuOpen(true);
  };

  const handleToggleMobileSearch = () => {
    setUserDropdownOpen(false);
    setMobileSearchOpen((prev) => !prev);
  };

  const handleToggleUserDropdown = () => {
    setMobileSearchOpen(false);
    setUserDropdownOpen((prev) => !prev);
  };

  // Live search suggestions
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleCategoryClick = (catName) => {
    setSelectedCategory(catName);
    setCurrentView("catalogue");
    setMobileMenuOpen(false);
  };

  const handleSearchResultClick = (product) => {
    setSearchQuery("");
    setSearchFocused(false);
    setMobileSearchOpen(false);
    if (onSelectProduct) onSelectProduct(product);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-brand-border transition-all shadow-xs">
      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 md:h-20">
          {/* Left: Mobile Menu Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={handleOpenMobileMenu}
              className="p-2 -ml-1 text-brand-forest hover:text-brand-forest-light focus:outline-none focus:ring-1 focus:ring-brand-champagne rounded-xl active:bg-brand-offwhite transition"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center/Left: Integrated Brand Logo */}
          <div className="flex items-center">
            <BrandLogo
              variant="dark"
              size="md"
              showBrandName={true}
              onClick={() => {
                setSelectedCategory("All");
                setCurrentView("home");
              }}
            />
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block flex-1 max-w-md mx-6 relative">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                placeholder="Search Kolhapuri Saaj, Pichodi, Thushi, Kemp..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-brand-offwhite border border-brand-border rounded-full focus:outline-none focus:border-brand-forest focus:bg-white focus:ring-1 focus:ring-brand-forest transition text-brand-dark placeholder-brand-muted"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-xs text-brand-muted hover:text-brand-dark"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Desktop Live Search Suggestions Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-brand-border overflow-hidden z-50 animate-fadeIn">
                <div className="p-2.5 bg-brand-offwhite border-b border-brand-border text-[11px] font-semibold text-brand-forest flex justify-between items-center">
                  <span>Found {searchResults.length} matching jewellery pieces</span>
                  <button
                    onClick={() => {
                      setCurrentView("catalogue");
                      setSearchFocused(false);
                    }}
                    className="text-brand-champagne-dark hover:text-brand-forest font-bold"
                  >
                    View All in Shop →
                  </button>
                </div>
                <div className="divide-y divide-brand-border/40 max-h-72 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full p-2.5 flex items-center space-x-3 hover:bg-brand-offwhite transition text-left"
                    >
                      <SafeImage
                        src={item.images[0]}
                        alt={item.name}
                        category={item.category}
                        className="w-10 h-10 rounded-lg shrink-0 border border-brand-border"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-dark truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-brand-muted">
                          {item.category} • ₹{(item.discountPrice || item.price).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-1 sm:space-x-3">
            {/* Mobile Search Icon */}
            <button
              onClick={handleToggleMobileSearch}
              className="lg:hidden p-2 text-brand-forest hover:text-brand-forest-light rounded-xl active:bg-brand-offwhite transition"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={handleToggleUserDropdown}
                className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl text-brand-forest hover:bg-brand-offwhite transition border border-transparent hover:border-brand-border"
                aria-label="User account menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-forest text-brand-champagne flex items-center justify-center font-bold text-xs border border-brand-champagne/40 shadow-xs">
                  {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-brand-dark max-w-[90px] truncate">
                  {user ? user.name.split(" ")[0] : "Account"}
                </span>
                <ChevronDown className="hidden md:inline-block w-3.5 h-3.5 text-brand-muted" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-brand-border py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-brand-border/60 bg-brand-offwhite">
                        <p className="text-xs font-bold text-brand-forest">{user.name}</p>
                        <p className="text-[11px] text-brand-muted truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-champagne/20 text-brand-forest">
                          Role: {user.role}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-brand-dark hover:bg-brand-offwhite flex items-center space-x-2 transition"
                      >
                        <User className="w-4 h-4 text-brand-forest" />
                        <span>My Profile & Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-brand-dark hover:bg-brand-offwhite flex items-center space-x-2 transition"
                      >
                        <Package className="w-4 h-4 text-brand-forest" />
                        <span>Order History & Tracking</span>
                      </button>

                      <button
                        onClick={() => {
                          if (currentView === "admin") {
                            setCurrentView("home");
                          } else {
                            if (!isAdmin) switchAccount("admin");
                            setCurrentView("admin");
                          }
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-brand-forest font-bold hover:bg-brand-champagne/15 flex items-center space-x-2 transition"
                      >
                        <Shield className="w-4 h-4 text-brand-champagne-dark" />
                        <span>{currentView === "admin" ? "Customer Storefront" : "Admin Panel"}</span>
                      </button>

                      <div className="border-t border-brand-border/60 mt-1 pt-1">
                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2 text-xs text-left text-red-600 hover:bg-red-50 flex items-center space-x-2 transition"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 text-center">
                      <p className="text-xs text-brand-muted mb-3">
                        Sign in for personalized shopping & order tracking
                      </p>
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition shadow-sm"
                      >
                        Sign In / Register
                      </button>
                      <div className="mt-2.5 pt-2 border-t border-brand-border/60">
                        <button
                          onClick={() => {
                            if (!isAdmin) switchAccount("admin");
                            setCurrentView("admin");
                            setUserDropdownOpen(false);
                          }}
                          className="w-full py-1.5 px-2 rounded-lg text-[11px] font-semibold text-brand-forest bg-brand-champagne/20 hover:bg-brand-champagne/30 transition flex items-center justify-center space-x-1.5 border border-brand-champagne/40"
                        >
                          <Shield className="w-3.5 h-3.5 text-brand-champagne-dark" />
                          <span>Admin Portal Demo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Icon Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-brand-forest hover:bg-brand-offwhite transition border border-transparent hover:border-brand-border"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-champagne text-brand-forest text-[10px] sm:text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Input */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3 pt-1 border-t border-brand-border/50 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery, bangles, necklaces..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-brand-offwhite border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-brand-muted p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search suggestions */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-brand-border divide-y divide-brand-border/40 max-h-56 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchResultClick(item)}
                    className="w-full p-2.5 flex items-center space-x-3 hover:bg-brand-offwhite text-left"
                  >
                    <SafeImage
                      src={item.images[0]}
                      alt={item.name}
                      category={item.category}
                      className="w-9 h-9 rounded-lg shrink-0 border border-brand-border"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-brand-dark truncate">{item.name}</p>
                      <p className="text-[10px] text-brand-muted">₹{(item.discountPrice || item.price).toLocaleString("en-IN")}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-2.5 border-t border-brand-border/60 text-xs font-medium tracking-wide">
          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentView("catalogue");
            }}
            className={`transition uppercase tracking-wider ${
              selectedCategory === "All" && currentView === "catalogue"
                ? "text-brand-forest font-bold border-b-2 border-brand-champagne pb-0.5"
                : "text-brand-forest/80 hover:text-brand-forest"
            }`}
          >
            All Jewellery
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.name)}
              className={`transition uppercase tracking-wider ${
                selectedCategory === cat.name && currentView === "catalogue"
                  ? "text-brand-forest font-bold border-b-2 border-brand-champagne pb-0.5"
                  : "text-brand-forest/80 hover:text-brand-forest"
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => onOpenSizeGuide()}
            className="text-brand-forest hover:text-brand-forest-dark flex items-center space-x-1 uppercase tracking-wider font-semibold"
          >
            <Ruler className="w-3.5 h-3.5 text-brand-champagne-dark" />
            <span>Size Guide</span>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer (Portalled to document.body for pristine stacking context & zero backdrop-filter clipping) */}
      {mobileMenuOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[70] flex lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation drawer"
          >
            {/* Full-screen Backdrop */}
            <div
              className="fixed inset-0 bg-brand-dark/70 backdrop-blur-sm transition-opacity animate-fadeIn"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Slide-out Drawer Panel */}
            <div
              className="relative w-[85vw] max-w-[320px] min-w-[270px] bg-white h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col justify-between overflow-hidden animate-slideInLeft z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* 1. STICKY / PINNED DRAWER HEADER (shrink-0: always accessible) */}
              <div className="shrink-0 px-4 py-3 sm:py-3.5 bg-brand-forest text-white flex items-center justify-between border-b border-brand-champagne/40">
                <BrandLogo
                  variant="light"
                  size="sm"
                  showBrandName={true}
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentView("home");
                    setMobileMenuOpen(false);
                  }}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition text-white"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 2. SCROLLABLE MIDDLE NAVIGATION (flex-1: independent smooth scrolling) */}
              <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 py-3 px-3.5 sm:px-4 space-y-3">
                {/* Mobile Quick In-Drawer Search Input */}
                <div className="relative">
                  <Search className="w-4 h-4 text-brand-muted absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setCurrentView("catalogue");
                        setMobileMenuOpen(false);
                      }
                    }}
                    placeholder="Search jewellery, bangles..."
                    className="w-full pl-9 pr-8 py-2 text-xs bg-brand-offwhite border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark placeholder-brand-muted"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-2 text-xs text-brand-muted hover:text-brand-dark p-1"
                      aria-label="Clear search"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Main Views */}
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setCurrentView("home");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      currentView === "home"
                        ? "bg-brand-forest text-white font-bold shadow-xs"
                        : "text-brand-forest hover:bg-brand-offwhite"
                    }`}
                  >
                    <span>Home</span>
                    <span className="text-[10px] text-brand-champagne font-normal">Explore</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory("All");
                      setCurrentView("catalogue");
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition flex items-center justify-between ${
                      currentView === "catalogue" && selectedCategory === "All"
                        ? "bg-brand-forest text-white font-bold shadow-xs"
                        : "text-brand-forest hover:bg-brand-offwhite"
                    }`}
                  >
                    <span>All Jewellery Collection</span>
                    <span className="text-[10px] text-brand-champagne font-normal">Shop All</span>
                  </button>
                </div>

                {/* Categories Divider & List */}
                <div className="pt-2 border-t border-brand-border/60">
                  <div className="pb-1.5 px-3 text-[10px] font-bold uppercase tracking-wider text-brand-champagne-dark">
                    Shop by Royal Category
                  </div>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.name)}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                          currentView === "catalogue" && selectedCategory === cat.name
                            ? "bg-brand-champagne/25 text-brand-forest font-bold border border-brand-champagne/40"
                            : "text-brand-forest/85 hover:bg-brand-offwhite"
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span className="text-[10px] text-brand-muted shrink-0 bg-brand-offwhite px-2 py-0.5 rounded-full border border-brand-border/60">
                          {cat.count}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bangle Measurement Guide Button */}
                <div className="pt-2 border-t border-brand-border/60">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSizeGuide();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-brand-forest flex items-center space-x-2 bg-brand-champagne/15 hover:bg-brand-champagne/25 border border-brand-champagne/40 transition"
                  >
                    <Ruler className="w-4 h-4 text-brand-champagne-dark shrink-0" />
                    <span className="truncate">Bangle Size Guide & Measurements</span>
                  </button>
                </div>
              </div>

              {/* 3. STICKY / PINNED DRAWER FOOTER (shrink-0: docked above home indicators) */}
              <div className="shrink-0 p-3.5 sm:p-4 bg-brand-offwhite border-t border-brand-border space-y-2 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-xs">
                      <div className="w-7 h-7 rounded-full bg-brand-forest text-brand-champagne flex items-center justify-center font-bold text-xs shrink-0 shadow-xs border border-brand-champagne/30">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-brand-forest truncate leading-tight">{user.name}</p>
                        <p className="text-[10px] text-brand-muted truncate">{user.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setCurrentView("profile");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-brand-forest-dark transition flex items-center justify-center space-x-1.5 min-h-[40px]"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>My Account & Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        if (!isAdmin) switchAccount("admin");
                        setCurrentView(currentView === "admin" ? "home" : "admin");
                        setMobileMenuOpen(false);
                      }}
                      className="w-full py-1.5 border border-brand-champagne text-brand-forest font-bold rounded-xl text-xs bg-brand-champagne/20 hover:bg-brand-champagne/30 transition flex items-center justify-center space-x-1.5 min-h-[36px]"
                    >
                      <Shield className="w-3.5 h-3.5 text-brand-champagne-dark" />
                      <span>{currentView === "admin" ? "Customer Storefront" : "Admin Panel"}</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth();
                    }}
                    className="w-full py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold shadow-xs hover:bg-brand-forest-dark transition flex items-center justify-center space-x-1.5 min-h-[44px]"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In / Register</span>
                  </button>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};
