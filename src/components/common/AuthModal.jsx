import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Lock, Mail, User, Phone, CheckCircle, ShieldAlert } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { BrandLogo } from "./BrandLogo";

export const AuthModal = ({ isOpen, onClose, defaultMode = "login", onSuccess }) => {
  const { login, register, switchAccount } = useAuth();
  const [isLogin, setIsLogin] = useState(defaultMode === "login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Lock body scroll and restore smoothly; close on Escape key
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
      };
      window.addEventListener("keydown", handleKeyDown);

      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (isLogin) {
        const res = login(formData.email, formData.password);
        if (res.success) {
          setLoading(false);
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setError(res.message);
          setLoading(false);
        }
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          setError("Please fill in all mandatory fields.");
          setLoading(false);
          return;
        }
        const res = register(formData);
        if (res.success) {
          setLoading(false);
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setError(res.message);
          setLoading(false);
        }
      }
    }, 350);
  };

  const handleQuickDemo = (role) => {
    switchAccount(role);
    if (onSuccess) onSuccess();
    onClose();
  };

  return typeof document !== "undefined"
    ? createPortal(
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-brand-dark/70 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label="Account Authentication"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-brand-border max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-brand-forest text-white p-5 sm:p-6 relative text-center border-b border-brand-champagne/30">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-brand-champagne-light hover:text-white w-10 h-10 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>
          <div className="flex flex-col items-center">
            <BrandLogo variant="light" size="md" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-2 text-white">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-xs text-brand-champagne-light mt-1">
              {isLogin
                ? "Sign in to track orders, manage addresses & checkout faster."
                : "Join our exclusive circle for handcrafted jewellery."}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 bg-white">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pooja Deshmukh"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-white text-brand-dark"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-white text-brand-dark"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-brand-dark mb-1">
                  Mobile Number (for delivery updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98234 56789"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-white text-brand-dark"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-brand-muted absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest focus:ring-1 focus:ring-brand-forest bg-white text-brand-dark"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-forest text-white text-sm font-semibold hover:bg-brand-forest-dark transition shadow-luxury flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          {/* Switch Login / Register */}
          <div className="mt-4 text-center text-xs text-brand-muted">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-brand-forest font-semibold hover:underline"
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setError("");
                  }}
                  className="text-brand-forest font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins Box */}
          <div className="mt-6 pt-5 border-t border-brand-border">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-muted text-center mb-2.5">
              ⚡ Instant Prototype Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("customer")}
                className="p-2 text-xs rounded-xl border border-brand-border bg-brand-offwhite hover:bg-white text-brand-forest font-medium transition text-left flex items-center space-x-1.5 shadow-xs"
              >
                <User className="w-3.5 h-3.5 text-brand-forest shrink-0" />
                <span className="truncate">Customer: Pooja</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="p-2 text-xs rounded-xl border border-brand-champagne bg-brand-champagne/15 hover:bg-brand-champagne/25 text-brand-forest font-medium transition text-left flex items-center space-x-1.5 shadow-xs"
              >
                <CheckCircle className="w-3.5 h-3.5 text-brand-champagne-dark shrink-0" />
                <span className="truncate">Admin: Priti</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;
};
