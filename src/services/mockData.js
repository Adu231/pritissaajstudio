export const INITIAL_BANNERS = [
  {
    id: "ban_1",
    title: "The Royal Saaj Heritage Collection",
    subtitle: "Handcrafted traditional Maharashtrian & temple jewellery celebrating timeless Indian elegance.",
    imageUrl: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1600&auto=format&fit=crop",
    ctaText: "Shop The Royal Collection",
    link: "catalogue?category=Necklaces",
    displayOrder: 1,
    isActive: true,
  },
  {
    id: "ban_2",
    title: "Handcrafted Bridal & Festive Splendour",
    subtitle: "Make every auspicious occasion truly unforgettable with our heirloom bridal sets.",
    imageUrl: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1600&auto=format&fit=crop",
    ctaText: "Explore Bridal Sets",
    link: "catalogue?category=Bridal Sets",
    displayOrder: 2,
    isActive: true,
  },
  {
    id: "ban_3",
    title: "Heritage Bangles & Kada Collection",
    subtitle: "Precision handcrafted bangles available in authentic sizes 2.4 to 2.10 with verified size guide.",
    imageUrl: "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=1600&auto=format&fit=crop",
    ctaText: "Discover Bangles & Size Guide",
    link: "catalogue?category=Bangles",
    displayOrder: 3,
    isActive: true,
  },
];

