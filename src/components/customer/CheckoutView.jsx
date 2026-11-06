import React, { useState } from "react";
import {
  ShieldCheck,
  CreditCard,
  Banknote,
  MapPin,
  Plus,
  ArrowLeft,
  Lock,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useProducts } from "../../context/ProductContext";
import { SafeImage } from "../common/SafeImage";

export const CheckoutView = ({ onOrderPlaced, onBackToShop, onOpenAuth }) => {
  const { user, addAddress } = useAuth();
  const { items, subtotal, discount, shipping, total, appliedCoupon, clearCart } = useCart();
  const { placeOrder } = useProducts();

  // Address selection state
  const savedAddresses = user?.addresses || [];
  const defaultAddressId = savedAddresses.find((a) => a.isDefault)?.id || savedAddresses[0]?.id;
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddressId || "new");

  // New address form state
  const [showNewAddressForm, setShowNewAddressForm] = useState(savedAddresses.length === 0);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "",
    type: "Home",
  });

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("online"); // 'online' | 'cod'
  const [onlineType, setOnlineType] = useState("upi"); // 'upi' | 'card' | 'netbanking'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-brand-border text-center space-y-4 shadow-xs mx-4 sm:mx-auto">
        <Lock className="w-12 h-12 text-brand-champagne-dark mx-auto" />
        <h3 className="font-serif text-xl font-bold text-brand-forest">
          Authentication Required
        </h3>
        <p className="text-xs text-brand-muted">
          Please sign in or create an account to securely save your delivery address and complete checkout.
        </p>
        <button
          onClick={() => onOpenAuth && onOpenAuth()}
          className="w-full min-h-[44px] py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition shadow-luxury"
        >
          Sign In to Continue
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-brand-border text-center space-y-4 shadow-xs mx-4 sm:mx-auto">
        <Truck className="w-12 h-12 text-brand-champagne-dark mx-auto" />
        <h3 className="font-serif text-xl font-bold text-brand-forest">
          Your Shopping Bag is Empty
        </h3>
        <p className="text-xs text-brand-muted">
          Please select your preferred jewellery items and sizes before proceeding to checkout.
        </p>
        <button
          onClick={onBackToShop}
          className="w-full min-h-[44px] py-2.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition"
        >
          Browse Jewellery Catalogue
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    setError("");

    // Determine delivery address
    let activeAddress = null;
    if (selectedAddressId === "new" || showNewAddressForm) {
      if (!newAddress.fullName || !newAddress.phone || !newAddress.street || !newAddress.pincode) {
        setError("Please complete all required delivery address fields.");
        return;
      }
      activeAddress = addAddress(newAddress);
    } else {
      activeAddress = savedAddresses.find((a) => a.id === selectedAddressId);
    }

    if (!activeAddress) {
      setError("Please select or enter a valid delivery address.");
      return;
    }

    setLoading(true);

    // Simulate payment processing & order creation delay
    setTimeout(() => {
      const orderPayload = {
        userId: user.id,
        customerName: activeAddress.fullName || user.name,
        customerEmail: user.email,
        customerPhone: activeAddress.phone || user.phone,
        items: items.map((i) => ({
          productId: i.productId,
          productName: i.name,
          image: i.image,
          size: i.size,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          totalPrice: i.unitPrice * i.quantity,
        })),
        addressSnapshot: activeAddress,
        subtotal,
        discount,
        shipping,
        total,
        couponApplied: appliedCoupon ? appliedCoupon.code : null,
        paymentMethod, // 'online' | 'cod'
        trackingNumber: `PSS-${Math.floor(100000 + Math.random() * 900000)}`,
        courier: "Blue Dart Express",
      };

      const createdOrder = placeOrder(orderPayload);
      clearCart();
      setLoading(false);

      if (onOrderPlaced) {
        onOrderPlaced(createdOrder);
      }
    }, 650);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 bg-white">
      {/* Back button */}
      <button
        onClick={onBackToShop}
        className="inline-flex items-center space-x-1.5 text-xs text-brand-forest font-semibold hover:underline mb-4 sm:mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Shopping</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Left Column: Address & Payment Selection */}
        <div className="lg:col-span-7 space-y-5">
          {/* Step 1: Delivery Address */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <h2 className="font-serif font-bold text-base sm:text-lg text-brand-forest flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-brand-champagne-dark shrink-0" />
                <span>1. Select Delivery Address</span>
              </h2>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                  className="text-xs font-semibold text-brand-champagne-dark hover:text-brand-forest flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{showNewAddressForm ? "Saved Addresses" : "New Address"}</span>
                </button>
              )}
            </div>

            {/* Existing Saved Addresses */}
            {!showNewAddressForm && savedAddresses.length > 0 && (
              <div className="space-y-2.5">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-3.5 rounded-xl border cursor-pointer transition ${
                      selectedAddressId === addr.id
                        ? "border-brand-forest bg-brand-offwhite ring-1 ring-brand-forest"
                        : "border-brand-border hover:border-brand-champagne bg-white"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        name="address_selector"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                        className="mt-1 text-brand-forest focus:ring-brand-forest"
                      />
                      <div className="text-xs space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-brand-dark text-xs sm:text-sm">
                            {addr.fullName}
                          </span>
                          <span className="bg-brand-offwhite text-brand-muted px-1.5 py-0.2 rounded text-[10px] font-semibold border border-brand-border">
                            {addr.type || "Home"}
                          </span>
                          {addr.isDefault && (
                            <span className="bg-brand-forest text-white text-[9px] font-bold px-1.5 py-0.2 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-brand-dark/80">{addr.street}</p>
                        <p className="text-brand-dark/80">
                          {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                        </p>
                        <p className="text-brand-muted">Phone: {addr.phone}</p>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {/* New Address Form */}
            {(showNewAddressForm || savedAddresses.length === 0) && (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-brand-muted">
                  Enter delivery details for insured shipping:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      Recipient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      placeholder="e.g. Pooja Deshmukh"
                      className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      Phone Number (for Courier & OTP) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      placeholder="+91 98234 56789"
                      className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                    Street Address, Flat / House No., Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    placeholder="e.g. Flat 402, Royal Palms, Prabhat Road"
                    className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-brand-dark mb-1">
                      PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="411004"
                      className="w-full p-2.5 text-xs sm:text-sm border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Payment Method */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-base sm:text-lg text-brand-forest flex items-center space-x-2 border-b border-brand-border pb-3">
              <CreditCard className="w-5 h-5 text-brand-champagne-dark shrink-0" />
              <span>2. Select Payment Option</span>
            </h2>

            <div className="space-y-3">
              {/* Option A: Online Payment */}
              <label
                className={`block p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "online"
                    ? "border-brand-forest bg-brand-offwhite ring-1 ring-brand-forest"
                    : "border-brand-border hover:border-brand-champagne bg-white"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "online"}
                    onChange={() => setPaymentMethod("online")}
                    className="mt-1 text-brand-forest focus:ring-brand-forest"
                  />
                  <div className="flex-1 text-xs space-y-2">
                    <div className="flex items-center justify-between flex-wrap gap-1">
                      <span className="font-bold text-brand-dark text-xs sm:text-sm flex items-center space-x-2">
                        <span>Online Payment (UPI, Cards, NetBanking)</span>
                        <span className="bg-brand-champagne/25 text-brand-forest border border-brand-champagne/40 text-[9px] font-bold px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </span>
                      <ShieldCheck className="w-4 h-4 text-brand-champagne-dark shrink-0" />
                    </div>
                    <p className="text-brand-muted">
                      Instant payment verification & priority dispatch from our Pune studio.
                    </p>

                    {/* Online Sub-options */}
                    {paymentMethod === "online" && (
                      <div className="pt-2 border-t border-brand-border flex flex-wrap gap-1.5 sm:gap-2">
                        <button
                          type="button"
                          onClick={() => setOnlineType("upi")}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            onlineType === "upi"
                              ? "bg-brand-forest text-white border-brand-forest"
                              : "bg-white text-brand-dark border-brand-border"
                          }`}
                        >
                          Google Pay / PhonePe UPI
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType("card")}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            onlineType === "card"
                              ? "bg-brand-forest text-white border-brand-forest"
                              : "bg-white text-brand-dark border-brand-border"
                          }`}
                        >
                          Debit / Credit Card
                        </button>
                        <button
                          type="button"
                          onClick={() => setOnlineType("netbanking")}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition ${
                            onlineType === "netbanking"
                              ? "bg-brand-forest text-white border-brand-forest"
                              : "bg-white text-brand-dark border-brand-border"
                          }`}
                        >
                          Net Banking
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </label>

              {/* Option B: Cash on Delivery */}
              <label
                className={`block p-3.5 sm:p-4 rounded-xl border cursor-pointer transition ${
                  paymentMethod === "cod"
                    ? "border-brand-forest bg-brand-offwhite ring-1 ring-brand-forest"
                    : "border-brand-border hover:border-brand-champagne bg-white"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <input
                    type="radio"
                    name="payment_method"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="mt-1 text-brand-forest focus:ring-brand-forest"
                  />
                  <div className="flex-1 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-brand-dark text-xs sm:text-sm flex items-center space-x-1.5">
                        <Banknote className="w-4 h-4 text-brand-forest" />
                        <span>Cash on Delivery (COD)</span>
                      </span>
                    </div>
                    <p className="text-brand-muted">
                      Pay cash or UPI to courier representative upon inspection and delivery.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order CTA */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-brand-border shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base sm:text-lg text-brand-forest border-b border-brand-border pb-3">
              Order Summary ({items.length} items)
            </h3>

            {/* Items preview list */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 divide-y divide-brand-border/40">
              {items.map((item) => (
                <div
                  key={`${item.productId}_${item.size}`}
                  className="flex items-center space-x-3 pt-2 text-xs"
                >
                  <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-brand-border">
                    <SafeImage
                      src={item.image}
                      alt={item.name}
                      category={item.category || "Jewellery"}
                      aspectRatio="aspect-square"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-brand-dark truncate">{item.name}</p>
                    <p className="text-[10px] text-brand-muted">
                      Size: <span className="font-bold text-brand-forest">{item.size}</span> | Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-bold text-brand-dark font-poppins shrink-0">
                    ₹{(item.unitPrice * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="pt-3 border-t border-brand-border space-y-1.5 text-xs text-brand-dark">
              <div className="flex justify-between">
                <span className="text-brand-muted">Subtotal</span>
                <span>₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-champagne-dark font-semibold">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span>- ₹{discount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-brand-muted">Shipping</span>
                <span>{shipping === 0 ? <strong className="text-brand-forest font-bold">FREE</strong> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-bold text-brand-forest pt-2 border-t border-brand-border">
                <span>Total Payable</span>
                <span className="font-poppins">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full min-h-[46px] py-3 rounded-xl bg-brand-forest hover:bg-brand-forest-dark text-white font-bold text-xs sm:text-sm tracking-wide transition shadow-luxury flex items-center justify-center space-x-2"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Your Order...</span>
                </div>
              ) : (
                <span>
                  Place Order • ₹{total.toLocaleString("en-IN")}
                </span>
              )}
            </button>

            <div className="text-center pt-1 text-[11px] text-brand-muted flex items-center justify-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-brand-champagne-dark" />
              <span>256-Bit Encrypted Simulated Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
