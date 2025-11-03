
import { getWishlist, getCart, isLoggedIn } from "./store.js";

// Update navbar counts for wishlist and cart
export function updateNavbarCounts() {
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

// Initialize counts on DOM load and set interval to update

document.addEventListener("DOMContentLoaded", () => {
  updateNavbarCounts();
  

  setInterval(updateNavbarCounts, 2000);
});

// Expose function to global scope
window.updateNavbarCounts = updateNavbarCounts;

