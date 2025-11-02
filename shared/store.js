



import { autoCleanStorage } from './auto-clean-storage.js';
autoCleanStorage();


const DEFAULT_PRODUCTS = [
  {
    id: "p-iph-17",
    title: "iPhone 17",
    price: 150,
    image: "imgs/IP.png",
    category: "iphone",
  },
  {
    id: "p-iph-17p",
    title: "iPhone 17 Pro",
    price: 220,
    image: "imgs/IP2.png",
    category: "iphone",
  },
  {
    id: "p-lap-m1",
    title: "MacBook Air M1",
    price: 999,
    image: "imgs/mac air m1.jpg",
    category: "laptop",
  },
  {
    id: "p-lap-m3",
    title: "MacBook Pro M3",
    price: 1899,
    image: "imgs/mac air.png",
    category: "laptop",
  },
  {
    id: "p-air-3",
    title: "AirPods 3rd Gen",
    price: 199,
    image: "imgs/air.png",
    category: "airpods",
  },
  {
    id: "p-air-pro",
    title: "AirPods Pro 2",
    price: 249,
    image: "imgs/Airpodes.webp",
    category: "airpods",
  },
  {
    id: "p-watch-9",
    title: "Apple Watch Series 9",
    price: 399,
    image: "imgs/applewatch series9.png",
    category: "watch",
  },
  {
    id: "p-ultra",
    title: "Apple Watch Ultra",
    price: 799,
    image: "imgs/apple watch ultra.png",
    category: "watch",
  },
  {
    id: "p-vision",
    title: "Apple Vision Pro",
    price: 3499,
    image: "imgs/apple vision.jpg",
    category: "vision",
  },
  {
    id: "p-tv-55",
    title: "Apple TV",
    price: 899,
    image: "imgs/apple tv.jpg",
    category: "tv",
  },
];


const initializeDefaultProducts = () => {
  const existingProducts = localStorage.getItem("allProducts");
  if (!existingProducts) {

    const productsForStorage = DEFAULT_PRODUCTS.map(p => ({
      id: p.id,
      name: p.title,
      price: p.price,
      image: p.image,
      category: p.category,
      quantity: 100,
      status: "Active",
      createdAt: new Date().toISOString().split("T")[0]
    }));
    localStorage.setItem("allProducts", JSON.stringify(productsForStorage));
  }
};


initializeDefaultProducts();


export const getAllProductsFromStorage = () => {
  try {
    const products = JSON.parse(localStorage.getItem("allProducts")) || [];
    return products.map(p => ({
      id: p.id,
      title: p.name,
      price: parseFloat(p.price),
      image: p.image || "imgs/store.png",
      category: (p.category || "").toLowerCase(),
      quantity: parseInt(p.quantity) || 0,
      status: p.status || "Active",
      createdAt: p.createdAt,

      overview: p.overview || "",
      storage: p.storage || "",
      display: p.display || "",
      camera: p.camera || "",
      colors: p.colors || ""
    }));
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
};


export const getAllProducts = () => {
  return getAllProductsFromStorage();
};


export const PRODUCTS = getAllProducts();


export const refreshProducts = () => {
  return getAllProducts();
};

export const findProductById = (id) => {
  const allProducts = getAllProducts();
  return allProducts.find((p) => p.id === id);
};


export const getCustomProducts = () => {
  return getAllProductsFromStorage();
};


const USERS_KEY = "users";
export const getUsers = () =>
  JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
export const saveUsers = (arr) =>
  localStorage.setItem(USERS_KEY, JSON.stringify(arr));

export const isLoggedIn = () => localStorage.getItem("isLoggedIn") === "true";
export const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem("currentUser")) || null;
  } catch {
    return null;
  }
};
export const setCurrentUser = (user) =>
  localStorage.setItem("currentUser", JSON.stringify(user));
export const logout = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
};


export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

export const isAdmin = () => getUserRole() === "admin";
export const isSeller = () => getUserRole() === "seller";
export const isCustomer = () => getUserRole() === "customer" || !getUserRole();


const getUserKey = (baseKey) => {
  const user = getCurrentUser();
  const userId = user ? user.id : "guest";
  return `${baseKey}_${userId}`;
};


