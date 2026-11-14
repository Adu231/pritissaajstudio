import React, { useState } from "react";
import { Header } from "./components/common/Header";
import { Footer } from "./components/common/Footer";
import { MobileBottomNav } from "./components/common/MobileBottomNav";
import { SizeGuideModal } from "./components/common/SizeGuideModal";
import { AuthModal } from "./components/common/AuthModal";
import { CartDrawer } from "./components/customer/CartDrawer";
import { ProductDetailModal } from "./components/customer/ProductDetailModal";
import { HomeView } from "./components/customer/HomeView";
import { CatalogueView } from "./components/customer/CatalogueView";
import { CheckoutView } from "./components/customer/CheckoutView";
import { OrderConfirmationView } from "./components/customer/OrderConfirmationView";
import { ProfileView } from "./components/customer/ProfileView";
import { AdminPortal } from "./components/admin/AdminPortal";
import { FloatingWhatsAppButton } from "./components/common/WhatsAppButton";
import { useAuth } from "./context/AuthContext";
import { useProducts } from "./context/ProductContext";

export function App() {
  const { user, isAdmin } = useAuth();
  const { products } = useProducts();

  // Navigation state: 'home' | 'catalogue' | 'checkout' | 'confirmation' | 'profile' | 'admin'
  const [currentView, setCurrentView] = useState("home");

  // Active product for detail modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Active confirmed order for confirmation / tracking view
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  // Modals
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [sizeGuideSelectedSize, setSizeGuideSelectedSize] = useState("");
  const [sizeGuideCallback, setSizeGuideCallback] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authSuccessCallback, setAuthSuccessCallback] = useState(null);

  const handleOpenSizeGuide = (currentSize = "", onSelect = null) => {
    setSizeGuideSelectedSize(currentSize);
    setSizeGuideCallback(() => onSelect);
    setSizeGuideOpen(true);
  };

  const handleOpenAuth = (onSuccess = null) => {
    setAuthSuccessCallback(() => onSuccess);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    if (authSuccessCallback) {
      authSuccessCallback();
      setAuthSuccessCallback(null);
    }
  };

  const handleOrderPlaced = (newOrder) => {
    setConfirmedOrder(newOrder);
    setCurrentView("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewOrderDetails = (order) => {
    setConfirmedOrder(order);
    setCurrentView("confirmation");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // If in Admin Mode, render the dedicated Admin Portal
  if (currentView === "admin") {
    return (
      <AdminPortal
        onExitAdmin={() => {
          setCurrentView("home");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-brand-dark selection:bg-brand-champagne/40 selection:text-brand-forest">
      {/* 1. Header */}
      <Header
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenSizeGuide={handleOpenSizeGuide}
        onOpenAuth={handleOpenAuth}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
      />

      {/* 2. Main Content View */}
      <main className="flex-1 pb-16 lg:pb-0 min-w-0">
        {currentView === "home" && (
          <HomeView
            setCurrentView={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onOpenSizeGuide={handleOpenSizeGuide}
          />
        )}

        {currentView === "catalogue" && (
          <CatalogueView
            onSelectProduct={(prod) => setSelectedProduct(prod)}
            onOpenSizeGuide={handleOpenSizeGuide}
          />
        )}

        {currentView === "checkout" && (
          <CheckoutView
            onOrderPlaced={handleOrderPlaced}
            onBackToShop={() => {
              setCurrentView("catalogue");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenAuth={handleOpenAuth}
          />
        )}

        {currentView === "confirmation" && (
          <OrderConfirmationView
            order={confirmedOrder}
            onContinueShopping={() => {
              setCurrentView("catalogue");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onViewProfile={() => {
              setCurrentView("profile");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {currentView === "profile" && (
          <ProfileView
            onViewOrderDetails={handleViewOrderDetails}
            onSelectProduct={(prod) => setSelectedProduct(prod)}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenSizeGuide={handleOpenSizeGuide}
      />

      {/* 4. Mobile Bottom Navigation */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenSizeGuide={handleOpenSizeGuide}
        onOpenAuth={handleOpenAuth}
      />

      {/* Floating WhatsApp Concierge Button */}
      {currentView !== "admin" && <FloatingWhatsAppButton />}

      {/* 5. Modals & Drawers */}
      {/* Bangle Size Guide Modal */}
      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        selectedSize={sizeGuideSelectedSize}
        onSelectSize={sizeGuideCallback}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => {
          setCurrentView("checkout");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onOpenAuth={handleOpenAuth}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        products={products}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenSizeGuide={handleOpenSizeGuide}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          onProceedToCheckout={() => {
            setSelectedProduct(null);
            setCurrentView("checkout");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          onOpenAuth={handleOpenAuth}
        />
      )}
    </div>
  );
}

