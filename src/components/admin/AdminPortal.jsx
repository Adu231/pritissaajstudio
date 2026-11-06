import React, { useState } from "react";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Image,
  Tag,
  Star,
  BarChart3,
  Plus,
  Edit2,
  Trash2,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Eye,
  Truck,
  ExternalLink,
  ShieldCheck,
  Search,
  ArrowUpDown,
  Sparkles,
  ArrowLeft,
} from "lucide-react";
import { useProducts } from "../../context/ProductContext";
import { useAuth } from "../../context/AuthContext";
import { BrandLogo } from "../common/BrandLogo";
import { SafeImage } from "../common/SafeImage";

export const AdminPortal = ({ onExitAdmin }) => {
  const {
    products,
    categories,
    banners,
    orders,
    reviews,
    coupons,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    addBanner,
    updateBanner,
    deleteBanner,
    addCoupon,
    updateCoupon,
    deleteCoupon,
    updateOrderStatus,
    moderateReview,
    deleteReview,
    resetAllData,
  } = useProducts();

  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'products' | 'inventory' | 'orders' | 'banners' | 'coupons' | 'reviews' | 'reports'
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // --- PRODUCT MODAL STATE ---
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    category: "Necklaces",
    price: "",
    discountPrice: "",
    description: "",
    metal: "24K Micro Gold Plated Brass",
    weight: "45 grams",
    images: [""],
    sizes: ["Standard"],
    stockBySize: { Standard: 10 },
    isBestseller: false,
    isFeatured: true,
  });

  // --- BANNER MODAL STATE ---
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerForm, setBannerForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "Shop Collection",
    link: "catalogue",
    displayOrder: 1,
    isActive: true,
  });

  // --- COUPON MODAL STATE ---
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 1999,
    description: "",
    validUntil: "2027-12-31",
    isActive: true,
  });

  // --- ORDER DETAILS MODAL STATE ---
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStatusUpdate, setOrderStatusUpdate] = useState("");
  const [orderTrackingNum, setOrderTrackingNum] = useState("");
  const [orderCourier, setOrderCourier] = useState("Blue Dart Express");
  const [orderNote, setOrderNote] = useState("");

  // Product Filter
  const [prodSearch, setProdSearch] = useState("");
  const [prodCategoryFilter, setProdCategoryFilter] = useState("All");

  // Order Filter
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  // Metrics calculation
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrdersCount = orders.length;
  const activeProductsCount = products.filter((p) => p.isActive).length;
  const lowStockCount = products.reduce((count, p) => {
    if (!p.stockBySize) return count;
    const hasLow = Object.values(p.stockBySize).some((qty) => qty <= 3);
    return hasLow ? count + 1 : count;
  }, 0);

  // --- PRODUCT HANDLERS ---
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProductForm({
      name: "",
      category: "Necklaces",
      price: "",
      discountPrice: "",
      description: "",
      metal: "24K Micro Gold Plated Brass",
      weight: "45 grams",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
      ],
      sizes: ["Standard"],
      stockBySize: { Standard: 10 },
      isBestseller: false,
      isFeatured: true,
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      category: prod.category,
      price: prod.price,
      discountPrice: prod.discountPrice || "",
      description: prod.description,
      metal: prod.metal || "",
      weight: prod.weight || "",
      images: prod.images && prod.images.length > 0 ? [...prod.images] : [""],
      sizes: prod.sizes && prod.sizes.length > 0 ? [...prod.sizes] : ["Standard"],
      stockBySize: prod.stockBySize ? { ...prod.stockBySize } : { Standard: 10 },
      isBestseller: prod.isBestseller || false,
      isFeatured: prod.isFeatured || false,
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();
    const payload = {
      ...productForm,
      price: Number(productForm.price),
      discountPrice: productForm.discountPrice ? Number(productForm.discountPrice) : null,
      images: productForm.images.filter((img) => img.trim() !== ""),
    };

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...payload });
      showToast(`Updated product: ${payload.name}`);
    } else {
      addProduct(payload);
      showToast(`Created new product: ${payload.name}`);
    }
    setProductModalOpen(false);
  };

  // --- BANNER HANDLERS ---
  const handleOpenAddBanner = () => {
    setEditingBanner(null);
    setBannerForm({
      title: "",
      subtitle: "",
      imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80",
      ctaText: "Explore Collection",
      link: "catalogue",
      displayOrder: banners.length + 1,
      isActive: true,
    });
    setBannerModalOpen(true);
  };

  const handleOpenEditBanner = (ban) => {
    setEditingBanner(ban);
    setBannerForm({ ...ban });
    setBannerModalOpen(true);
  };

  const handleSaveBanner = (e) => {
    e.preventDefault();
    if (editingBanner) {
      updateBanner({ ...editingBanner, ...bannerForm });
      showToast("Updated banner.");
    } else {
      addBanner(bannerForm);
      showToast("Created new hero banner.");
    }
    setBannerModalOpen(false);
  };

  // --- COUPON HANDLERS ---
  const handleOpenAddCoupon = () => {
    setEditingCoupon(null);
    setCouponForm({
      code: "",
      discountType: "percentage",
      discountValue: 15,
      minOrderValue: 1499,
      description: "Festive Exclusive Discount",
      validUntil: "2027-12-31",
      isActive: true,
    });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const payload = {
      ...couponForm,
      discountValue: Number(couponForm.discountValue),
      minOrderValue: Number(couponForm.minOrderValue),
    };
    if (editingCoupon) {
      updateCoupon(payload);
      showToast(`Updated coupon ${payload.code}`);
    } else {
      addCoupon(payload);
      showToast(`Created coupon ${payload.code}`);
    }
    setCouponModalOpen(false);
  };

  // --- ORDER STATUS UPDATE ---
  const handleUpdateOrderStatus = (e) => {
    e.preventDefault();
    if (!selectedOrder || !orderStatusUpdate) return;
    updateOrderStatus(
      selectedOrder.id,
      orderStatusUpdate,
      orderNote,
      orderTrackingNum,
      orderCourier
    );
    showToast(`Order ${selectedOrder.orderNumber} updated to ${orderStatusUpdate}`);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-brand-offwhite flex flex-col font-poppins pb-16">
      {/* Admin Top Navbar */}
      <header className="bg-brand-forest text-white border-b border-brand-champagne/30 sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BrandLogo variant="light" size="sm" showBrandName={true} onClick={onExitAdmin} />
            <span className="bg-brand-champagne text-brand-forest text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0 border border-brand-champagne-dark/30">
              Admin Portal
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm("Reset all catalogue, orders, banners and coupons to factory seed data?")) {
                  resetAllData();
                  showToast("Mock database reset to default seed data.");
                }
              }}
              className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20 text-brand-champagne-light hover:text-white transition flex items-center space-x-1"
              title="Reset Database to initial seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed DB</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="text-xs bg-brand-champagne text-brand-forest font-bold hover:bg-brand-champagne-dark px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-brand-forest text-white px-4 py-3 rounded-2xl shadow-2xl border border-brand-champagne/40 flex items-center space-x-2 text-xs animate-slideInRight">
          <Sparkles className="w-4 h-4 text-brand-champagne shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Navigation Sidebar: Horizontal scroll on mobile, Vertical on desktop */}
        <aside className="w-full md:w-56 shrink-0 bg-white rounded-2xl p-2 sm:p-3 border border-brand-border shadow-xs self-start">
          <div className="flex md:flex-col overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "dashboard"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "products"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <Package className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Products CRUD</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "inventory"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <Layers className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Size-wise Stock</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "orders"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-brand-champagne-dark shrink-0" />
                <span>Orders</span>
              </div>
              {orders.length > 0 && (
                <span className="text-[10px] bg-brand-champagne text-brand-forest font-bold px-1.5 py-0.2 rounded-full ml-1">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("banners")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "banners"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <Image className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Hero Banners</span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "coupons"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <Tag className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Coupons</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "reviews"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <Star className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "reports"
                  ? "bg-brand-forest text-white shadow-xs font-bold"
                  : "text-brand-dark hover:bg-brand-offwhite hover:text-brand-forest"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-champagne-dark shrink-0" />
              <span>Sales Reports</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 bg-white rounded-2xl p-4 sm:p-6 border border-brand-border shadow-xs min-w-0">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-2xl font-bold text-brand-forest">
                    Admin Dashboard Overview
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Real-time mock performance summary for Priti's Saaj Studio
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* 4 KPI Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-brand-offwhite p-3.5 sm:p-4 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    Total Revenue
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-forest">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-brand-forest font-medium">
                    +18.4% this month
                  </span>
                </div>

                <div className="bg-brand-offwhite p-3.5 sm:p-4 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    Orders Placed
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-forest">
                    {totalOrdersCount}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-brand-muted font-medium">
                    Online & COD orders
                  </span>
                </div>

                <div className="bg-brand-offwhite p-3.5 sm:p-4 rounded-2xl border border-brand-border space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-muted">
                    Active Catalog SKUs
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-forest">
                    {activeProductsCount}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-brand-muted font-medium">
                    Across 5 Categories
                  </span>
                </div>

                <div className="bg-amber-50/60 p-3.5 sm:p-4 rounded-2xl border border-amber-200 space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800">
                    Low Stock Alerts
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-amber-700">
                    {lowStockCount}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-amber-800 font-medium">
                    Requires restocking
                  </span>
                </div>
              </div>

              {/* Recent Orders Overview */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-brand-forest">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-brand-champagne-dark hover:text-brand-forest hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto border border-brand-border rounded-2xl">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-brand-offwhite text-brand-forest font-semibold border-b border-brand-border">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/40">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-brand-offwhite/50">
                          <td className="p-3 font-bold font-poppins text-brand-dark">
                            {o.orderNumber}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold block text-brand-dark">{o.customerName}</span>
                            <span className="text-[10px] text-brand-muted">{o.customerPhone}</span>
                          </td>
                          <td className="p-3 text-brand-dark">{o.items.length} items</td>
                          <td className="p-3 font-bold text-brand-forest font-poppins">
                            ₹{o.total?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                o.orderStatus === "Delivered"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : o.orderStatus === "Shipped" || o.orderStatus === "Out for Delivery"
                                  ? "bg-brand-champagne/20 text-brand-forest border-brand-champagne/40"
                                  : o.orderStatus === "Cancelled"
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : "bg-brand-offwhite text-brand-forest border-brand-border"
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setOrderStatusUpdate(o.orderStatus);
                                setOrderTrackingNum(o.trackingNumber || "");
                                setOrderCourier(o.courier || "Blue Dart Express");
                              }}
                              className="text-xs font-semibold text-brand-forest hover:underline"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                    Jewellery Products Management
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Add, edit, manage ImageKit URLs, sizes, and pricing
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-brand-border rounded-xl max-w-xs bg-white text-brand-dark focus:border-brand-forest focus:outline-none"
                />
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-brand-border rounded-xl font-medium bg-white text-brand-dark focus:border-brand-forest focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="overflow-x-auto border border-brand-border rounded-2xl">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-brand-offwhite text-brand-forest font-semibold border-b border-brand-border">
                    <tr>
                      <th className="p-3">Jewellery</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Discount</th>
                      <th className="p-3">Sizes</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40">
                    {products
                      .filter((p) => {
                        if (prodCategoryFilter !== "All" && p.category !== prodCategoryFilter) return false;
                        if (prodSearch && !p.name.toLowerCase().includes(prodSearch.toLowerCase())) return false;
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-brand-offwhite/50">
                          <td className="p-3 flex items-center space-x-3">
                            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-border">
                              <SafeImage
                                src={p.images[0]}
                                alt={p.name}
                                category={p.category}
                                aspectRatio="aspect-square"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-brand-dark block line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-brand-muted">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium text-brand-dark">{p.category}</td>
                          <td className="p-3 font-semibold font-poppins text-brand-dark">
                            ₹{p.price.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            {p.discountPrice ? (
                              <span className="text-brand-forest font-bold font-poppins">
                                ₹{p.discountPrice.toLocaleString("en-IN")}
                              </span>
                            ) : (
                              <span className="text-brand-muted">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {p.sizes?.map((sz) => (
                                <span
                                  key={sz}
                                  className="text-[9px] bg-brand-offwhite border border-brand-border text-brand-dark px-1.5 py-0.2 rounded font-medium"
                                >
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                p.isActive
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : "bg-gray-100 text-gray-500 border-gray-200"
                              }`}
                            >
                              {p.isActive ? "Active" : "Archived"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-brand-forest hover:bg-brand-offwhite rounded-lg transition"
                                title="Edit product"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (window.confirm(`Delete product "${p.name}"?`)) {
                                    deleteProduct(p.id);
                                    showToast("Product deleted");
                                  }
                                }}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: SIZE-WISE STOCK MATRIX */}
          {activeTab === "inventory" && (
            <div className="space-y-4">
              <div className="border-b border-brand-border pb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                  Size-Wise Inventory Matrix
                </h2>
                <p className="text-xs text-brand-muted">
                  Adjust stock per size (Bangles 2.4, 2.6, 2.8, 2.10, etc.). Sizes with zero stock are automatically disabled in customer checkout.
                </p>
              </div>

              <div className="space-y-3.5">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 sm:p-4 bg-brand-offwhite rounded-2xl border border-brand-border space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-border">
                          <SafeImage
                            src={prod.images[0]}
                            alt={prod.name}
                            category={prod.category}
                            aspectRatio="aspect-square"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-dark text-xs sm:text-sm">{prod.name}</h4>
                          <span className="text-[10px] text-brand-muted">{prod.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-brand-forest font-semibold">
                        Total Stock:{" "}
                        {prod.stockBySize
                          ? Object.values(prod.stockBySize).reduce((a, b) => a + b, 0)
                          : 0}{" "}
                        units
                      </span>
                    </div>

                    {/* Sizes Matrix */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {prod.sizes?.map((sz) => {
                        const currentQty = prod.stockBySize ? prod.stockBySize[sz] ?? 0 : 0;
                        const isOutOfStock = currentQty === 0;
                        const isLow = currentQty > 0 && currentQty <= 3;

                        return (
                          <div
                            key={sz}
                            className={`p-2.5 rounded-xl border bg-white flex flex-col justify-between space-y-2 ${
                              isOutOfStock
                                ? "border-red-200 bg-red-50/40"
                                : isLow
                                ? "border-amber-200 bg-amber-50/40"
                                : "border-brand-border"
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-brand-forest">Size: {sz}</span>
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded border ${
                                  isOutOfStock
                                    ? "bg-red-100 text-red-800 border-red-200"
                                    : isLow
                                    ? "bg-amber-100 text-amber-800 border-amber-200"
                                    : "bg-emerald-50 text-emerald-800 border-emerald-200"
                                }`}
                              >
                                {isOutOfStock ? "Zero Stock" : isLow ? "Low Stock" : "In Stock"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => updateStock(prod.id, sz, Math.max(0, currentQty - 1))}
                                  className="w-7 h-7 rounded-lg bg-brand-offwhite border border-brand-border hover:bg-brand-forest hover:text-white transition flex items-center justify-center font-bold text-xs text-brand-forest"
                                  aria-label="Decrease stock"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-bold font-poppins text-brand-dark">
                                  {currentQty}
                                </span>
                                <button
                                  onClick={() => updateStock(prod.id, sz, currentQty + 1)}
                                  className="w-7 h-7 rounded-lg bg-brand-offwhite border border-brand-border hover:bg-brand-forest hover:text-white transition flex items-center justify-center font-bold text-xs text-brand-forest"
                                  aria-label="Increase stock"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ORDERS & STATUS UPDATES */}
          {activeTab === "orders" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                    Order Fulfillment & Tracking
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Update orders across all 7 statuses (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered, Cancelled)
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-brand-border rounded-xl font-semibold bg-white text-brand-dark focus:border-brand-forest cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-brand-border rounded-2xl">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-brand-offwhite text-brand-forest font-semibold border-b border-brand-border">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer Details</th>
                      <th className="p-3">Items & Sizes</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Delivery Status</th>
                      <th className="p-3 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-brand-border/40">
                    {orders
                      .filter((o) =>
                        orderStatusFilter === "All" ? true : o.orderStatus === orderStatusFilter
                      )
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-brand-offwhite/50">
                          <td className="p-3 font-bold font-poppins text-brand-dark">
                            {o.orderNumber}
                            <span className="block text-[10px] text-brand-muted font-normal">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-brand-dark block">{o.customerName}</span>
                            <span className="text-[10px] text-brand-muted">{o.customerPhone}</span>
                            <span className="text-[10px] text-brand-muted block truncate max-w-[150px]">
                              {o.addressSnapshot?.city}, {o.addressSnapshot?.pincode}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="text-[11px]">
                                  <span className="font-medium text-brand-dark">{item.productName}</span>
                                  <span className="text-brand-forest font-bold ml-1">
                                    ({item.size} x {item.quantity})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-brand-forest font-poppins">
                            ₹{o.total?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold block text-brand-dark">
                              {o.paymentMethod}
                            </span>
                            <span
                              className={`text-[9px] font-semibold ${
                                o.paymentStatus === "Paid" ? "text-brand-forest" : "text-amber-700"
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                o.orderStatus === "Delivered"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                                  : o.orderStatus === "Shipped" || o.orderStatus === "Out for Delivery"
                                  ? "bg-brand-champagne/20 text-brand-forest border-brand-champagne/40"
                                  : o.orderStatus === "Cancelled"
                                  ? "bg-red-50 text-red-800 border-red-200"
                                  : "bg-brand-offwhite text-brand-forest border-brand-border"
                              }`}
                            >
                              {o.orderStatus}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedOrder(o);
                                setOrderStatusUpdate(o.orderStatus);
                                setOrderTrackingNum(o.trackingNumber || "");
                                setOrderCourier(o.courier || "Blue Dart Express");
                              }}
                              className="px-3 py-1 bg-brand-forest text-white font-semibold rounded-lg text-xs hover:bg-brand-forest-dark transition"
                            >
                              Manage
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: HERO BANNERS MANAGEMENT */}
          {activeTab === "banners" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                    Homepage Promotional Banners
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Upload & manage hero banners, titles, subtitles, and CTA destinations
                  </p>
                </div>
                <button
                  onClick={handleOpenAddBanner}
                  className="px-3.5 py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((ban) => (
                  <div
                    key={ban.id}
                    className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-xs space-y-3"
                  >
                    <div className="aspect-[21/9] relative overflow-hidden bg-brand-offwhite">
                      <SafeImage
                        src={ban.imageUrl}
                        alt={ban.title}
                        category="Necklaces"
                        aspectRatio="aspect-[21/9]"
                      />
                      <span className="absolute top-2 left-2 text-[10px] bg-brand-forest/80 text-white px-2 py-0.5 rounded font-semibold z-10">
                        Order: {ban.displayOrder}
                      </span>
                      <span
                        className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded font-bold z-10 ${
                          ban.isActive ? "bg-brand-forest text-white" : "bg-gray-400 text-white"
                        }`}
                      >
                        {ban.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-sm text-brand-forest">
                        {ban.title}
                      </h4>
                      <p className="text-xs text-brand-dark/80 line-clamp-2">
                        {ban.subtitle}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t border-brand-border text-xs">
                        <span className="text-[11px] text-brand-muted">CTA: "{ban.ctaText}"</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditBanner(ban)}
                            className="p-1 text-brand-forest hover:bg-brand-offwhite rounded transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm("Delete this banner?")) {
                                deleteBanner(ban.id);
                                showToast("Banner deleted");
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COUPONS MANAGEMENT */}
          {activeTab === "coupons" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                    Coupon Codes & Promotions
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Configure percentage or flat discounts with minimum order thresholds
                  </p>
                </div>
                <button
                  onClick={handleOpenAddCoupon}
                  className="px-3.5 py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl border border-brand-border bg-brand-offwhite space-y-2 relative shadow-xs"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-forest text-base font-poppins">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          c.isActive ? "bg-brand-champagne/20 text-brand-forest border-brand-champagne/40" : "bg-gray-100 text-gray-500 border-gray-200"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-brand-dark">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                    </p>

                    <p className="text-xs text-brand-muted">
                      Min. Order: ₹{c.minOrderValue?.toLocaleString("en-IN")}
                    </p>

                    <p className="text-[11px] text-brand-muted">Valid Until: {c.validUntil}</p>

                    <div className="pt-2 border-t border-brand-border flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          updateCoupon({ ...c, isActive: !c.isActive });
                          showToast(`Toggled ${c.code}`);
                        }}
                        className="text-xs text-brand-forest font-semibold hover:underline"
                      >
                        {c.isActive ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete coupon ${c.code}?`)) {
                            deleteCoupon(c.code);
                            showToast("Coupon removed");
                          }
                        }}
                        className="text-xs text-red-600 font-semibold hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: REVIEWS MODERATION */}
          {activeTab === "reviews" && (
            <div className="space-y-4">
              <div className="border-b border-brand-border pb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                  Customer Reviews Moderation
                </h2>
                <p className="text-xs text-brand-muted">
                  Approve, reject, or delete customer reviews submitted for jewellery items
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((r) => {
                  const prod = products.find((p) => p.id === r.productId);
                  return (
                    <div
                      key={r.id}
                      className="p-3.5 sm:p-4 rounded-2xl border border-brand-border bg-brand-offwhite space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-bold text-xs text-brand-dark">{r.userName}</span>
                          <span className="text-[11px] text-brand-muted">reviewed</span>
                          <strong className="text-xs text-brand-forest">{prod?.name || "Jewellery Item"}</strong>
                        </div>

                        <div className="flex text-brand-champagne">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-brand-champagne text-brand-champagne" />
                          ))}
                        </div>

                        <p className="text-xs text-brand-dark/85 italic">"{r.comment}"</p>
                        <span className="text-[10px] text-brand-muted block">
                          Submitted on {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {r.isApproved ? (
                          <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2.5 py-1 rounded-full">
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              moderateReview(r.id, true);
                              showToast("Review approved & published!");
                            }}
                            className="px-3 py-1 bg-brand-forest text-white rounded-lg text-xs font-semibold hover:bg-brand-forest-dark transition"
                          >
                            Approve
                          </button>
                        )}

                        {r.isApproved && (
                          <button
                            onClick={() => {
                              moderateReview(r.id, false);
                              showToast("Review hidden from storefront");
                            }}
                            className="px-3 py-1 border border-amber-500 text-amber-800 rounded-lg text-xs font-semibold hover:bg-amber-50 transition"
                          >
                            Hide
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (window.confirm("Permanently delete review?")) {
                              deleteReview(r.id);
                              showToast("Review deleted");
                            }
                          }}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 8: SALES REPORTS & ANALYTICS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-border pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-forest">
                    Sales & Inventory Analytics
                  </h2>
                  <p className="text-xs text-brand-muted">
                    Performance indicators, category distribution, and top revenue drivers
                  </p>
                </div>
                <button
                  onClick={() => showToast("Exported sales report CSV simulation downloaded.")}
                  className="px-3.5 py-2 bg-brand-forest text-white rounded-xl text-xs font-semibold hover:bg-brand-forest-dark transition flex items-center space-x-1.5 shadow-xs"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              {/* Category Sales Distribution */}
              <div className="p-4 sm:p-5 bg-brand-offwhite rounded-2xl border border-brand-border space-y-4">
                <h3 className="font-serif font-bold text-sm text-brand-forest">
                  Revenue Distribution by Jewellery Category
                </h3>
                <div className="space-y-3">
                  {categories.map((c, idx) => {
                    const percentage = [35, 28, 18, 12, 7][idx] || 15;
                    return (
                      <div key={c.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-brand-dark">{c.name}</span>
                          <span className="font-bold text-brand-forest">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-brand-border rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-forest rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Top Selling Pieces */}
              <div className="space-y-3">
                <h3 className="font-serif font-bold text-sm text-brand-forest">
                  Top Bestselling Pieces
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {products
                    .filter((p) => p.isBestseller)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-brand-border flex items-center space-x-3 bg-white shadow-xs"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-brand-border">
                          <SafeImage
                            src={p.images[0]}
                            alt={p.name}
                            category={p.category}
                            aspectRatio="aspect-square"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-brand-dark truncate">{p.name}</p>
                          <p className="text-[11px] text-brand-muted">
                            {p.category} • ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                          </p>
                          <span className="text-[10px] text-brand-champagne-dark font-semibold">
                            Rating: {p.rating} ★ ({p.reviewCount} reviews)
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* PRODUCT ADD / EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-brand-border">
            <div className="p-4 bg-brand-forest text-white flex items-center justify-between border-b border-brand-champagne/30">
              <h3 className="font-serif font-bold text-base">
                {editingProduct ? "Edit Jewellery Product" : "Add New Jewellery Product"}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs bg-white">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Traditional Kolhapuri Saaj"
                  className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="3999"
                    className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    placeholder="2999"
                    className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                />
              </div>

              {/* ImageKit URL manager & Preview */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-brand-dark">Image URL (ImageKit compatible) *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({ ...productForm, images: [...productForm.images, ""] })
                    }
                    className="text-brand-forest font-semibold hover:underline"
                  >
                    + Add Another Image URL
                  </button>
                </div>
                <div className="space-y-2">
                  {productForm.images.map((img, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="url"
                        required
                        value={img}
                        onChange={(e) => {
                          const newImages = [...productForm.images];
                          newImages[idx] = e.target.value;
                          setProductForm({ ...productForm, images: newImages });
                        }}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 p-2 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                      />
                      {img && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border border-brand-border shrink-0">
                          <SafeImage src={img} alt="preview" category={productForm.category} aspectRatio="aspect-square" />
                        </div>
                      )}
                      {productForm.images.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newImages = productForm.images.filter((_, i) => i !== idx);
                            setProductForm({ ...productForm, images: newImages });
                          }}
                          className="text-red-500 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizes & Stock */}
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">
                  Sizes Configuration (comma separated)
                </label>
                <input
                  type="text"
                  value={productForm.sizes.join(", ")}
                  onChange={(e) => {
                    const parsedSizes = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                    const newStock = { ...productForm.stockBySize };
                    parsedSizes.forEach((sz) => {
                      if (newStock[sz] === undefined) newStock[sz] = 10;
                    });
                    setProductForm({ ...productForm, sizes: parsedSizes, stockBySize: newStock });
                  }}
                  placeholder="e.g. 2.4, 2.6, 2.8, 2.10"
                  className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark focus:border-brand-forest"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer text-brand-dark">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="rounded text-brand-forest focus:ring-brand-forest"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer text-brand-dark">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-brand-forest focus:ring-brand-forest"
                  />
                  <span>Featured Collection</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ORDER UPDATE MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-brand-border pb-3">
              <h3 className="font-serif font-bold text-base text-brand-forest">
                Update Order: {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-brand-dark" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Update Status *</label>
                <select
                  value={orderStatusUpdate}
                  onChange={(e) => setOrderStatusUpdate(e.target.value)}
                  className="w-full p-2.5 border border-brand-border rounded-xl font-semibold text-brand-dark focus:border-brand-forest cursor-pointer"
                >
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Courier Partner</label>
                  <input
                    type="text"
                    value={orderCourier}
                    onChange={(e) => setOrderCourier(e.target.value)}
                    className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Tracking Number / AWB</label>
                  <input
                    type="text"
                    value={orderTrackingNum}
                    onChange={(e) => setOrderTrackingNum(e.target.value)}
                    placeholder="BD-8821901"
                    className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Timeline Event Note</label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Dispatched via express courier service"
                  className="w-full p-2.5 border border-brand-border rounded-xl text-brand-dark"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                >
                  Apply Status Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BANNER ADD / EDIT MODAL */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-brand-forest">
              {editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
            </h3>
            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="The Royal Saaj Heritage Collection"
                  className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Image URL *</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Display Order</label>
                  <input
                    type="number"
                    value={bannerForm.displayOrder}
                    onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })}
                    className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* COUPON MODAL */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-dark/65 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-border space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-brand-forest">Create Coupon Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. SAAJ15"
                  className="w-full p-2 uppercase border border-brand-border rounded-xl text-brand-dark"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded-xl text-brand-dark cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-brand-dark">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1 text-brand-dark">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={couponForm.minOrderValue}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                  className="w-full p-2 border border-brand-border rounded-xl text-brand-dark"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t border-brand-border">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border border-brand-border rounded-xl text-brand-dark hover:bg-brand-offwhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-forest text-white font-semibold rounded-xl hover:bg-brand-forest-dark transition"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