const CART_KEY_BASE = "cart_v1";
export const getCart = () => {
  try {
    const key = getUserKey(CART_KEY_BASE);
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};
export const setCart = (cart) => {
  const key = getUserKey(CART_KEY_BASE);
  localStorage.setItem(key, JSON.stringify(cart));
};
export function addToCart(item, qty = 1) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.id === item.id);

  const cartItem = {
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image || 'imgs/store.png',
    qty: qty
  };
  if (idx >= 0) {
    cart[idx].qty += qty;
  } else {
    cart.push(cartItem);
  }
  setCart(cart);
}
export function removeFromCart(id) {
  const cart = getCart().filter((x) => x.id !== id);
  setCart(cart);
}
export function updateQty(id, qty) {
  const cart = getCart().map((x) =>
    x.id === id ? { ...x, qty: Math.max(1, qty) } : x
  );
  setCart(cart);
}
export function cartTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, x) => s + x.price * x.qty, 0);
  return { items: cart, count: cart.reduce((s, x) => s + x.qty, 0), subtotal };
}


const ORDER_KEY_BASE = "order_v1";
export const getOrder = () => {
  try {
    const key = getUserKey(ORDER_KEY_BASE);
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch {
    return null;
  }
};
export const setOrder = (order) => {
  const key = getUserKey(ORDER_KEY_BASE);
  localStorage.setItem(key, JSON.stringify(order));
};
export const clearOrder = () => {
  const key = getUserKey(ORDER_KEY_BASE);
  localStorage.removeItem(key);
};

export function seedOrderFromCart() {
  const { items, subtotal } = cartTotals();

  const tax = Math.round(subtotal * 0.02 * 100) / 100;
  const shipping = items.length > 0 ? 10 : 0;
  const order = {
    items: items,
    pricing: { subtotal, tax, shipping, total: subtotal + tax + shipping },
    shippingInfo: null,
    deliveryMethod: null,
    payment: null,
    createdAt: Date.now(),
  };
  setOrder(order);
  return order;
}


export const createDefaultAccounts = () => {
  let users = getUsers();


  users = users.filter((u) => u.email !== "admin@store.com" && u.email !== "many@admin.com");


  const adminUser = {
    id: "admin-1",
    firstName: "Many",
    lastName: "Admin",
    email: "many@admin.com",
    password: "many",
    role: "admin",
    createdAt: Date.now(),
  };
  users.push(adminUser);


  const sellerExists = users.find((u) => u.email === "seller@store.com");
  if (!sellerExists) {
    const sellerUser = {
      id: "seller-1",
      firstName: "Seller",
      lastName: "User",
      email: "seller@store.com",
      password: "seller123",
      role: "seller",
      createdAt: Date.now(),
    };
    users.push(sellerUser);
  }

  saveUsers(users);
  console.log("✅ Admin account created: many@admin.com / many");
};


const WISHLIST_KEY_BASE = "wishlist_v1";
export const getWishlist = () => {
  try {
    const key = getUserKey(WISHLIST_KEY_BASE);
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
};
export const setWishlist = (arr) => {
  const key = getUserKey(WISHLIST_KEY_BASE);
  localStorage.setItem(key, JSON.stringify(arr));
};
export function addToWishlist(item) {
  const list = getWishlist();

  const wishlistItem = {
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image || 'imgs/store.png'
  };
  if (!list.find((x) => x.id === item.id)) list.push(wishlistItem);
  setWishlist(list);
}
export function removeFromWishlist(id) {
  setWishlist(getWishlist().filter((x) => x.id !== id));
}


export function updateUser(email, updater) {
  const users = getUsers();
  const idx = users.findIndex(
    (u) => (u.email || "").toLowerCase() === (email || "").toLowerCase()
  );
  if (idx === -1) return;
  const updated =
    typeof updater === "function"
      ? updater(users[idx])
      : { ...users[idx], ...updater };
  users[idx] = updated;
  saveUsers(users);
  const cur = getCurrentUser();
  if (cur && (cur.email || "").toLowerCase() === (email || "").toLowerCase())
    setCurrentUser({ ...cur, ...updated });
}


const ORDERS_KEY = "orders_v1";
export const getOrders = () =>
  JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]");
export const saveOrders = (arr) =>
  localStorage.setItem(ORDERS_KEY, JSON.stringify(arr));
export function addOrder(order) {
  const arr = getOrders();

  const enhancedOrder = {
    ...order,
    status: "pending",
    sellerId: "default-seller",
    sellerName: "Store Admin",
    updatedAt: Date.now(),
  };
  arr.push(enhancedOrder);
  saveOrders(arr);


  updateDashboardData();
}
export function getOrdersForUser(email) {
  const lower = (email || "").toLowerCase();
  return getOrders().filter((o) => (o.userEmail || "").toLowerCase() === lower);
}
export function getOrdersForSeller(sellerId) {
  return getOrders().filter((o) => o.sellerId === sellerId);
}
export function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const orderIndex = orders.findIndex((o) => o.id === orderId);
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = Date.now();
    saveOrders(orders);
    updateDashboardData();
  }
}


