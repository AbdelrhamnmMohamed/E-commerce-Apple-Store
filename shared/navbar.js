
import {
  isLoggedIn,
  getCurrentUser,
  logout,
  isAdmin,
  isSeller,
  createDefaultAccounts,
} from "./store.js";


createDefaultAccounts();


export function createNavbar() {
  const user = getCurrentUser();
  const isLoggedInUser = isLoggedIn();

  let profileDropdown = "";

  if (isLoggedInUser && user) {
    const userName =
      `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
    const userRole = user.role || "customer";


      let dashboardLinks = "";
      if (isAdmin()) {
        dashboardLinks = `
          <li><a class="dropdown-item" href="dash/dash/dash.html">
            <i class="fa fa-tachometer-alt me-2"></i>Admin Dashboard
          </a></li>
          <li><a class="dropdown-item" href="dash/add_product/index.html">
            <i class="fa fa-box me-2"></i>Manage Products
          </a></li>
          <li><a class="dropdown-item" href="dash/order/order.html">
            <i class="fa fa-shopping-cart me-2"></i>Manage Orders
          </a></li>
          <li><a class="dropdown-item" href="dash/customers/customer.html">
            <i class="fa fa-users me-2"></i>Manage Customers
          </a></li>
        `;
      } else if (isSeller()) {
        dashboardLinks = `
          <li><a class="dropdown-item" href="seller/dash/dash.html">
            <i class="fa fa-tachometer-alt me-2"></i>Seller Dashboard
          </a></li>
          <li><a class="dropdown-item" href="seller/order/order.html">
            <i class="fa fa-shopping-cart me-2"></i>My Orders
          </a></li>
          <li><a class="dropdown-item" href="seller/add_product/index.html">
            <i class="fa fa-plus me-2"></i>Add Products
          </a></li>
          <li><a class="dropdown-item" href="seller/porfile/prof.html">
            <i class="fa fa-user me-2"></i>Profile
          </a></li>
        `;
      } else {
        dashboardLinks = `
          <li><a class="dropdown-item" href="Account-Dtails/account.html">
            <i class="fa fa-user me-2"></i>My Account
          </a></li>
        `;
      }

    profileDropdown = `
      <div class="dropdown">
        <button class="btn btn-link text-white dropdown-toggle" type="button" id="profileDropdown" 
                data-bs-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-user me-1"></i>
          <span class="d-none d-lg-inline">${userName}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
          <li><h6 class="dropdown-header">
            <i class="fa fa-user-circle me-2"></i>${userName}
            <small class="d-block text-muted">${userRole.toUpperCase()}</small>
          </h6></li>
          <li><hr class="dropdown-divider"></li>
          ${dashboardLinks}
          <li><hr class="dropdown-divider"></li>
          <li><a class="dropdown-item" href="#" onclick="logoutUser()">
            <i class="fa fa-sign-out-alt me-2"></i>Logout
          </a></li>
        </ul>
      </div>
    `;
  } else {
    profileDropdown = `
      <div class="d-flex gap-2">
        <a href="login/login.html" class="btn btn-light btn-sm">Login</a>
        <a href="signup/signup.html" class="btn btn-light btn-sm">Sign Up</a>
      </div>
    `;
  }

  return `
    <nav class="navbar navbar-expand-lg fixed-top">
      <div class="container-fluid">
        <div class="w-100 px-3 px-lg-4 py-2 bg-black text-white badge shadow-lg d-flex align-items-center">
          <a class="navbar-brand logo-text text-white d-flex align-items-center me-2" href="index.html">
            Premium <i class="fa-brands fa-apple ms-2"></i>
          </a>

          <button class="navbar-toggler border-0 text-white ms-auto" type="button" data-bs-toggle="collapse"
            data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false"
            aria-label="Toggle navigation">
            <i class="fa-solid fa-bars"></i>
          </button>

          <div class="collapse navbar-collapse" id="mainNav">
            <ul class="navbar-nav mx-lg-auto my-2 my-lg-0 gap-lg-4">
              <li class="nav-item"><a class="nav-link text-white fs-6" href="index.html">Home</a></li>
              <li class="nav-item"><a class="nav-link text-white fs-6" href="products/products.html">Explore Product</a></li>
              <li class="nav-item"><a class="nav-link text-white fs-6" href="contact/contact.html">Contact Us</a></li>
              <li class="nav-item"><a class="nav-link text-white fs-6" href="About-us/about.html">About Us</a></li>
              <li class="nav-item"><a class="nav-link text-white fs-6" href="ticket/ticket.html">Ticket</a></li>
            </ul>

            <div class="d-flex align-items-center gap-3 ms-lg-3">
              <a href="wishlist/wish.html" class="icon-link icon-btn text-decoration-none fs-4 position-relative" aria-label="Wishlist">
                <i class="fa-solid fa-heart text-danger"></i>
                <span id="wishlistCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px; display: none;">0</span>
              </a>
              <a href="cart/cart.html" class="icon-link icon-btn text-decoration-none fs-5 position-relative" aria-label="Cart">
                <i class="fa-solid fa-cart-shopping text-white"></i>
                <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px; display: none;">0</span>
              </a>
              ${profileDropdown}
            </div>
            <button id="themeToggle" class="btn btn-sm theme-toggle ms-1" aria-label="Toggle theme">
              <i class="fa-regular fa-moon"></i>
            </button>
          </div>
        </div>
      </div>
    </nav>
  `;
}


window.logoutUser = function () {
  logout();

  window.location.reload();
};


document.addEventListener("DOMContentLoaded", function () {

  const profileSection = document.querySelector(
    ".d-flex.align-items-center.gap-3.ms-lg-3"
  );
  if (profileSection) {
    const user = getCurrentUser();
    const isLoggedInUser = isLoggedIn();

    let profileDropdown = "";

    if (isLoggedInUser && user) {
      const userName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";
      const userRole = user.role || "customer";


      let dashboardLinks = "";
      if (isAdmin()) {
        dashboardLinks = `
          <li><a class="dropdown-item" href="dash/dash/dash.html">
            <i class="fa fa-tachometer-alt me-2"></i>Admin Dashboard
          </a></li>
          <li><a class="dropdown-item" href="dash/add_product/index.html">
            <i class="fa fa-box me-2"></i>Manage Products
          </a></li>
          <li><a class="dropdown-item" href="dash/order/order.html">
            <i class="fa fa-shopping-cart me-2"></i>Manage Orders
          </a></li>
          <li><a class="dropdown-item" href="dash/customers/customer.html">
            <i class="fa fa-users me-2"></i>Manage Customers
          </a></li>
        `;
      } else if (isSeller()) {
        dashboardLinks = `
          <li><a class="dropdown-item" href="seller/dash/dash.html">
            <i class="fa fa-tachometer-alt me-2"></i>Seller Dashboard
          </a></li>
          <li><a class="dropdown-item" href="seller/order/order.html">
            <i class="fa fa-shopping-cart me-2"></i>My Orders
          </a></li>
          <li><a class="dropdown-item" href="seller/add_product/index.html">
            <i class="fa fa-plus me-2"></i>Add Products
          </a></li>
          <li><a class="dropdown-item" href="seller/porfile/prof.html">
            <i class="fa fa-user me-2"></i>Profile
          </a></li>
        `;
      } else {
        dashboardLinks = `
          <li><a class="dropdown-item" href="Account-Dtails/account.html">
            <i class="fa fa-user me-2"></i>My Account
          </a></li>
        `;
      }

      profileDropdown = `
        <div class="dropdown">
          <button class="btn btn-link text-white dropdown-toggle" type="button" id="profileDropdown" 
                  data-bs-toggle="dropdown" aria-expanded="false">
            <i class="fa fa-user me-1"></i>
            <span class="d-none d-lg-inline">${userName}</span>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="profileDropdown">
            <li><h6 class="dropdown-header">
              <i class="fa fa-user-circle me-2"></i>${userName}
              <small class="d-block text-muted">${userRole.toUpperCase()}</small>
            </h6></li>
            <li><hr class="dropdown-divider"></li>
            ${dashboardLinks}
            <li><hr class="dropdown-divider"></li>
            <li><a class="dropdown-item" href="#" onclick="logoutUser()">
              <i class="fa fa-sign-out-alt me-2"></i>Logout
            </a></li>
          </ul>
        </div>
      `;
    } else {
      profileDropdown = `
        <div class="d-flex gap-2">
          <a href="login/login.html" class="btn btn-light btn-sm">Login</a>
          <a href="signup/signup.html" class="btn btn-light btn-sm">Sign Up</a>
        </div>
      `;
    }


    profileSection.innerHTML = `
      <a href="wishlist/wish.html" class="icon-link icon-btn text-decoration-none fs-4 position-relative" aria-label="Wishlist">
        <i class="fa-solid fa-heart text-danger"></i>
        <span id="wishlistCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px; display: none;">0</span>
      </a>
      <a href="cart/cart.html" class="icon-link icon-btn text-decoration-none fs-5 position-relative" aria-label="Cart">
        <i class="fa-solid fa-cart-shopping text-white"></i>
        <span id="cartCount" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="font-size: 10px; display: none;">0</span>
      </a>
      ${profileDropdown}
    `;
  }
});
