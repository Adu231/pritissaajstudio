import React from "react";
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  ArrowRight,
  Sparkles,
  ShoppingBag,
} from "lucide-react";
import { SafeImage } from "../common/SafeImage";

export const OrderConfirmationView = ({ order, onContinueShopping, onViewProfile }) => {
  if (!order) return null;

  // The 6 standard order stages from PRD/TRD/UI-UX
  const STAGES = [
    { key: "Order Placed", label: "Order Placed", desc: "Order registered in system" },
    { key: "Confirmed", label: "Confirmed", desc: "Payment verified & allocated" },
    { key: "Processing", label: "Processing", desc: "Luxury velvet packed in Pune" },
    { key: "Shipped", label: "Shipped", desc: "Handed to courier partner" },
    { key: "Out for Delivery", label: "Out for Delivery", desc: "With local delivery agent" },
    { key: "Delivered", label: "Delivered", desc: "Safely received by customer" },
  ];

  const currentStageIndex = STAGES.findIndex((s) => s.key === order.orderStatus);
  const isCancelled = order.orderStatus === "Cancelled";

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-14">
      {/* Top Success Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-10 border border-brand-sage-light shadow-luxury text-center space-y-3.5 mb-6 sm:mb-8">
        <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-emerald-50 border-2 border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-600 shadow-sm animate-gem">
          <CheckCircle2 className="w-8 h-8 sm:w-12 sm:h-12 text-emerald-600" />
        </div>

        <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-gold/15 text-brand-emerald text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-brand-gold shrink-0" />
          <span>Payment & Order Confirmed</span>
        </span>

        <h1 className="font-serif text-xl sm:text-3xl md:text-4xl font-extrabold text-brand-emerald">
          Thank You for Shopping with Priti's Saaj!
        </h1>

        <p className="text-xs sm:text-sm text-brand-charcoal-light max-w-lg mx-auto">
          We have received your order. Our master karigars in Pune are carefully quality-inspecting and packing your jewellery into a luxury velvet safety pouch.
        </p>

        {/* Order Number & Meta Pills */}
        <div className="pt-2 flex flex-wrap justify-center gap-2 sm:gap-3 text-xs">
          <div className="bg-brand-ivory px-3.5 py-2 rounded-xl border border-brand-sage-light">
            <span className="text-gray-400 block text-[9px] uppercase font-bold">Order Number</span>
            <strong className="text-brand-charcoal text-xs sm:text-sm font-poppins">{order.orderNumber}</strong>
          </div>

          <div className="bg-brand-ivory px-3.5 py-2 rounded-xl border border-brand-sage-light">
            <span className="text-gray-400 block text-[9px] uppercase font-bold">Estimated Delivery</span>
            <strong className="text-brand-emerald text-xs sm:text-sm">3–5 Business Days</strong>
          </div>

          <div className="bg-brand-ivory px-3.5 py-2 rounded-xl border border-brand-sage-light">
            <span className="text-gray-400 block text-[9px] uppercase font-bold">Payment Status</span>
            <strong className="text-emerald-700 text-xs sm:text-sm">{order.paymentStatus} ({order.paymentMethod.toUpperCase()})</strong>
          </div>
        </div>
      </div>

      {/* Visual Tracking Timeline */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-brand-sage-light shadow-sm space-y-5 mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brand-sage-light/50 pb-3">
          <h2 className="font-serif font-bold text-base sm:text-lg text-brand-emerald flex items-center space-x-2">
            <Truck className="w-5 h-5 text-brand-gold shrink-0" />
            <span>Delivery Tracking Progress</span>
          </h2>
          {order.trackingNumber && (
            <span className="text-[11px] sm:text-xs text-brand-charcoal-light font-medium bg-brand-ivory px-2.5 py-1 rounded-lg border">
              Courier: <strong>{order.courier || "Blue Dart"}</strong> (#{order.trackingNumber})
            </span>
          )}
        </div>

        {isCancelled ? (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center text-xs font-semibold">
            This order has been cancelled.
          </div>
        ) : (
          <div>
            {/* Desktop Horizontal Stepper (md & up) */}
            <div className="hidden md:block relative pt-4 pb-2">
              <div className="grid grid-cols-6 gap-1 text-center relative z-10">
                {STAGES.map((stage, idx) => {
                  const isPassed = currentStageIndex >= idx;
                  const isCurrent = currentStageIndex === idx;

                  return (
                    <div key={stage.key} className="flex flex-col items-center">
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? "bg-brand-emerald text-white ring-4 ring-brand-sage-light shadow-md"
                            : isPassed
                            ? "bg-brand-emerald text-white"
                            : "bg-gray-100 text-gray-400 border border-gray-200"
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-5 h-5 text-brand-gold" /> : idx + 1}
                      </div>

                      <span
                        className={`text-xs mt-2 font-medium leading-tight ${
                          isCurrent
                            ? "text-brand-emerald font-bold"
                            : isPassed
                            ? "text-brand-charcoal font-semibold"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Connecting line */}
              <div className="absolute top-8 left-8 right-8 h-1 bg-gray-200 -z-0">
                <div
                  className="h-full bg-brand-emerald transition-all duration-700"
                  style={{
                    width: `${Math.max(0, (currentStageIndex / (STAGES.length - 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Mobile Vertical Stepper (below md) */}
            <div className="md:hidden space-y-3 pt-2">
              {STAGES.map((stage, idx) => {
                const isPassed = currentStageIndex >= idx;
                const isCurrent = currentStageIndex === idx;

                return (
                  <div key={stage.key} className="flex items-start space-x-3 text-xs">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isCurrent
                          ? "bg-brand-emerald text-white ring-2 ring-brand-gold shadow"
                          : isPassed
                          ? "bg-brand-emerald text-white"
                          : "bg-gray-100 text-gray-400 border"
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4 text-brand-gold" /> : idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold ${isCurrent ? "text-brand-emerald text-sm" : isPassed ? "text-brand-charcoal" : "text-gray-400"}`}>
                        {stage.label}
                        {isCurrent && <span className="ml-2 text-[10px] bg-brand-gold text-brand-emerald px-1.5 py-0.2 rounded font-semibold">Current</span>}
                      </p>
                      <p className="text-[11px] text-gray-500">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Detailed Timeline Events */}
        {order.timeline && order.timeline.length > 0 && (
          <div className="bg-brand-ivory p-3.5 sm:p-4 rounded-2xl border border-brand-sage-light/60 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-brand-charcoal">
              Status Activity Log
            </h4>
            <div className="divide-y divide-brand-sage-light/40 space-y-2">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="pt-2 flex items-start justify-between text-xs">
                  <div>
                    <span className="font-semibold text-brand-emerald">{event.status}</span>
                    <p className="text-brand-charcoal-light text-[11px]">{event.note}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-3">
                    {event.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Order Itemized Breakdown & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 mb-8">
        {/* Ordered Jewellery */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-sage-light shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-sm text-brand-emerald flex items-center space-x-1.5 border-b pb-2.5">
            <Package className="w-4 h-4 text-brand-gold" />
            <span>Ordered Pieces ({order.items.length})</span>
          </h3>
          <div className="space-y-2.5 divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="pt-2 flex items-center space-x-3 text-xs">
                <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden border border-brand-sage-light">
                  <SafeImage
                    src={item.image}
                    alt={item.productName}
                    category="Jewellery"
                    aspectRatio="aspect-square"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-brand-charcoal truncate">{item.productName}</p>
                  <p className="text-[11px] text-brand-charcoal-muted">
                    Size: <strong>{item.size}</strong> • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-brand-charcoal font-poppins shrink-0">
                  ₹{(item.totalPrice || item.unitPrice * item.quantity).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="pt-3 border-t border-brand-sage-light/60 text-xs space-y-1">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>₹{order.subtotal?.toLocaleString("en-IN")}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-brand-gold-dark font-medium">
                <span>Discount ({order.couponApplied})</span>
                <span>- ₹{order.discount?.toLocaleString("en-IN")}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>{order.shipping === 0 ? "FREE" : `₹${order.shipping}`}</span>
            </div>
            <div className="flex justify-between font-bold text-brand-emerald text-sm pt-2 border-t">
              <span>Total Paid</span>
              <span className="font-poppins">₹{order.total?.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-brand-sage-light shadow-sm space-y-3">
          <h3 className="font-serif font-bold text-sm text-brand-emerald flex items-center space-x-1.5 border-b pb-2.5">
            <MapPin className="w-4 h-4 text-brand-gold" />
            <span>Delivery Destination</span>
          </h3>
          <div className="text-xs space-y-1 text-brand-charcoal leading-relaxed">
            <p className="font-bold text-sm text-brand-emerald">
              {order.addressSnapshot?.fullName || order.customerName}
            </p>
            <p className="text-brand-charcoal-light">{order.addressSnapshot?.street}</p>
            <p className="text-brand-charcoal-light">
              {order.addressSnapshot?.city}, {order.addressSnapshot?.state} - <strong>{order.addressSnapshot?.pincode}</strong>
            </p>
            <p className="text-gray-500 pt-1">
              Contact Phone: {order.addressSnapshot?.phone || order.customerPhone}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onContinueShopping}
          className="min-h-[44px] px-6 py-2.5 rounded-xl bg-brand-emerald hover:bg-brand-emerald-light text-white text-xs sm:text-sm font-bold tracking-wide transition shadow-luxury flex items-center space-x-2"
        >
          <ShoppingBag className="w-4 h-4 text-brand-gold" />
          <span>Continue Shopping</span>
        </button>

        <button
          onClick={onViewProfile}
          className="min-h-[44px] px-6 py-2.5 rounded-xl border-2 border-brand-emerald text-brand-emerald hover:bg-brand-sage/15 text-xs sm:text-sm font-bold transition flex items-center space-x-2"
        >
          <span>View Orders in Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
