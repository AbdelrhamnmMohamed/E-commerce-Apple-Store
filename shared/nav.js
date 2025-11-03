
// status navbar
import { isLoggedIn, logout, getCurrentUser, isAdmin, isSeller } from "./store.js";


function getRelativePath(targetPath) {
  const currentPath = window.location.pathname;


  const normalizedPath = currentPath.replace(/\\/g, "/");

  const parts = normalizedPath.split("/");
  const filename = parts[parts.length - 1];


  const projectIndex = parts.findIndex((p) => p === "project");

  let result;
  if (projectIndex !== -1) {

    const afterProject = parts.slice(projectIndex + 1).filter((p) => p);

    if (afterProject.length > 1) {
      result = "../" + targetPath;
    } else {
      result = targetPath;
    }
  } else {


    const nonEmptyParts = parts.filter((p) => p);
    if (nonEmptyParts.length > 1 && filename.endsWith(".html")) {
      result = "../" + targetPath;
    } else {
      result = targetPath;
    }
  }

  console.log("getRelativePath:", { currentPath, normalizedPath, targetPath, result });
  return result;
}

function setProfileLink() {
  const anchors = document.querySelectorAll("a");
  let profileAnchor = null;
  anchors.forEach((a) => {
    const i = a.querySelector("i");
    if (i && i.classList.contains("fa") && i.classList.contains("fa-user")) {
      profileAnchor = a;
    }
  });
  if (!profileAnchor) return;


  const targetPath = isLoggedIn()
    ? "Account-Dtails/account.html"
    : "login/login.html";
  profileAnchor.setAttribute("href", getRelativePath(targetPath));
}

function setCartLink() {

  const anchors = document.querySelectorAll("a");
  anchors.forEach((a) => {
    const i = a.querySelector("i");


    if (i && i.classList.contains("fa-cart-shopping")) {
      if (!a.getAttribute("href") || a.getAttribute("href") === "#") {
        a.setAttribute("href", getRelativePath("cart/cart.html"));
      }


      a.addEventListener("click", (e) => {
        if (!isLoggedIn()) {
          e.preventDefault();

          localStorage.setItem("redirectAfterLogin", "/cart/cart.html");

          window.location.href = getRelativePath("login/login.html");
        }
      });
    }


    if (i && i.classList.contains("fa-heart")) {
      if (!a.getAttribute("href") || a.getAttribute("href") === "#") {
        a.setAttribute("href", getRelativePath("wishlist/wish.html"));
      }


      a.addEventListener("click", (e) => {
        if (!isLoggedIn()) {
          e.preventDefault();

          localStorage.setItem("redirectAfterLogin", "/wishlist/wish.html");

          window.location.href = getRelativePath("login/login.html");
        }
      });
    }
  });
}

function setBrandLink() {
  const brand = document.querySelector("a.navbar-brand");
  if (brand) {

    const currentFile = window.location.pathname.split('/').pop();
    const isInSubdirectory = window.location.pathname.includes('/') && 
                             !window.location.pathname.match(/\/project\/[^\/]+\.html$/i) &&
                             !window.location.pathname.match(/^\/[^\/]+\.html$/i);
    

    if (isInSubdirectory || window.location.pathname.includes('/Buy-Process/') || 
        window.location.pathname.includes('/cart/') || window.location.pathname.includes('/products/') ||
        window.location.pathname.includes('/About-us/') || window.location.pathname.includes('/contact/') ||
        window.location.pathname.includes('/Account-Dtails/') || window.location.pathname.includes('/wishlist/') ||
        window.location.pathname.includes('/ticket/') || window.location.pathname.includes('/product details/')) {
      brand.setAttribute("href", "../index.html");
    } else {
      brand.setAttribute("href", "index.html");
    }
    
    console.log("setBrandLink:", { 
      pathname: window.location.pathname, 
      href: brand.getAttribute("href") 
    });
  }
}

