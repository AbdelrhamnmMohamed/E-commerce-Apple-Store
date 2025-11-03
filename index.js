

import { addToWishlist, getWishlist, getCart, isLoggedIn } from "./shared/store.js";
import { showLoginPrompt } from "./shared/login-prompt.js";


function updateNavbarCounts() {
  const wishlistBadge = document.getElementById("wishlistCount");
  const cartBadge = document.getElementById("cartCount");
  
  // Only show counts if user is logged in
  if (!isLoggedIn()) {
    if (wishlistBadge) wishlistBadge.style.display = "none";
    if (cartBadge) cartBadge.style.display = "none";
    return;
  }
  
  const wishlistCount = getWishlist().length;
  const cartCount = getCart().reduce((sum, item) => sum + item.qty, 0);
  
  if (wishlistBadge) {
    if (wishlistCount > 0) {
      wishlistBadge.textContent = wishlistCount;
      wishlistBadge.style.display = "inline-block";
    } else {
      wishlistBadge.style.display = "none";
    }
  }
  
  if (cartBadge) {
    if (cartCount > 0) {
      cartBadge.textContent = cartCount;
      cartBadge.style.display = "inline-block";
    } else {
      cartBadge.style.display = "none";
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {

  updateNavbarCounts();

  document.querySelectorAll("a.home-view-details[data-id]").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const id = a.getAttribute("data-id");
      if (!id) return;
      window.location.href = `product details/product-details.html?id=${encodeURIComponent(
        id
      )}`;
    });
  });


  document.querySelectorAll(".home-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Check if user is logged in
      if (!isLoggedIn()) {
        const shouldLogin = await showLoginPrompt('add items to your wishlist');
        if (shouldLogin) {
          window.location.href = "login/login.html";
        }
        return;
      }
      
      const id = btn.getAttribute("data-id");
      const title = btn.getAttribute("data-title");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      
      addToWishlist({ id, title, price, image });
      

      const icon = btn.querySelector("i");
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid", "text-danger");
      

      setTimeout(() => updateNavbarCounts(), 100);
    });
  });


  try {
    const el = document.getElementById("userNameDisplay");
    const stored = localStorage.getItem("currentUser");
    if (el && stored) {
      const user = JSON.parse(stored);
      if (user?.name) el.textContent = user.name;
    }
  } catch {}


  try {
    const cards = document.querySelectorAll(".explore .product-card");
    cards.forEach((card) => {
      const label = card
        .querySelector(".product-info span")
        ?.textContent?.trim()
        .toLowerCase();
      let cat = null;
      if (!label) return;
      if (label.includes("iphone") || label.includes("i phone")) cat = "iphone";
      else if (label.includes("mac")) cat = "laptop";
      else if (label.includes("air") && label.includes("pod")) cat = "airpods";
      else if (label.includes("watch")) cat = "watch";
      else if (label.includes("vision")) cat = "vision";
      else if (label === "tv") cat = "tv";
      if (!cat) return;
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        window.location.href = `products/products.html?cat=${encodeURIComponent(
          cat
        )}`;
      });
    });
  } catch {}
});
