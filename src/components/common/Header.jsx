import React, { useState } from "react";
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
  Sparkles,
  Package,
  Heart,
  SlidersHorizontal,
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-sage-light/60 transition-all shadow-sm">
      {/* Top Announcement Bar */}
      <div className="bg-brand-emerald text-brand-ivory text-[10px] sm:text-xs py-1.5 px-3 sm:px-6 font-medium flex items-center justify-between border-b border-brand-gold/30">
        <div className="flex items-center space-x-1.5 mx-auto sm:mx-0 truncate">
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-brand-gold shrink-0 animate-pulse" />
          <span className="truncate">
            Complimentary Luxury Velvet Pouch & Free Delivery on ₹1,499+
          </span>
        </div>

        {/* Desktop Quick Shortcuts */}
        <div className="hidden md:flex items-center space-x-3 text-[11px] shrink-0">
          <button
            onClick={() => onOpenSizeGuide()}
            className="hover:text-brand-gold flex items-center space-x-1 text-brand-sage-light transition"
          >
            <Ruler className="w-3 h-3 text-brand-gold" />
            <span>Bangle Size Guide</span>
          </button>
          <span className="text-brand-emerald-light">|</span>
          <button
            onClick={() => {
              if (currentView === "admin") {
                setCurrentView("home");
              } else {
                if (!isAdmin) switchAccount("admin");
                setCurrentView("admin");
              }
            }}
            className={`px-2 py-0.5 rounded text-[11px] font-semibold transition flex items-center space-x-1 ${
              currentView === "admin"
                ? "bg-brand-gold text-brand-emerald hover:bg-brand-gold-light"
                : "bg-brand-emerald-light text-brand-ivory hover:bg-brand-sage/20 border border-brand-sage/30"
            }`}
          >
            <Shield className="w-3 h-3" />
            <span>{currentView === "admin" ? "Exit Admin" : "Admin Portal"}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-18 md:h-20">
          {/* Left: Mobile Menu Hamburger Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-1 text-brand-emerald hover:text-brand-emerald-light focus:outline-none focus:ring-1 focus:ring-brand-gold rounded-lg"
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
              <Search className="w-4 h-4 text-brand-charcoal-muted absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 250)}
                placeholder="Search Kolhapuri Saaj, Pichodi, Thushi, Kemp..."
                className="w-full pl-10 pr-8 py-2 text-xs sm:text-sm bg-brand-ivory border border-brand-sage-light rounded-full focus:outline-none focus:border-brand-emerald focus:bg-white focus:ring-1 focus:ring-brand-emerald transition shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-2.5 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Desktop Live Search Suggestions Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-brand-sage-light overflow-hidden z-50 animate-fadeIn">
                <div className="p-2.5 bg-brand-ivory border-b border-brand-sage-light text-[11px] font-semibold text-brand-emerald flex justify-between items-center">
                  <span>Found {searchResults.length} matching jewellery pieces</span>
                  <button
                    onClick={() => {
                      setCurrentView("catalogue");
                      setSearchFocused(false);
                    }}
                    className="text-brand-gold-dark hover:underline font-bold"
                  >
                    View All in Shop →
                  </button>
                </div>
                <div className="divide-y divide-gray-100 max-h-72 overflow-y-auto">
                  {searchResults.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleSearchResultClick(item)}
                      className="w-full p-2.5 flex items-center space-x-3 hover:bg-brand-sage-light/20 transition text-left"
                    >
                      <SafeImage
                        src={item.images[0]}
                        alt={item.name}
                        category={item.category}
                        className="w-10 h-10 rounded-lg shrink-0 border border-brand-sage-light"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-brand-charcoal truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-brand-charcoal-muted">
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
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
              className="lg:hidden p-2 text-brand-emerald hover:text-brand-emerald-light rounded-lg"
              aria-label="Toggle mobile search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Account Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-1.5 p-1.5 sm:px-3 sm:py-1.5 rounded-full sm:rounded-xl text-brand-emerald hover:bg-brand-sage/15 transition border border-transparent hover:border-brand-sage-light"
                aria-label="User account menu"
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-emerald text-brand-gold flex items-center justify-center font-bold text-xs border border-brand-gold/40 shadow-sm">
                  {user ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4 text-white" />}
                </div>
                <span className="hidden md:inline-block text-xs font-semibold text-brand-charcoal max-w-[90px] truncate">
                  {user ? user.name.split(" ")[0] : "Account"}
                </span>
                <ChevronDown className="hidden md:inline-block w-3.5 h-3.5 text-gray-400" />
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-brand-sage-light py-2 z-50 animate-fadeIn"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-brand-sage-light/50 bg-brand-ivory/60">
                        <p className="text-xs font-bold text-brand-emerald">{user.name}</p>
                        <p className="text-[11px] text-brand-charcoal-muted truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-gold/15 text-brand-charcoal">
                          Role: {user.role}
                        </span>
                      </div>

                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-brand-charcoal hover:bg-brand-sage-light/20 flex items-center space-x-2 transition"
                      >
                        <User className="w-4 h-4 text-brand-emerald" />
                        <span>My Profile & Addresses</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentView("profile");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full px-4 py-2 text-xs text-left text-brand-charcoal hover:bg-brand-sage-light/20 flex items-center space-x-2 transition"
                      >
                        <Package className="w-4 h-4 text-brand-emerald" />
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
                        className="w-full px-4 py-2 text-xs text-left text-brand-emerald font-bold hover:bg-brand-gold/15 flex items-center space-x-2 transition"
                      >
                        <Shield className="w-4 h-4 text-brand-gold-dark" />
                        <span>{currentView === "admin" ? "Customer Storefront" : "Admin Panel"}</span>
                      </button>

                      <div className="border-t border-brand-sage-light/50 mt-1 pt-1">
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
                      <p className="text-xs text-brand-charcoal mb-3">
                        Sign in for personalized shopping & order tracking
                      </p>
                      <button
                        onClick={() => {
                          onOpenAuth();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition shadow-sm"
                      >
                        Sign In / Register
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Shopping Bag Icon Button */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-brand-emerald hover:bg-brand-sage/15 transition border border-transparent hover:border-brand-sage-light"
              aria-label="View shopping bag"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-gold text-brand-charcoal text-[10px] sm:text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Input */}
        {mobileSearchOpen && (
          <div className="lg:hidden pb-3 pt-1 border-t border-brand-sage-light/40 animate-fadeIn">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search jewellery, bangles, necklaces..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-brand-ivory border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-gray-400 p-1"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile search suggestions */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-white rounded-xl shadow-lg border border-brand-sage-light divide-y divide-gray-100 max-h-56 overflow-y-auto">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSearchResultClick(item)}
                    className="w-full p-2.5 flex items-center space-x-3 hover:bg-brand-sage-light/20 text-left"
                  >
                    <SafeImage
                      src={item.images[0]}
                      alt={item.name}
                      category={item.category}
                      className="w-9 h-9 rounded-lg shrink-0 border border-brand-sage-light"
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-brand-charcoal truncate">{item.name}</p>
                      <p className="text-[10px] text-gray-500">₹{(item.discountPrice || item.price).toLocaleString("en-IN")}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Desktop Category Navigation */}
        <nav className="hidden lg:flex items-center justify-center space-x-8 py-2.5 border-t border-brand-sage-light/40 text-xs font-medium tracking-wide">
          <button
            onClick={() => {
              setSelectedCategory("All");
              setCurrentView("catalogue");
            }}
            className={`transition uppercase tracking-wider ${
              selectedCategory === "All" && currentView === "catalogue"
                ? "text-brand-emerald font-bold border-b-2 border-brand-gold pb-0.5"
                : "text-brand-charcoal hover:text-brand-emerald"
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
                  ? "text-brand-emerald font-bold border-b-2 border-brand-gold pb-0.5"
                  : "text-brand-charcoal hover:text-brand-emerald"
              }`}
            >
              {cat.name}
            </button>
          ))}

          <button
            onClick={() => onOpenSizeGuide()}
            className="text-brand-gold-dark hover:text-brand-emerald flex items-center space-x-1 uppercase tracking-wider font-bold"
          >
            <Ruler className="w-3.5 h-3.5 text-brand-gold" />
            <span>Size Guide</span>
          </button>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-brand-charcoal/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-slideInLeft">
            <div>
              {/* Drawer Brand Header */}
              <div className="p-4 bg-brand-emerald text-white flex items-center justify-between border-b border-brand-gold/40">
                <BrandLogo
                  variant="light"
                  size="sm"
                  showBrandName={true}
                  onClick={() => setMobileMenuOpen(false)}
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/10 text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="p-4 space-y-1">
                <button
                  onClick={() => {
                    setCurrentView("home");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    currentView === "home" ? "bg-brand-emerald text-white font-bold" : "text-brand-charcoal hover:bg-brand-sage-light/30"
                  }`}
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    setSelectedCategory("All");
                    setCurrentView("catalogue");
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                    currentView === "catalogue" && selectedCategory === "All"
                      ? "bg-brand-emerald text-white font-bold"
                      : "text-brand-charcoal hover:bg-brand-sage-light/30"
                  }`}
                >
                  All Jewellery Catalogue
                </button>

                <div className="pt-3 pb-1 px-3 text-[10px] font-bold uppercase tracking-wider text-brand-gold-dark">
                  Shop by Category
                </div>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                      currentView === "catalogue" && selectedCategory === cat.name
                        ? "bg-brand-sage-light/40 text-brand-emerald font-bold"
                        : "text-brand-charcoal-light hover:bg-brand-sage-light/20"
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[10px] text-gray-400">{cat.count}</span>
                  </button>
                ))}

                <div className="pt-3 border-t border-brand-sage-light/50">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSizeGuide();
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-brand-emerald flex items-center space-x-2 bg-brand-gold/15 border border-brand-gold/30"
                  >
                    <Ruler className="w-4 h-4 text-brand-gold-dark" />
                    <span>Bangle Size Guide & Measurements</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Drawer Account / Role Footer */}
            <div className="p-4 bg-brand-ivory border-t border-brand-sage-light space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="text-xs">
                    <p className="font-bold text-brand-emerald">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentView("profile");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold shadow-sm"
                  >
                    My Account & Orders
                  </button>
                  <button
                    onClick={() => {
                      if (!isAdmin) switchAccount("admin");
                      setCurrentView(currentView === "admin" ? "home" : "admin");
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-1.5 border border-brand-gold text-brand-emerald font-bold rounded-xl text-xs bg-brand-gold/10"
                  >
                    {currentView === "admin" ? "Customer Storefront" : "Admin Panel"}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full py-2.5 bg-brand-emerald text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
