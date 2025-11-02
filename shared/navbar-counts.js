


import { getWishlist, getCart } from "./store.js";


export function updateNavbarCounts() {
  const wishlistCount = getWishlist().length;
  const cartCount = getCart().reduce((sum, item) => sum + item.qty, 0);
  
  const wishlistBadge = document.getElementById("wishlistCount");
  const cartBadge = document.getElementById("cartCount");
  
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
  

  setInterval(updateNavbarCounts, 2000);
});


window.updateNavbarCounts = updateNavbarCounts;

