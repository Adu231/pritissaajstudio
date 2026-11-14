/**
 * WhatsApp Order & Inquiry Utilities for Priti's Saaj Studio
 * Target WhatsApp Business Number: +91 93078 68286
 */

export const WHATSAPP_CONFIG = {
  phone: "919307868286",
  displayPhone: "+91 93078 68286",
  studioName: "Priti's Saaj Studio",
};

const formatPrice = (val) => `₹${(Number(val) || 0).toLocaleString("en-IN")}`;

const NUMBER_EMOJIS = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];

/**
 * Builds a structured, luxury-formatted WhatsApp message for a completed order
 * containing multiple products, sizes, quantities, totals, and delivery details.
 */
export const buildOrderWhatsAppMessage = (order) => {
  if (!order) return "";

  const items = order.items || [];
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const orderNumber = order.orderNumber || order.id || "PSS-ONLINE";
  const dateStr = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

  let msg = `👑 *NEW ORDER — PRITI'S SAAJ STUDIO* 👑\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📋 *Order Number:* ${orderNumber}\n`;
  msg += `📅 *Date:* ${dateStr}\n`;
  msg += `💳 *Payment Method:* ${order.paymentMethod === "cod" ? "Cash on Delivery (COD)" : "Prepaid Online (UPI/Card)"}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `🛍️ *ORDERED ITEMS (${itemCount} piece${itemCount > 1 ? "s" : ""}):*\n`;
  msg += `─────────────────────\n`;

  items.forEach((item, index) => {
    const numEmoji = NUMBER_EMOJIS[index] || `🔹`;
    const itemTotal = item.totalPrice || (item.unitPrice * item.quantity);
    msg += `${numEmoji} *${item.productName || item.name}*\n`;
    if (item.category) msg += `   • Category: ${item.category}\n`;
    msg += `   • Size: *${item.size || "Standard"}*\n`;
    msg += `   • Qty: ${item.quantity} × ${formatPrice(item.unitPrice)} = *${formatPrice(itemTotal)}*\n\n`;
  });

  msg += `─────────────────────\n`;
  msg += `💰 *ORDER SUMMARY:*\n`;
  msg += `• Bag Subtotal: ${formatPrice(order.subtotal)}\n`;
  if (order.discount > 0) {
    msg += `• Coupon Discount: -${formatPrice(order.discount)} ${order.couponApplied ? `(${order.couponApplied})` : ""}\n`;
  }
  msg += `• Delivery Charges: ${order.shipping === 0 ? "FREE (Complimentary)" : formatPrice(order.shipping)}\n`;
  msg += `⭐ *TOTAL PAYABLE: ${formatPrice(order.total)}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Delivery Address Details
  const addr = order.addressSnapshot || {};
  const customerName = addr.fullName || order.customerName || "Valued Customer";
  const phone = addr.phone || order.customerPhone || "";
  const addressLine = addr.street || "";
  const cityState = [addr.city, addr.state].filter(Boolean).join(", ");
  const pincode = addr.pincode ? ` - ${addr.pincode}` : "";

  msg += `📍 *DELIVERY DESTINATION:*\n`;
  msg += `• Customer Name: *${customerName}*\n`;
  if (phone) msg += `• Contact Phone: *${phone}*\n`;
  if (addressLine) msg += `• Address: ${addressLine}\n`;
  if (cityState || pincode) msg += `• City / State: ${cityState}${pincode}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  msg += `💬 _Hello Priti's Saaj Studio, I have placed this order on your website. Please confirm dispatch and tracking details. Thank you!_`;

  return msg;
};

/**
 * Builds a structured WhatsApp message for multiple items in the Cart
 * before or during checkout.
 */
export const buildCartWhatsAppMessage = ({
  items = [],
  subtotal = 0,
  discount = 0,
  shipping = 0,
  total = 0,
  couponApplied = null,
  user = null,
}) => {
  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 1), 0);

  let msg = `👑 *ORDER INQUIRY — PRITI'S SAAJ STUDIO* 👑\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Hello! I would like to order the following jewellery pieces from your website:\n\n`;

  msg += `🛍️ *SELECTED ITEMS (${itemCount} piece${itemCount > 1 ? "s" : ""}):*\n`;
  msg += `─────────────────────\n`;

  items.forEach((item, index) => {
    const numEmoji = NUMBER_EMOJIS[index] || `🔹`;
    const itemTotal = item.unitPrice * item.quantity;
    msg += `${numEmoji} *${item.name}*\n`;
    if (item.category) msg += `   • Category: ${item.category}\n`;
    msg += `   • Size: *${item.size || "Standard"}*\n`;
    msg += `   • Quantity: ${item.quantity}\n`;
    msg += `   • Price: ${formatPrice(item.unitPrice)} × ${item.quantity} = *${formatPrice(itemTotal)}*\n\n`;
  });

  msg += `─────────────────────\n`;
  msg += `💰 *ESTIMATED TOTAL:*\n`;
  msg += `• Subtotal: ${formatPrice(subtotal)}\n`;
  if (discount > 0) {
    msg += `• Applied Discount: -${formatPrice(discount)} ${couponApplied ? `(${couponApplied.code})` : ""}\n`;
  }
  msg += `• Delivery: ${shipping === 0 ? "FREE" : formatPrice(shipping)}\n`;
  msg += `⭐ *Total Payable: ${formatPrice(total || subtotal)}*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

  if (user) {
    const defaultAddr = user.addresses?.find((a) => a.isDefault) || user.addresses?.[0];
    msg += `👤 *CUSTOMER DETAILS:*\n`;
    msg += `• Name: *${user.name}*\n`;
    if (user.phone) msg += `• Phone: *${user.phone}*\n`;
    if (defaultAddr) {
      msg += `• City / Address: ${defaultAddr.street}, ${defaultAddr.city}, ${defaultAddr.state} - ${defaultAddr.pincode}\n`;
    }
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  }

  msg += `💬 _Please let me know how to proceed with payment and delivery. Thank you!_`;

  return msg;
};

/**
 * Builds a quick WhatsApp message for a single product from ProductDetailModal
 */
export const buildProductWhatsAppMessage = ({
  product,
  selectedSize,
  quantity = 1,
}) => {
  if (!product) return "";
  const unitPrice = product.discountPrice || product.price;
  const totalPrice = unitPrice * quantity;

  let msg = `👑 *JEWELLERY INQUIRY — PRITI'S SAAJ STUDIO* 👑\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `Hello! I am interested in purchasing this handcrafted piece:\n\n`;
  msg += `✨ *${product.name}*\n`;
  msg += `• Category: ${product.category}\n`;
  msg += `• Selected Size: *${selectedSize || "Standard"}*\n`;
  msg += `• Quantity: ${quantity}\n`;
  msg += `• Price: ${formatPrice(unitPrice)} ${quantity > 1 ? `× ${quantity} = *${formatPrice(totalPrice)}*` : ""}\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;
  msg += `💬 _Is this design in stock and ready to dispatch to my location? Thank you!_`;

  return msg;
};

/**
 * Returns a direct WhatsApp Web / App universal URL
 */
export const getWhatsAppUrl = (message, phone = WHATSAPP_CONFIG.phone) => {
  const cleanPhone = String(phone).replace(/\D/g, "");
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
};

/**
 * Opens WhatsApp in a new window/tab safely
 */
export const openWhatsApp = (message, phone = WHATSAPP_CONFIG.phone) => {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
};

