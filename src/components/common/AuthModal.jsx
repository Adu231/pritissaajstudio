import React, { useState } from "react";
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-brand-charcoal/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-brand-sage-light max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-brand-emerald text-white p-5 sm:p-6 relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-brand-sage-light hover:text-white p-1 rounded-full hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col items-center">
            <BrandLogo variant="light" size="md" />
            <h3 className="font-serif text-xl sm:text-2xl font-bold mt-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h3>
            <p className="text-xs text-brand-sage-light mt-1">
              {isLogin
                ? "Sign in to track orders, manage addresses & checkout faster."
                : "Join our exclusive circle for handcrafted jewellery."}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-brand-charcoal mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Pooja Deshmukh"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-brand-charcoal mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-medium text-brand-charcoal mb-1">
                  Mobile Number (for delivery updates)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98234 56789"
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-brand-charcoal mb-1">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-brand-sage-light rounded-xl focus:outline-none focus:border-brand-emerald focus:ring-1 focus:ring-brand-emerald"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-brand-emerald text-white text-sm font-semibold hover:bg-brand-emerald-light transition shadow-luxury flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>{isLogin ? "Sign In" : "Create Account"}</span>
              )}
            </button>
          </form>

          {/* Switch Login / Register */}
          <div className="mt-4 text-center text-xs text-brand-charcoal-light">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setError("");
                  }}
                  className="text-brand-emerald font-semibold hover:underline"
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
                  className="text-brand-emerald font-semibold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>

          {/* Quick Demo Logins Box */}
          <div className="mt-6 pt-5 border-t border-brand-sage-light/60">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-brand-charcoal-muted text-center mb-2.5">
              ⚡ Instant Prototype Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemo("customer")}
                className="p-2 text-xs rounded-lg border border-brand-sage bg-brand-sage/10 hover:bg-brand-sage/20 text-brand-emerald font-medium transition text-left flex items-center space-x-1.5"
              >
                <User className="w-3.5 h-3.5 text-brand-emerald shrink-0" />
                <span className="truncate">Customer: Pooja</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemo("admin")}
                className="p-2 text-xs rounded-lg border border-brand-gold bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-emerald font-medium transition text-left flex items-center space-x-1.5"
              >
                <CheckCircle className="w-3.5 h-3.5 text-brand-gold-dark shrink-0" />
                <span className="truncate">Admin: Priti</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