export function getDashboardStats() {
  const orders = getOrders();
  const users = getUsers();

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.pricing?.total || 0),
    0
  );
  const totalUsers = users.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return {
    totalOrders,
    totalRevenue,
    totalUsers,
    pendingOrders,
    completedOrders,
  };
}


function updateDashboardData() {

  window.dispatchEvent(
    new CustomEvent("ordersUpdated", {
      detail: { orders: getOrders(), stats: getDashboardStats() },
    })
  );
}



export const PRODUCT_DETAILS = {
  "p-iph-17": {
    images: [
      "../imgs/IP.png",
      "../imgs/IP2.png",
      "../imgs/IP3.png",
      "../imgs/IP4.png",
    ],
    overview:
      "iPhone 17 delivers blazing performance, great battery life, and a bright OLED display in a sleek design.",
    storage: "128GB, 256GB, 512GB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#1e40af" },
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "48MP Main, 12MP Ultra‑Wide",
    display: "6.1‑inch OLED, 120Hz",
  },
  "p-iph-17p": {
    images: ["../imgs/IP2.png", "../imgs/IP3.png", "../imgs/IP4.png"],
    overview:
      "iPhone 17 Pro adds a Pro‑grade camera system and a high‑refresh ProMotion display for smooth visuals.",
    storage: "256GB, 512GB, 1TB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "Blue", hex: "#1e40af" },
      { name: "Gold", hex: "#f59e0b" }
    ]),
    camera: "48MP Main, 12MP Ultra‑Wide, 12MP Telephoto",
    display: "6.7‑inch ProMotion OLED, 120Hz",
  },
  "p-lap-m1": {
    images: ["../imgs/mac%20air%20m1.jpg", "../imgs/mac%20air.png"],
    overview:
      "MacBook Air with M1 chip is thin, silent, and fast — perfect for everyday productivity and study.",
    storage: "256GB, 512GB",
    colors: JSON.stringify([
      { name: "White", hex: "#ffffff" },
      { name: "Gold", hex: "#f59e0b" }
    ]),
    camera: "720p FaceTime HD camera",
    display: "13.3‑inch Retina display",
  },
  "p-lap-m3": {
    images: ["../imgs/mac.png", "../imgs/mac%20air.png"],
    overview:
      "MacBook Pro with Apple silicon for creators who need sustained performance and long battery life.",
    storage: "512GB, 1TB, 2TB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "1080p FaceTime HD camera",
    display: "14‑inch Liquid Retina XDR",
  },
  "p-air-3": {
    images: ["../imgs/air.png"],
    overview:
      "AirPods (3rd generation) bring Spatial Audio, adaptive EQ, and a comfortable fit.",
    storage: "—",
    colors: JSON.stringify([
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "—",
    display: "—",
  },
  "p-air-pro": {
    images: ["../imgs/Airpodes.webp"],
    overview:
      "AirPods Pro (2nd gen) offer active noise cancellation with Transparency mode and great sound.",
    storage: "—",
    colors: JSON.stringify([
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "—",
    display: "—",
  },
  "p-watch-9": {
    images: ["../imgs/applewatch%20series9.png"],
    overview:
      "Apple Watch Series 9 helps you stay connected, active, and healthy with powerful new gestures.",
    storage: "64GB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "—",
    display: "Always‑On Retina display",
  },
  "p-ultra": {
    images: ["../imgs/apple%20watch%20ultra.png"],
    overview:
      "Apple Watch Ultra is the most rugged and capable Apple Watch ever for outdoor adventures.",
    storage: "64GB",
    colors: JSON.stringify([
      { name: "Gold", hex: "#f59e0b" },
      { name: "Black", hex: "#000000" }
    ]),
    camera: "—",
    display: "Always‑On Retina display",
  },
  "p-vision": {
    images: ["../imgs/apple%20vision.jpg", "../imgs/apple%20vision1.jpg"],
    overview:
      "Apple Vision Pro introduces spatial computing: work, watch, and connect in an infinite canvas.",
    storage: "256GB, 512GB, 1TB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#ffffff" }
    ]),
    camera: "3D camera for spatial photos and videos",
    display: "micro‑OLED display system",
  },
  "p-tv-55": {
    images: ["../imgs/apple%20tv.jpg"],
    overview:
      "Apple TV brings your favorite shows and apps with powerful performance and Siri Remote.",
    storage: "64GB, 128GB",
    colors: JSON.stringify([
      { name: "Black", hex: "#000000" }
    ]),
    camera: "—",
    display: "4K HDR output",
  },
};