function ensureStyles() {
  if (document.getElementById("user-dd-styles")) return;
  const style = document.createElement("style");
  style.id = "user-dd-styles";
  style.textContent = `
    .user-dd{ position:fixed; z-index:1050; background:var(--panel,#fff); color:var(--text,#111); border:1px solid var(--line,#e5e7eb); border-radius:10px; min-width:180px; box-shadow:0 12px 32px rgba(0,0,0,.15); overflow:hidden; }
    .user-dd a, .user-dd button{ display:block; width:100%; text-align:left; padding:10px 12px; color:inherit; background:none; border:0; text-decoration:none; cursor:pointer; font:inherit; }
    .user-dd a:hover, .user-dd button:hover{ background: color-mix(in oklab, var(--accent,#0ea5e9) 10%, transparent); }
    .user-dd .sep{ height:1px; background:var(--line,#e5e7eb); margin:4px 0; }
  `;
  document.head.appendChild(style);
}

function setupUserDropdown() {
  const anchors = document.querySelectorAll("a");
  let userA = null;
  anchors.forEach((a) => {
    const i = a.querySelector("i");
    if (i && i.classList.contains("fa") && i.classList.contains("fa-user"))
      userA = a;
  });
  if (!userA) return;

  ensureStyles();

  function close() {
    document.getElementById("user-dd")?.remove();
  }
  function open() {
    close();
    const rect = userA.getBoundingClientRect();
    const dd = document.createElement("div");
    dd.id = "user-dd";
    dd.className = "user-dd";
    dd.style.top = `${rect.bottom + 8}px`;
    const width = 200;
    dd.style.width = width + "px";
    dd.style.left = Math.max(8, rect.right - width) + "px";

    if (isLoggedIn()) {
      const user = getCurrentUser();
      const userIsAdmin = isAdmin();
      const userIsSeller = isSeller();
      
      let menuItems = '';
      

      if (userIsAdmin) {
        const dashPath = getRelativePath("dash/dash/dash.html");
        const productsPath = getRelativePath("dash/add_product/index.html");
        menuItems = `
          <a href="${dashPath}">Admin Dashboard</a>
          <a href="${productsPath}">Manage Products</a>
          <div class="sep"></div>
          <button type="button" id="ddLogout">Log out</button>
        `;
      }

      else if (userIsSeller) {
        const dashPath = getRelativePath("seller/dash/dash.html");
        const profilePath = getRelativePath("seller/porfile/prof.html");
        menuItems = `
          <a href="${dashPath}">Seller Dashboard</a>
          <a href="${profilePath}">View Profile</a>
          <div class="sep"></div>
          <button type="button" id="ddLogout">Log out</button>
        `;
      }

      else {
        const accountPath = getRelativePath("Account-Dtails/account.html");
        menuItems = `
          <a href="${accountPath}">View Profile</a>
          <div class="sep"></div>
          <button type="button" id="ddLogout">Log out</button>
        `;
      }
      
      dd.innerHTML = menuItems;
      

      const logoutBtn = dd.querySelector('#ddLogout');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          logout();
          window.location.href = getRelativePath("login/login.html");
        });
      }
    } else {
      const loginPath = getRelativePath("login/login.html");
      const signupPath = getRelativePath("signup/signup.html");
      dd.innerHTML = `
        <a href="${loginPath}">Login</a>
        <a href="${signupPath}">Sign Up</a>
      `;
    }
    document.body.appendChild(dd);


    const onDoc = (e) => {
      const clickedUser = e.target.closest("a") === userA;
      if (!dd.contains(e.target) && !clickedUser) {
        close();
        document.removeEventListener("click", onDoc);
      }
    };
    setTimeout(() => document.addEventListener("click", onDoc), 0);
    const onKey = (e) => {
      if (e.key === "Escape") {
        close();
        document.removeEventListener("keydown", onKey);
      }
    };
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", close, { once: true });
    window.addEventListener("resize", close, { once: true });
  }

  userA.addEventListener("click", (e) => {
    e.preventDefault();
    const existing = document.getElementById("user-dd");
    if (existing) {
      existing.remove();
      return;
    }
    open();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    setProfileLink();
    setCartLink();
    setBrandLink();
    setupUserDropdown();
  } catch {}
});
