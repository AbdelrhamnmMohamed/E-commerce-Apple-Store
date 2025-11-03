

import {
  getAllProducts,
  addToCart,
  isLoggedIn,
  addToWishlist,
} from "../shared/store.js";
import { showLoginPrompt } from "../shared/login-prompt.js";


const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Product card template
function cardTemplate(p) {

  let imagePath = p.image;
  if (!imagePath.startsWith('data:') && !imagePath.startsWith('http')) {
    imagePath = '../' + imagePath.replace(/^\.\.\//, '');
  }
  
  return `
    <div class="card m-2 position-relative" style="width: 18rem;">
      <button class="btn position-absolute btn-wishlist" style="top: 10px; right: 10px; z-index: 10; background: none; border: none; padding: 5px; font-size: 24px; color: #666;" title="Add to wishlist" data-id="${p.id}"><i class="fa-regular fa-heart"></i></button>
      <div class="ratio ratio-4x3 p-3 bg-white">
        <img src="${imagePath}" class="w-100 h-100 object-fit-contain" alt="${p.title}">
      </div>
      <div class="card-body text-center">
        <h3 class="card-title">${p.title}</h3>
        <p class="card-text">Price ${p.price}$</p>
        <div class="d-grid gap-2">
          <a class="btn btn-light border view-details" data-id="${p.id}" style="color: #333;">View Details</a>
          <button class="btn btn-dark add-to-cart" data-id="${p.id}">Add to Cart</button>
        </div>
      </div>
    </div>`;
}


let state = { category: "all", search: "" };

function initFromQuery() {
  const qs = new URLSearchParams(window.location.search);
  const cat = qs.get("cat");
  const q = qs.get("search") || qs.get("q");
  if (cat) state.category = cat;
  if (q) state.search = q;
}

function render() {
  const grid = $("#productsGrid");
  const term = state.search.trim().toLowerCase();
  const allProducts = getAllProducts();
  
  // Check if there are NO products at all in storage
  if (allProducts.length === 0) {
    grid.innerHTML = `
      <div class="col-12">
        <div class="alert alert-warning text-center my-5" role="alert">
          <h4 class="alert-heading">⚠️ No Products Found!</h4>
          <p>Please refresh the page. Products should initialize automatically.</p>
          <hr>
          <button onclick="location.reload()" class="btn btn-warning mt-3">
            🔄 Refresh Page
          </button>
        </div>
      </div>
    `;
    return;
  }
  
  const filtered = allProducts.filter((p) => {
    const okCat = state.category === "all" || p.category === state.category;
    const okSearch = !term || p.title.toLowerCase().includes(term);
    const okStatus = !p.status || p.status === "Active";
    return okCat && okSearch && okStatus;
  });
  
  grid.innerHTML =
    filtered.map(cardTemplate).join("") ||
    `
    <p class="text-muted my-5">No products found matching your search.</p>
  `;
}


function setupCategoryTiles() {
  $$(".cat-tile").forEach((tile) => {
    tile.addEventListener("click", () => {
      $$(".cat-tile").forEach((t) => t.classList.remove("active"));
      tile.classList.add("active");
      state.category = tile.dataset.cat || "all";
      render();
    });
  });


  const active = document.querySelector(
    `.cat-tile[data-cat="${state.category}"]`
  );
  if (active) {
    $$(".cat-tile").forEach((t) => t.classList.remove("active"));
    active.classList.add("active");
  }
}

function setupSearch() {
  const input = $("#searchInput");
  const btn = $("#searchBtn");
  const go = () => {
    state.search = input.value;
    render();
  };
  input && input.addEventListener("input", go);
  btn && btn.addEventListener("click", go);

  if (input && state.search) input.value = state.search;
}

function setupActions() {
  const grid = $("#productsGrid");
  grid.addEventListener("click", async (e) => {
    const view = e.target.closest("a.view-details");
    const add = e.target.closest("button.add-to-cart");
    const wish = e.target.closest("button.btn-wishlist");
    if (view) {
      const id = view.dataset.id;
      window.location.href = `../product%20details/product-details.html?id=${encodeURIComponent(
        id
      )}`;
      return;
    }
    if (wish) {
      // Check if user is logged in
      if (!isLoggedIn()) {
        const shouldLogin = await showLoginPrompt('add items to your wishlist');
        if (shouldLogin) {
          window.location.href = "../login/login.html";
        }
        return;
      }
      
      const id = wish.dataset.id;
      const allProducts = getAllProducts();
      const p = allProducts.find((x) => x.id === id);
      if (!p) return;
      addToWishlist({
        id: p.id,
        title: p.title,
        price: p.price,
        image: p.image,
      });
      wish.innerHTML = '<i class="fa-solid fa-heart text-danger"></i>';
      wish.classList.add("active");
      

      if (window.updateNavbarCounts) window.updateNavbarCounts();
      return;
    }
    if (add) {
      const id = add.dataset.id;
      const allProducts = getAllProducts();
      const p = allProducts.find((x) => x.id === id);
      if (!p) return;
      if (!isLoggedIn()) {
        const shouldLogin = await showLoginPrompt('add items to your cart');
        if (shouldLogin) {
          window.location.href = "../login/login.html";
        }
        return;
      }
      addToCart(
        { id: p.id, title: p.title, price: p.price, image: p.image },
        1
      );
      

      if (window.updateNavbarCounts) window.updateNavbarCounts();
      
      window.location.href = "../cart/cart.html";
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  initFromQuery();
  setupCategoryTiles();
  setupSearch();
  setupActions();
  render();
});
