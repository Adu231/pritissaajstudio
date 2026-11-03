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
      imageUrl:
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1600&q=80",
      ctaText: "Shop Collection",
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
      showToast("Promotional banner updated");
    } else {
      addBanner(bannerForm);
      showToast("New promotional banner added");
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
      minOrderValue: 2499,
      description: "Festive privilege discount",
      validUntil: "2027-12-31",
      isActive: true,
    });
    setCouponModalOpen(true);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const payload = {
      ...couponForm,
      code: couponForm.code.toUpperCase().trim(),
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
    <div className="min-h-screen bg-gray-50 flex flex-col font-poppins pb-16">
      {/* Admin Top Navbar */}
      <header className="bg-brand-emerald text-white border-b border-brand-emerald-light sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <BrandLogo variant="light" size="sm" showBrandName={true} onClick={onExitAdmin} />
            <span className="bg-brand-gold text-brand-emerald text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
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
              className="text-[11px] bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded-lg border border-white/20 text-brand-sage-light hover:text-white transition flex items-center space-x-1"
              title="Reset Database to initial seed state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Seed DB</span>
            </button>

            <button
              onClick={onExitAdmin}
              className="text-xs bg-brand-gold text-brand-emerald font-bold hover:bg-brand-gold-light px-3 py-1.5 rounded-xl transition flex items-center space-x-1 shadow-sm shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </button>
          </div>
        </div>
      </header>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-brand-charcoal text-white px-4 py-3 rounded-2xl shadow-2xl border border-brand-gold/40 flex items-center space-x-2 text-xs animate-slideInRight">
          <Sparkles className="w-4 h-4 text-brand-gold shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Admin Workspace */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex-1 w-full flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Navigation Sidebar: Horizontal scroll on mobile, Vertical on desktop */}
        <aside className="w-full md:w-56 shrink-0 bg-white rounded-2xl p-2 sm:p-3 border border-brand-sage-light shadow-sm self-start">
          <div className="flex md:flex-col overflow-x-auto no-scrollbar gap-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "dashboard"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "products"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <Package className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Products CRUD</span>
            </button>

            <button
              onClick={() => setActiveTab("inventory")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "inventory"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <Layers className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Size-wise Stock</span>
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center justify-between space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "orders"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-brand-gold shrink-0" />
                <span>Orders</span>
              </div>
              {orders.length > 0 && (
                <span className="text-[10px] bg-brand-gold text-brand-emerald font-bold px-1.5 py-0.2 rounded-full ml-1">
                  {orders.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("banners")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "banners"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <Image className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Hero Banners</span>
            </button>

            <button
              onClick={() => setActiveTab("coupons")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "coupons"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <Tag className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Coupons</span>
            </button>

            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "reviews"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <Star className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Reviews</span>
            </button>

            <button
              onClick={() => setActiveTab("reports")}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                activeTab === "reports"
                  ? "bg-brand-emerald text-white shadow-sm font-bold"
                  : "text-brand-charcoal hover:bg-brand-sage-light/20"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-brand-gold shrink-0" />
              <span>Sales Reports</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Area */}
        <main className="flex-1 bg-white rounded-2xl p-4 sm:p-6 border border-brand-sage-light shadow-sm min-w-0">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-2xl font-bold text-brand-emerald">
                    Admin Dashboard Overview
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Real-time mock performance summary for Priti's Saaj Studio
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition flex items-center space-x-1.5 shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </button>
              </div>

              {/* 4 KPI Metric Summary Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-charcoal-muted">
                    Total Revenue
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-emerald">
                    ₹{totalRevenue.toLocaleString("en-IN")}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-emerald-700 font-medium">
                    +18.4% this month
                  </span>
                </div>

                <div className="bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-charcoal-muted">
                    Orders Placed
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-emerald">
                    {totalOrdersCount}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-brand-charcoal-muted font-medium">
                    Online & COD orders
                  </span>
                </div>

                <div className="bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light space-y-1">
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-brand-charcoal-muted">
                    Active Catalog SKUs
                  </span>
                  <div className="font-serif text-lg sm:text-2xl font-bold text-brand-emerald">
                    {activeProductsCount}
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-brand-charcoal-muted font-medium">
                    Across 5 Categories
                  </span>
                </div>

                <div className="bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light space-y-1">
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
                  <h3 className="font-serif font-bold text-sm sm:text-base text-brand-emerald">
                    Recent Customer Orders
                  </h3>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-semibold text-brand-gold-dark hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto border border-brand-sage-light rounded-2xl">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead className="bg-brand-ivory text-brand-emerald font-semibold border-b">
                      <tr>
                        <th className="p-3">Order Number</th>
                        <th className="p-3">Customer</th>
                        <th className="p-3">Items</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-brand-ivory/40">
                          <td className="p-3 font-bold font-poppins text-brand-charcoal">
                            {o.orderNumber}
                          </td>
                          <td className="p-3">
                            <span className="font-semibold block">{o.customerName}</span>
                            <span className="text-[10px] text-gray-400">{o.customerPhone}</span>
                          </td>
                          <td className="p-3">{o.items.length} items</td>
                          <td className="p-3 font-bold text-brand-emerald font-poppins">
                            ₹{o.total?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                o.orderStatus === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-blue-100 text-blue-800"
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
                              className="text-xs font-semibold text-brand-emerald hover:underline"
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                    Jewellery Products Management
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Add, edit, manage ImageKit URLs, sizes, and pricing
                  </p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="px-3.5 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition flex items-center space-x-1.5"
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
                  className="px-3 py-1.5 text-xs border border-brand-sage-light rounded-xl max-w-xs"
                />
                <select
                  value={prodCategoryFilter}
                  onChange={(e) => setProdCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-brand-sage-light rounded-xl font-medium"
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
              <div className="overflow-x-auto border border-brand-sage-light rounded-2xl">
                <table className="w-full text-left text-xs min-w-[650px]">
                  <thead className="bg-brand-ivory text-brand-emerald font-semibold border-b">
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
                  <tbody className="divide-y divide-gray-100">
                    {products
                      .filter((p) => {
                        if (prodCategoryFilter !== "All" && p.category !== prodCategoryFilter) return false;
                        if (prodSearch && !p.name.toLowerCase().includes(prodSearch.toLowerCase())) return false;
                        return true;
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-brand-ivory/40">
                          <td className="p-3 flex items-center space-x-3">
                            <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-sage-light">
                              <SafeImage
                                src={p.images[0]}
                                alt={p.name}
                                category={p.category}
                                aspectRatio="aspect-square"
                              />
                            </div>
                            <div>
                              <span className="font-bold text-brand-charcoal block line-clamp-1">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-gray-400">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="p-3 font-medium">{p.category}</td>
                          <td className="p-3 font-semibold font-poppins">
                            ₹{p.price.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            {p.discountPrice ? (
                              <span className="text-emerald-700 font-bold font-poppins">
                                ₹{p.discountPrice.toLocaleString("en-IN")}
                              </span>
                            ) : (
                              <span className="text-gray-400">—</span>
                            )}
                          </td>
                          <td className="p-3">
                            <div className="flex flex-wrap gap-1">
                              {p.sizes?.map((sz) => (
                                <span
                                  key={sz}
                                  className="text-[9px] bg-brand-ivory border px-1.5 py-0.2 rounded"
                                >
                                  {sz}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                p.isActive
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-gray-100 text-gray-500"
                              }`}
                            >
                              {p.isActive ? "Active" : "Archived"}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-brand-emerald hover:bg-brand-sage-light/30 rounded-lg"
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
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
              <div className="border-b pb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                  Size-Wise Inventory Matrix
                </h2>
                <p className="text-xs text-brand-charcoal-light">
                  Adjust stock per size (Bangles 2.4, 2.6, 2.8, 2.10, etc.). Sizes with zero stock are automatically disabled in customer checkout.
                </p>
              </div>

              <div className="space-y-3.5">
                {products.map((prod) => (
                  <div
                    key={prod.id}
                    className="p-3.5 sm:p-4 bg-brand-ivory/50 rounded-2xl border border-brand-sage-light/70 space-y-3"
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 shrink-0 rounded-lg overflow-hidden border border-brand-sage-light">
                          <SafeImage
                            src={prod.images[0]}
                            alt={prod.name}
                            category={prod.category}
                            aspectRatio="aspect-square"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-brand-charcoal text-xs sm:text-sm">{prod.name}</h4>
                          <span className="text-[10px] text-gray-500">{prod.category}</span>
                        </div>
                      </div>
                      <span className="text-xs text-brand-emerald font-semibold">
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
                                : "border-brand-sage-light"
                            }`}
                          >
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-brand-emerald">Size: {sz}</span>
                              <span
                                className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                                  isOutOfStock
                                    ? "bg-red-200 text-red-800"
                                    : isLow
                                    ? "bg-amber-200 text-amber-800"
                                    : "bg-emerald-100 text-emerald-800"
                                }`}
                              >
                                {isOutOfStock ? "Zero Stock" : isLow ? "Low Stock" : "In Stock"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => updateStock(prod.id, sz, Math.max(0, currentQty - 1))}
                                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
                                  aria-label="Decrease stock"
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-xs font-bold font-poppins">
                                  {currentQty}
                                </span>
                                <button
                                  onClick={() => updateStock(prod.id, sz, currentQty + 1)}
                                  className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-bold text-xs"
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                    Order Fulfillment & Tracking
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Update orders across all 7 statuses (Pending, Confirmed, Processing, Shipped, Out for Delivery, Delivered, Cancelled)
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-brand-sage-light rounded-xl font-semibold"
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

              <div className="overflow-x-auto border border-brand-sage-light rounded-2xl">
                <table className="w-full text-left text-xs min-w-[700px]">
                  <thead className="bg-brand-ivory text-brand-emerald font-semibold border-b">
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
                  <tbody className="divide-y divide-gray-100">
                    {orders
                      .filter((o) =>
                        orderStatusFilter === "All" ? true : o.orderStatus === orderStatusFilter
                      )
                      .map((o) => (
                        <tr key={o.id} className="hover:bg-brand-ivory/40">
                          <td className="p-3 font-bold font-poppins text-brand-charcoal">
                            {o.orderNumber}
                            <span className="block text-[10px] text-gray-400 font-normal">
                              {new Date(o.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-brand-charcoal block">{o.customerName}</span>
                            <span className="text-[10px] text-gray-500">{o.customerPhone}</span>
                            <span className="text-[10px] text-gray-400 block truncate max-w-[150px]">
                              {o.addressSnapshot?.city}, {o.addressSnapshot?.pincode}
                            </span>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="text-[11px]">
                                  <span className="font-medium text-brand-charcoal">{item.productName}</span>
                                  <span className="text-brand-emerald font-bold ml-1">
                                    ({item.size} x {item.quantity})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3 font-bold text-brand-emerald font-poppins">
                            ₹{o.total?.toLocaleString("en-IN")}
                          </td>
                          <td className="p-3">
                            <span className="uppercase text-[10px] font-bold block">
                              {o.paymentMethod}
                            </span>
                            <span
                              className={`text-[9px] font-semibold ${
                                o.paymentStatus === "Paid" ? "text-emerald-700" : "text-amber-700"
                              }`}
                            >
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                o.orderStatus === "Delivered"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : o.orderStatus === "Shipped" || o.orderStatus === "Out for Delivery"
                                  ? "bg-amber-100 text-amber-800"
                                  : o.orderStatus === "Cancelled"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-blue-100 text-blue-800"
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
                              className="px-3 py-1 bg-brand-emerald text-white font-semibold rounded-lg text-xs hover:bg-brand-emerald-light transition"
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                    Homepage Promotional Banners
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Upload & manage hero banners, titles, subtitles, and CTA destinations
                  </p>
                </div>
                <button
                  onClick={handleOpenAddBanner}
                  className="px-3.5 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((ban) => (
                  <div
                    key={ban.id}
                    className="bg-white rounded-2xl border border-brand-sage-light overflow-hidden shadow-sm space-y-3"
                  >
                    <div className="aspect-[21/9] relative overflow-hidden bg-gray-100">
                      <SafeImage
                        src={ban.imageUrl}
                        alt={ban.title}
                        category="Necklaces"
                        aspectRatio="aspect-[21/9]"
                      />
                      <span className="absolute top-2 left-2 text-[10px] bg-brand-charcoal/80 text-white px-2 py-0.5 rounded font-semibold z-10">
                        Order: {ban.displayOrder}
                      </span>
                      <span
                        className={`absolute top-2 right-2 text-[10px] px-2 py-0.5 rounded font-bold z-10 ${
                          ban.isActive ? "bg-emerald-600 text-white" : "bg-gray-400 text-white"
                        }`}
                      >
                        {ban.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <h4 className="font-serif font-bold text-sm text-brand-emerald">
                        {ban.title}
                      </h4>
                      <p className="text-xs text-brand-charcoal-light line-clamp-2">
                        {ban.subtitle}
                      </p>
                      <div className="flex justify-between items-center pt-2 border-t text-xs">
                        <span className="text-[11px] text-gray-400">CTA: "{ban.ctaText}"</span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleOpenEditBanner(ban)}
                            className="p-1 text-brand-emerald hover:bg-brand-sage-light/30 rounded"
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
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                    Coupon Codes & Promotions
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Configure percentage or flat discounts with minimum order thresholds
                  </p>
                </div>
                <button
                  onClick={handleOpenAddCoupon}
                  className="px-3.5 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Coupon</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-4 rounded-2xl border border-brand-sage-light bg-brand-ivory/40 space-y-2 relative"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-brand-emerald text-base font-poppins">
                        {c.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          c.isActive ? "bg-emerald-100 text-emerald-800" : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {c.isActive ? "Active" : "Disabled"}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-brand-charcoal">
                      {c.discountType === "percentage" ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                    </p>

                    <p className="text-xs text-brand-charcoal-light">
                      Min. Order: ₹{c.minOrderValue?.toLocaleString("en-IN")}
                    </p>

                    <p className="text-[11px] text-gray-400">Valid Until: {c.validUntil}</p>

                    <div className="pt-2 border-t flex justify-end space-x-2">
                      <button
                        onClick={() => {
                          updateCoupon({ ...c, isActive: !c.isActive });
                          showToast(`Toggled ${c.code}`);
                        }}
                        className="text-xs text-brand-emerald font-semibold hover:underline"
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
              <div className="border-b pb-4">
                <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                  Customer Reviews Moderation
                </h2>
                <p className="text-xs text-brand-charcoal-light">
                  Approve, reject, or delete customer reviews submitted for jewellery items
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((r) => {
                  const prod = products.find((p) => p.id === r.productId);
                  return (
                    <div
                      key={r.id}
                      className="p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light bg-brand-ivory/30 space-y-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 flex-wrap">
                          <span className="font-bold text-xs text-brand-charcoal">{r.userName}</span>
                          <span className="text-[11px] text-gray-400">reviewed</span>
                          <strong className="text-xs text-brand-emerald">{prod?.name || "Jewellery Item"}</strong>
                        </div>

                        <div className="flex text-brand-gold">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-brand-gold" />
                          ))}
                        </div>

                        <p className="text-xs text-brand-charcoal-light italic">"{r.comment}"</p>
                        <span className="text-[10px] text-gray-400 block">
                          Submitted on {new Date(r.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {r.isApproved ? (
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-full">
                            Approved
                          </span>
                        ) : (
                          <button
                            onClick={() => {
                              moderateReview(r.id, true);
                              showToast("Review approved & published!");
                            }}
                            className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-700"
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
                            className="px-3 py-1 border border-amber-500 text-amber-700 rounded-lg text-xs font-semibold hover:bg-amber-50"
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
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
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
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold text-brand-emerald">
                    Sales & Inventory Analytics
                  </h2>
                  <p className="text-xs text-brand-charcoal-light">
                    Performance indicators, category distribution, and top revenue drivers
                  </p>
                </div>
                <button
                  onClick={() => showToast("Exported sales report CSV simulation downloaded.")}
                  className="px-3.5 py-2 bg-brand-emerald text-white rounded-xl text-xs font-semibold hover:bg-brand-emerald-light transition flex items-center space-x-1.5"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Export Report (CSV)</span>
                </button>
              </div>

              {/* Category Sales Distribution */}
              <div className="p-4 sm:p-5 bg-brand-ivory rounded-2xl border border-brand-sage-light space-y-4">
                <h3 className="font-serif font-bold text-sm text-brand-emerald">
                  Revenue Distribution by Jewellery Category
                </h3>
                <div className="space-y-3">
                  {categories.map((c, idx) => {
                    const percentage = [35, 28, 18, 12, 7][idx] || 15;
                    return (
                      <div key={c.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold text-brand-charcoal">{c.name}</span>
                          <span className="font-bold text-brand-emerald">{percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-emerald rounded-full"
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
                <h3 className="font-serif font-bold text-sm text-brand-emerald">
                  Top Bestselling Pieces
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {products
                    .filter((p) => p.isBestseller)
                    .map((p) => (
                      <div
                        key={p.id}
                        className="p-3 rounded-2xl border border-brand-sage-light flex items-center space-x-3 bg-white"
                      >
                        <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden border border-brand-sage-light">
                          <SafeImage
                            src={p.images[0]}
                            alt={p.name}
                            category={p.category}
                            aspectRatio="aspect-square"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-xs text-brand-charcoal truncate">{p.name}</p>
                          <p className="text-[11px] text-brand-charcoal-muted">
                            {p.category} • ₹{(p.discountPrice || p.price).toLocaleString("en-IN")}
                          </p>
                          <span className="text-[10px] text-brand-gold-dark font-semibold">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-brand-sage-light">
            <div className="p-4 bg-brand-emerald text-white flex items-center justify-between border-b border-brand-gold/40">
              <h3 className="font-serif font-bold text-base">
                {editingProduct ? "Edit Jewellery Product" : "Add New Jewellery Product"}
              </h3>
              <button onClick={() => setProductModalOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-4 sm:p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Traditional Kolhapuri Saaj"
                  className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="3999"
                    className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.discountPrice}
                    onChange={(e) => setProductForm({ ...productForm, discountPrice: e.target.value })}
                    placeholder="2999"
                    className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                />
              </div>

              {/* ImageKit URL manager & Preview */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold">Image URL (ImageKit compatible) *</label>
                  <button
                    type="button"
                    onClick={() =>
                      setProductForm({ ...productForm, images: [...productForm.images, ""] })
                    }
                    className="text-brand-emerald font-semibold hover:underline"
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
                        className="flex-1 p-2 border border-brand-sage-light rounded-xl"
                      />
                      {img && (
                        <div className="w-9 h-9 rounded-lg overflow-hidden border shrink-0">
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
                <label className="block font-semibold mb-1">
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
                  className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                />
              </div>

              {/* Checkboxes */}
              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isBestseller}
                    onChange={(e) => setProductForm({ ...productForm, isBestseller: e.target.checked })}
                    className="rounded text-brand-emerald"
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="rounded text-brand-emerald"
                  />
                  <span>Featured Collection</span>
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-emerald text-white font-semibold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-5 sm:p-6 border border-brand-sage-light space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-base text-brand-emerald">
                Update Order: {selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Update Status *</label>
                <select
                  value={orderStatusUpdate}
                  onChange={(e) => setOrderStatusUpdate(e.target.value)}
                  className="w-full p-2.5 border border-brand-sage-light rounded-xl font-semibold"
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
                  <label className="block font-semibold mb-1">Courier Partner</label>
                  <input
                    type="text"
                    value={orderCourier}
                    onChange={(e) => setOrderCourier(e.target.value)}
                    className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Tracking Number / AWB</label>
                  <input
                    type="text"
                    value={orderTrackingNum}
                    onChange={(e) => setOrderTrackingNum(e.target.value)}
                    placeholder="BD-8821901"
                    className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Timeline Event Note</label>
                <input
                  type="text"
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Dispatched via express courier service"
                  className="w-full p-2.5 border border-brand-sage-light rounded-xl"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-emerald text-white font-semibold rounded-xl"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-sage-light space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-brand-emerald">
              {editingBanner ? "Edit Hero Banner" : "Create Hero Banner"}
            </h3>
            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Banner Title *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  placeholder="The Royal Saaj Heritage Collection"
                  className="w-full p-2 border border-brand-sage-light rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Subtitle *</label>
                <input
                  type="text"
                  required
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full p-2 border border-brand-sage-light rounded-lg"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full p-2 border border-brand-sage-light rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={bannerForm.ctaText}
                    onChange={(e) => setBannerForm({ ...bannerForm, ctaText: e.target.value })}
                    className="w-full p-2 border border-brand-sage-light rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Display Order</label>
                  <input
                    type="number"
                    value={bannerForm.displayOrder}
                    onChange={(e) => setBannerForm({ ...bannerForm, displayOrder: Number(e.target.value) })}
                    className="w-full p-2 border border-brand-sage-light rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-emerald text-white font-semibold rounded-lg"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-brand-charcoal/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-5 sm:p-6 border border-brand-sage-light space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif font-bold text-base text-brand-emerald">Create Coupon Code</h3>
            <form onSubmit={handleSaveCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  placeholder="e.g. SAAJ15"
                  className="w-full p-2 uppercase border border-brand-sage-light rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={couponForm.discountType}
                    onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value })}
                    className="w-full p-2 border border-brand-sage-light rounded-lg"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.discountValue}
                    onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                    className="w-full p-2 border border-brand-sage-light rounded-lg"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Minimum Order Value (₹)</label>
                <input
                  type="number"
                  value={couponForm.minOrderValue}
                  onChange={(e) => setCouponForm({ ...couponForm, minOrderValue: e.target.value })}
                  className="w-full p-2 border border-brand-sage-light rounded-lg"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setCouponModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand-emerald text-white font-semibold rounded-lg"
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