export const INITIAL_PRODUCTS = [
  {
    id: "prod_1",
    name: "Classic 21-Pan Maharashtrian Kolhapuri Saaj",
    category: "Necklaces",
    price: 4999,
    discountPrice: 3899,
    description: "An authentic 21-leaf handcrafted Kolhapuri Saaj necklace crafted with exquisite micro-gold plating and traditional motifs representing sun, moon, peacock, and floral leaves. Includes green silk dori with adjustable length.",
    metal: "24K Micro Gold Plated Brass",
    weight: "48 grams",
    images: [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Standard (18-20\")", "Long (24-26\")"],
    stockBySize: {
      "Standard (18-20\")": 14,
      "Long (24-26\")": 6,
    },
    rating: 4.9,
    reviewCount: 38,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_2",
    name: "Royal Pichodi Heritage Bangles (Set of 2)",
    category: "Bangles",
    price: 3499,
    discountPrice: 2799,
    description: "Traditional Maharashtrian Pichodi bangles studded with radiant synthetic ruby stones and seed pearls. Features delicate floral cutwork that slips comfortably over the wrist for wedding and festive wear.",
    metal: "Matte Antique Gold Plating",
    weight: "52 grams (pair)",
    images: [
      "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    stockBySize: {
      "2.4": 8,
      "2.6": 12,
      "2.8": 4,
      "2.10": 0, // Out of stock to test validation
    },
    rating: 4.8,
    reviewCount: 29,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_3",
    name: "Heritage Motyanchi Belpan Thushi Choker",
    category: "Necklaces",
    price: 2899,
    discountPrice: 2299,
    description: "Intricately woven pearl thushi choker featuring gold beads and hand-embellished belpan pendant. Fitted with soft velvet-backed adjustable cord for supreme comfort.",
    metal: "High Gloss Gold Polish & Fresh Water Pearls",
    weight: "32 grams",
    images: [
      "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Adjustable Free Size"],
    stockBySize: {
      "Adjustable Free Size": 20,
    },
    rating: 4.7,
    reviewCount: 19,
    isBestseller: false,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_4",
    name: "Temple Kemp Stone Jhumkas with Ear Chains",
    category: "Earrings",
    price: 1999,
    discountPrice: 1549,
    description: "South Indian temple inspired peacock jhumka earrings set with ruby-emerald colored kemp stones and delicate pearl cluster drops. Comes with detachable decorative ear chains (maatilu).",
    metal: "Antique Temple Gold Plating",
    weight: "28 grams",
    images: [
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Standard"],
    stockBySize: {
      "Standard": 16,
    },
    rating: 4.9,
    reviewCount: 42,
    isBestseller: true,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_5",
    name: "Kundan & Uncut Polki Openable Kada",
    category: "Bangles",
    price: 3199,
    discountPrice: 2499,
    description: "A statement single openable kada featuring high-grade uncut polki stones set in meenakari gold finish. Has an easy-to-use screw clasp mechanism.",
    metal: "22K Gold Finish with Meenakari reverse",
    weight: "44 grams",
    images: [
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["2.4", "2.6", "2.8"],
    stockBySize: {
      "2.4": 5,
      "2.6": 9,
      "2.8": 7,
    },
    rating: 4.6,
    reviewCount: 15,
    isBestseller: false,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_6",
    name: "Royal Rajwada Rani Haar & Jhumka Set",
    category: "Bridal Sets",
    price: 8999,
    discountPrice: 7299,
    description: "Grand bridal necklace set featuring a multi-layered rani haar, matching ornate choker, grand statement jhumkas, and a delicate maang tikka. Handcrafted for the bride who cherishes heritage splendour.",
    metal: "Heritage Gold Polish with Hydro Gemstones",
    weight: "140 grams",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Bridal Deluxe Set"],
    stockBySize: {
      "Bridal Deluxe Set": 7,
    },
    rating: 5.0,
    reviewCount: 22,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_7",
    name: "Mayuri Peacock Polki Statement Ring",
    category: "Rings",
    price: 1499,
    discountPrice: 1199,
    description: "An adjustable royal cocktail ring sculpted into an intricate dancing peacock silhouette with emerald green eye and polki crystal feathers.",
    metal: "Antique Gold Plated Brass",
    weight: "16 grams",
    images: [
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size (Adjustable)"],
    stockBySize: {
      "Free Size (Adjustable)": 25,
    },
    rating: 4.8,
    reviewCount: 18,
    isBestseller: false,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_8",
    name: "Traditional Maharashtrian Tode Bangles (Pair)",
    category: "Bangles",
    price: 4299,
    discountPrice: 3599,
    description: "Solid traditional Tode bangles embossed with floral repoussé carvings and authentic spherical ghungroo edging. Essential heirloom piece for auspicious occasions.",
    metal: "Heavy Brass with 24K Micro Gold Plate",
    weight: "68 grams",
    images: [
      "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["2.4", "2.6", "2.8", "2.10"],
    stockBySize: {
      "2.4": 3,
      "2.6": 6,
      "2.8": 2,
      "2.10": 1,
    },
    rating: 4.9,
    reviewCount: 31,
    isBestseller: true,
    isFeatured: true,
    isActive: true,
  },
  {
    id: "prod_9",
    name: "Padma Chandbali Earrings with Pearls",
    category: "Earrings",
    price: 2199,
    discountPrice: 1749,
    description: "Handcrafted crescent moon Chandbali earrings adorned with lotus carving, ruby red meenakari work, and dangling river pearls.",
    metal: "Yellow Gold Finish",
    weight: "24 grams",
    images: [
      "https://images.unsplash.com/photo-1635767798638-3e25273a8236?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Standard"],
    stockBySize: {
      "Standard": 18,
    },
    rating: 4.7,
    reviewCount: 14,
    isBestseller: false,
    isFeatured: false,
    isActive: true,
  },
  {
    id: "prod_10",
    name: "Navratna Floral Cluster Cocktail Ring",
    category: "Rings",
    price: 1899,
    discountPrice: 1499,
    description: "Nine auspicious planetary gemstones arranged in an ornate lotus bloom. Designed with smooth comfort-fit shank.",
    metal: "Matte Gold Finish",
    weight: "18 grams",
    images: [
      "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?q=80&w=800&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=800&auto=format&fit=crop"
    ],
    sizes: ["Free Size (Adjustable)"],
    stockBySize: {
      "Free Size (Adjustable)": 15,
    },
    rating: 4.8,
    reviewCount: 11,
    isBestseller: false,
    isFeatured: false,
    isActive: true,
  }
];

export const INITIAL_CATEGORIES = [
  { id: "cat_1", name: "Necklaces", image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600&auto=format&fit=crop", count: "12 Designs" },
  { id: "cat_2", name: "Bangles", image: "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=600&auto=format&fit=crop", count: "8 Designs" },
  { id: "cat_3", name: "Earrings", image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=600&auto=format&fit=crop", count: "10 Designs" },
  { id: "cat_4", name: "Rings", image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600&auto=format&fit=crop", count: "6 Designs" },
  { id: "cat_5", name: "Bridal Sets", image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600&auto=format&fit=crop", count: "5 Sets" },
];

export const BANGLE_SIZE_GUIDE = [
  { size: "2.4", diameterMm: "57.2 mm", diameterInches: "2.25 inches", circMm: "179.8 mm", handCircInches: "7.0 inches", wristType: "Extra Small / Slim Wrist" },
  { size: "2.6", diameterMm: "60.3 mm", diameterInches: "2.375 inches", circMm: "189.5 mm", handCircInches: "7.5 inches", wristType: "Standard / Medium (Most Common)" },
  { size: "2.8", diameterMm: "63.5 mm", diameterInches: "2.5 inches", circMm: "199.5 mm", handCircInches: "7.8 inches", wristType: "Broad Wrist" },
  { size: "2.10", diameterMm: "66.7 mm", diameterInches: "2.625 inches", circMm: "209.5 mm", handCircInches: "8.25 inches", wristType: "Extra Broad Wrist" },
];

export const INITIAL_COUPONS = [
  {
    code: "SAAJ10",
    discountType: "percentage",
    discountValue: 10,
    minOrderValue: 1999,
    description: "10% OFF on all orders above ₹1,999",
    validUntil: "2027-12-31",
    isActive: true,
  },
  {
    code: "PRITI500",
    discountType: "fixed",
    discountValue: 500,
    minOrderValue: 3499,
    description: "Flat ₹500 OFF on festive orders above ₹3,499",
    validUntil: "2027-12-31",
    isActive: true,
  },
  {
    code: "ROYAL20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 4999,
    description: "20% OFF on luxury jewellery above ₹4,999",
    validUntil: "2027-12-31",
    isActive: true,
  }
];

export const INITIAL_USERS = [
  {
    id: "usr_cust_1",
    name: "Pooja Deshmukh",
    email: "pooja@example.com",
    phone: "+91 98234 56789",
    role: "customer",
    password: "password123",
    addresses: [
      {
        id: "addr_1",
        fullName: "Pooja Deshmukh",
        phone: "+91 98234 56789",
        street: "Flat 402, Royal Palms, Prabhat Road, Lane 4",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411004",
        type: "Home",
        isDefault: true,
      },
      {
        id: "addr_2",
        fullName: "Pooja D.",
        phone: "+91 98234 56789",
        street: "Tower 3, Level 5, Cyber City, Magarpatta",
        city: "Pune",
        state: "Maharashtra",
        pincode: "411028",
        type: "Work",
        isDefault: false,
      }
    ],
    createdAt: "2026-10-15T10:00:00Z"
  },
  {
    id: "usr_admin_1",
    name: "Priti Shinde",
    email: "admin@pritis-saaj.com",
    phone: "+91 98765 43210",
    role: "admin",
    password: "adminpassword",
    addresses: [],
    createdAt: "2026-01-01T08:00:00Z"
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ord_1001",
    orderNumber: "PSS-2026-8941",
    userId: "usr_cust_1",
    customerName: "Pooja Deshmukh",
    customerEmail: "pooja@example.com",
    customerPhone: "+91 98234 56789",
    items: [
      {
        productId: "prod_1",
        productName: "Classic 21-Pan Maharashtrian Kolhapuri Saaj",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=800&auto=format&fit=crop",
        size: "Standard (18-20\")",
        quantity: 1,
        unitPrice: 3899,
        totalPrice: 3899
      },
      {
        productId: "prod_4",
        productName: "Temple Kemp Stone Jhumkas with Ear Chains",
        image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=800&auto=format&fit=crop",
        size: "Standard",
        quantity: 1,
        unitPrice: 1549,
        totalPrice: 1549
      }
    ],
    addressSnapshot: {
      fullName: "Pooja Deshmukh",
      phone: "+91 98234 56789",
      street: "Flat 402, Royal Palms, Prabhat Road, Lane 4",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      type: "Home",
    },
    subtotal: 5448,
    discount: 500,
    shipping: 0,
    total: 4948,
    couponApplied: "PRITI500",
    paymentMethod: "online",
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    trackingNumber: "BD-90412891IN",
    courier: "Blue Dart Express",
    timeline: [
      { status: "Order Placed", timestamp: "2026-10-28 11:20 AM", note: "Order placed online via UPI" },
      { status: "Confirmed", timestamp: "2026-10-28 11:35 AM", note: "Payment verified & inventory allocated" },
      { status: "Processing", timestamp: "2026-10-29 09:15 AM", note: "Quality checked and luxury packed" },
      { status: "Shipped", timestamp: "2026-10-29 04:30 PM", note: "Dispatched from Pune Hub (Blue Dart)" },
      { status: "Out for Delivery", timestamp: "2026-10-31 08:30 AM", note: "Out for delivery with courier agent" },
      { status: "Delivered", timestamp: "2026-10-31 02:45 PM", note: "Delivered to customer with OTP" },
    ],
    createdAt: "2026-10-28T11:20:00Z"
  },
  {
    id: "ord_1002",
    orderNumber: "PSS-2026-9112",
    userId: "usr_cust_1",
    customerName: "Pooja Deshmukh",
    customerEmail: "pooja@example.com",
    customerPhone: "+91 98234 56789",
    items: [
      {
        productId: "prod_2",
        productName: "Royal Pichodi Heritage Bangles (Set of 2)",
        image: "https://images.unsplash.com/photo-1611591475841-f76ee30c797d?q=80&w=800&auto=format&fit=crop",
        size: "2.6",
        quantity: 1,
        unitPrice: 2799,
        totalPrice: 2799
      }
    ],
    addressSnapshot: {
      fullName: "Pooja Deshmukh",
      phone: "+91 98234 56789",
      street: "Flat 402, Royal Palms, Prabhat Road, Lane 4",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411004",
      type: "Home",
    },
    subtotal: 2799,
    discount: 279.9,
    shipping: 0,
    total: 2519.1,
    couponApplied: "SAAJ10",
    paymentMethod: "cod",
    paymentStatus: "Pending on Delivery",
    orderStatus: "Shipped",
    trackingNumber: "DEL-77291120IN",
    courier: "Delhivery Logistics",
    timeline: [
      { status: "Order Placed", timestamp: "2026-11-02 03:10 PM", note: "COD order placed" },
      { status: "Confirmed", timestamp: "2026-11-02 04:00 PM", note: "Confirmed by admin" },
      { status: "Processing", timestamp: "2026-11-03 10:00 AM", note: "Packed in velvet safety pouch" },
      { status: "Shipped", timestamp: "2026-11-03 05:20 PM", note: "Handed over to Delhivery logistics" },
    ],
    createdAt: "2026-11-02T15:10:00Z"
  }
];

export const INITIAL_REVIEWS = [
  {
    id: "rev_1",
    productId: "prod_1",
    userId: "usr_cust_1",
    userName: "Pooja Deshmukh",
    rating: 5,
    title: "Pure Royal Maharashtrian Vibe!",
    comment: "The finish of this Kolhapuri Saaj is beyond expectations! Wore it for Gauri Ganpati festival and received countless compliments. The green dori is soft and didn't cause any skin irritation. Highly recommend Priti's Saaj Studio!",
    isApproved: true,
    createdAt: "2026-11-01T12:00:00Z",
  },
  {
    id: "rev_2",
    productId: "prod_2",
    userId: "usr_cust_2",
    userName: "Snehal Kulkarni",
    rating: 5,
    title: "Accurate size and stunning craftsmanship",
    comment: "I followed the size guide and ordered size 2.6 for the Pichodi bangles. The fit is perfect. The stones sparkle like real rubies and the weight feels authentic.",
    isApproved: true,
    createdAt: "2026-10-20T14:30:00Z",
  },
  {
    id: "rev_3",
    productId: "prod_4",
    userId: "usr_cust_3",
    userName: "Radhika Joshi",
    rating: 5,
    title: "Mesmerizing temple design",
    comment: "The jhumkas are gorgeous, lightweight enough to wear for 6 hours straight at a wedding. Loved the packaging too!",
    isApproved: true,
    createdAt: "2026-10-25T09:10:00Z",
  }
];

