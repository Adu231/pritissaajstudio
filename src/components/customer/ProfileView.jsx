import React, { useState } from "react";
import {
  User,
  Package,
  MapPin,
  Plus,
  Trash2,
  Truck,
  Edit2,
  Star,
  CheckCircle2,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { SafeImage } from "../common/SafeImage";

export const ProfileView = ({ onViewOrderDetails, onSelectProduct }) => {
  const {
    user,
    updateProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useAuth();
  const { orders, submitReview } = useProducts();

  const [activeTab, setActiveTab] = useState("orders"); // 'orders' | 'addresses' | 'profile'

  // Profile Edit State
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [newPassword, setNewPassword] = useState("");
  const [profileMsg, setProfileMsg] = useState("");

  // Address Modal/Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "Pune",
    state: "Maharashtra",
    pincode: "",
    type: "Home",
    isDefault: false,
  });

  // Review Modal State
  const [reviewModalProduct, setReviewModalProduct] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white rounded-3xl border border-brand-border text-center space-y-4 shadow-xs mx-4 sm:mx-auto">
        <User className="w-12 h-12 text-brand-champagne-dark mx-auto" />
        <h3 className="font-serif text-xl font-bold text-brand-forest">
          Account Not Signed In
        </h3>
        <p className="text-xs text-brand-muted">
          Please sign in to access your profile, saved addresses, and order tracking.
        </p>
      </div>
    );
  }

  // Filter orders for current user
  const userOrders = orders.filter((o) => o.userId === user.id);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const res = updateProfile(name, phone, newPassword);
    if (res.success) {
      setProfileMsg("Profile updated successfully!");
      setNewPassword("");
      setTimeout(() => setProfileMsg(""), 3000);
    }
  };

  const handleOpenAddAddress = () => {
    setEditingAddressId(null);
    setAddressForm({
      fullName: user.name,
      phone: user.phone,
      street: "",
      city: "Pune",
      state: "Maharashtra",
      pincode: "",
      type: "Home",
      isDefault: false,
    });
    setShowAddressForm(true);
  };

  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddressForm({ ...addr });
    setShowAddressForm(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress(editingAddressId, addressForm);
    } else {
      addAddress(addressForm);
    }
    setShowAddressForm(false);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!reviewModalProduct || !reviewComment.trim()) return;

    submitReview({
      productId: reviewModalProduct.productId || reviewModalProduct.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      comment: reviewComment.trim(),
    });

    setReviewSuccess(true);
    setTimeout(() => {
      setReviewSuccess(false);
      setReviewModalProduct(null);
      setReviewComment("");
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 bg-white">
      {/* Header Profile Summary */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-brand-border shadow-xs flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 mb-6 sm:mb-8">
        <div className="flex items-center space-x-3.5 w-full sm:w-auto">
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-brand-forest text-brand-champagne flex items-center justify-center font-serif text-2xl sm:text-3xl font-bold shadow-xs shrink-0 border border-brand-champagne/40">
            {user.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-serif text-lg sm:text-2xl font-bold text-brand-forest truncate">
              {user.name}
            </h1>
            <p className="text-xs text-brand-muted truncate">{user.email}</p>
            <p className="text-xs text-brand-muted">{user.phone}</p>
            <span className="inline-block mt-1 text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider bg-brand-champagne/20 text-brand-forest border border-brand-champagne/40">
              Account Role: {user.role}
            </span>
          </div>
        </div>

        {/* Quick Order Stats */}
        <div className="flex space-x-3 text-center w-full sm:w-auto justify-center sm:justify-start">
          <div className="bg-brand-offwhite p-2.5 sm:p-3 rounded-2xl border border-brand-border min-w-[85px] sm:min-w-[95px]">
            <span className="block text-lg sm:text-xl font-bold text-brand-forest font-poppins">
              {userOrders.length}
            </span>
            <span className="text-[10px] text-brand-muted uppercase font-semibold">
              Total Orders
            </span>
          </div>
          <div className="bg-brand-offwhite p-2.5 sm:p-3 rounded-2xl border border-brand-border min-w-[85px] sm:min-w-[95px]">
            <span className="block text-lg sm:text-xl font-bold text-brand-forest font-poppins">
              {user.addresses?.length || 0}
            </span>
            <span className="text-[10px] text-brand-muted uppercase font-semibold">
              Addresses
            </span>
          </div>
        </div>
      </div>

      {/* Responsive Horizontal Scrollable Tabs */}
      <div className="flex border-b border-brand-border space-x-4 sm:space-x-6 text-xs sm:text-sm font-semibold mb-6 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab("orders")}
          className={`pb-3 flex items-center space-x-1.5 whitespace-nowrap transition ${
            activeTab === "orders"
              ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
              : "text-brand-muted hover:text-brand-forest"
          }`}
        >
          <Package className="w-4 h-4 text-brand-champagne-dark shrink-0" />
          <span>My Orders & Tracking ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("addresses")}
          className={`pb-3 flex items-center space-x-1.5 whitespace-nowrap transition ${
            activeTab === "addresses"
              ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
              : "text-brand-muted hover:text-brand-forest"
          }`}
        >
          <MapPin className="w-4 h-4 text-brand-champagne-dark shrink-0" />
          <span>Saved Addresses ({user.addresses?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab("profile")}
          className={`pb-3 flex items-center space-x-1.5 whitespace-nowrap transition ${
            activeTab === "profile"
              ? "text-brand-forest border-b-2 border-brand-champagne font-bold"
              : "text-brand-muted hover:text-brand-forest"
          }`}
        >
          <User className="w-4 h-4 text-brand-champagne-dark shrink-0" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {userOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-brand-border p-8 sm:p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-brand-champagne-dark mx-auto" />
              <h3 className="font-serif text-base font-bold text-brand-forest">
                No orders placed yet
              </h3>
              <p className="text-xs text-brand-muted max-w-sm mx-auto">
                Once you order handcrafted jewellery, you can track real-time delivery status here.
              </p>
            </div>
          ) : (
            userOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-brand-border shadow-xs p-4 sm:p-5 space-y-3 sm:space-y-4"
              >
                {/* Order Top Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-border pb-2.5 text-xs">
                  <div>
                    <span className="text-brand-muted">Order ID: </span>
                    <strong className="text-brand-dark font-poppins">{order.orderNumber}</strong>
                    <span className="text-brand-muted ml-2">
                      • {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      order.orderStatus === "Delivered"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                        : order.orderStatus === "Shipped" || order.orderStatus === "Out for Delivery"
                        ? "bg-brand-champagne/20 text-brand-forest border-brand-champagne/40"
                        : order.orderStatus === "Cancelled"
                        ? "bg-red-50 text-red-800 border-red-200"
                        : "bg-brand-offwhite text-brand-forest border-brand-border"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Items in this Order */}
                <div className="space-y-2.5 divide-y divide-brand-border/40">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="pt-2 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-brand-border">
                          <SafeImage
                            src={item.image}
                            alt={item.productName}
                            category="Jewellery"
                            aspectRatio="aspect-square"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-brand-dark truncate">{item.productName}</p>
                          <p className="text-[11px] text-brand-muted">
                            Size: <strong className="text-brand-forest">{item.size}</strong> • Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        <span className="font-bold text-brand-dark font-poppins">
                          ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                        </span>

                        {order.orderStatus === "Delivered" && (
                          <button
                            onClick={() => setReviewModalProduct(item)}
                            className="px-2.5 py-1 bg-brand-champagne/20 hover:bg-brand-champagne/30 text-brand-forest font-bold rounded-lg text-[10px] flex items-center space-x-1 border border-brand-champagne/40"
                          >
                            <Star className="w-3 h-3 text-brand-champagne-dark" />
                            <span>Review</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Footer & Actions */}
                <div className="pt-2.5 border-t border-brand-border flex flex-wrap items-center justify-between gap-2.5 text-xs">
                  <div>
                    <span className="text-brand-muted">Total: </span>
                    <strong className="text-sm font-bold text-brand-forest font-poppins">
                      ₹{order.total?.toLocaleString("en-IN")}
                    </strong>
                    <span className="text-[10px] text-brand-muted ml-1">
                      ({order.paymentMethod.toUpperCase()} • {order.paymentStatus})
                    </span>
                  </div>

                  <button
                    onClick={() => onViewOrderDetails && onViewOrderDetails(order)}
                    className="min-h-[36px] px-3.5 py-1.5 bg-brand-forest hover:bg-brand-forest-dark text-white font-semibold rounded-xl text-xs flex items-center space-x-1.5 transition shadow-xs"
                  >
                    <Truck className="w-3.5 h-3.5 text-brand-champagne" />
                    <span>Track Order Progress</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Saved Addresses */}
      {activeTab === "addresses" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif font-bold text-base text-brand-forest">
              Your Delivery Addresses
            </h3>
            <button
              onClick={handleOpenAddAddress}
              className="min-h-[36px] px-3.5 py-1.5 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {user.addresses?.map((addr) => (
              <div
                key={addr.id}
                className={`p-4 rounded-2xl border bg-white space-y-2 relative ${
                  addr.isDefault ? "border-brand-forest ring-1 ring-brand-forest" : "border-brand-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-brand-dark text-xs sm:text-sm">{addr.fullName}</span>
                    <span className="text-[10px] bg-brand-offwhite text-brand-dark px-2 py-0.5 rounded border border-brand-border">
                      {addr.type || "Home"}
                    </span>
                    {addr.isDefault && (
                      <span className="text-[9px] bg-brand-forest text-white font-bold px-1.5 py-0.2 rounded">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEditAddress(addr)}
                      className="text-brand-muted hover:text-brand-forest p-1.5 rounded-lg"
                      title="Edit address"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="text-brand-muted hover:text-red-600 p-1.5 rounded-lg"
                      title="Delete address"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-brand-dark/80">{addr.street}</p>
                <p className="text-xs text-brand-dark/80">
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </p>
                <p className="text-xs text-brand-muted">Phone: {addr.phone}</p>

                {!addr.isDefault && (
                  <button
                    onClick={() => setDefaultAddress(addr.id)}
                    className="text-xs text-brand-champagne-dark hover:underline font-bold pt-1 block"
                  >
                    Set as Default Delivery Address
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Address Modal */}
          {showAddressForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-brand-border pb-2">
                  <h3 className="font-serif font-bold text-base text-brand-forest">
                    {editingAddressId ? "Edit Address" : "Add Delivery Address"}
                  </h3>
                  <button onClick={() => setShowAddressForm(false)}>
                    <X className="w-5 h-5 text-brand-dark" />
                  </button>
                </div>

                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1 text-brand-dark">Full Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-brand-dark">Mobile Phone</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-brand-dark">Street / House / Landmark</label>
                    <input
                      type="text"
                      required
                      value={addressForm.street}
                      onChange={(e) => setAddressForm({ ...addressForm, street: e.target.value })}
                      className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold mb-1 text-brand-dark">City</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-brand-dark">State</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-brand-dark">PIN Code</label>
                      <input
                        type="text"
                        required
                        value={addressForm.pincode}
                        onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                        className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Account & Password Settings */}
      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl border border-brand-border p-5 sm:p-6 max-w-lg space-y-4">
          <h3 className="font-serif font-bold text-base text-brand-forest">
            Personal Information & Security
          </h3>

          {profileMsg && (
            <div className="p-3 bg-emerald-50 text-brand-forest border border-emerald-200 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-brand-forest shrink-0" />
              <span>{profileMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-brand-dark">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-brand-dark">Email Address</label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-brand-dark">Mobile Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
              />
            </div>

            <div className="pt-2 border-t border-brand-border">
              <label className="block font-semibold mb-1 text-brand-dark">New Password (leave blank to keep current)</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
              />
            </div>

            <button
              type="submit"
              className="w-full min-h-[44px] py-2.5 bg-brand-forest text-white rounded-xl font-bold hover:bg-brand-forest-dark transition shadow-luxury"
            >
              Update Profile Details
            </button>
          </form>
        </div>
      )}

      {/* Review Modal */}
      {reviewModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-border space-y-4">
            <h3 className="font-serif font-bold text-base text-brand-forest">
              Review: {reviewModalProduct.productName}
            </h3>

            {reviewSuccess ? (
              <div className="p-4 bg-emerald-50 text-brand-forest border border-emerald-200 rounded-xl text-xs font-semibold text-center">
                Review submitted successfully! Thank you for your feedback.
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
                <div>
                  <span className="block font-semibold mb-1 text-brand-dark">Rating</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setReviewRating(s)}
                        className="text-brand-champagne p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= reviewRating ? "fill-brand-champagne text-brand-champagne" : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Your Detailed Feedback</label>
                  <textarea
                    rows={3}
                    required
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Tell other jewellery lovers about the design, finish, and fit..."
                    className="w-full p-2.5 border border-brand-border rounded-xl focus:outline-none focus:border-brand-forest text-brand-dark"
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setReviewModalProduct(null)}
                    className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
