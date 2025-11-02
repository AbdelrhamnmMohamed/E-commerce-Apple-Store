
import {
  findProductById,
  addToCart,
  PRODUCT_DETAILS,
  isLoggedIn,
  addToWishlist,
} from "../shared/store.js";

function $(sel, root = document) {
  return root.querySelector(sel);
}

function getParam(name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}

document.addEventListener("DOMContentLoaded", () => {
  const id = getParam("id");
  const product = id ? findProductById(id) : null;
  if (!product) {

    window.location.href = "../products/products.html";
    return;
  }

  $("#productTitle").textContent = product.title;
  $("#productPrice").textContent = `Starting at $${product.price}`;
  const main = $("#mainImage");
  

  let details = PRODUCT_DETAILS[product.id] || {};
  

  if (product.overview || product.storage || product.display || product.camera || product.colors) {
    details = {
      images: [product.image],
      overview: product.overview || "",
      storage: product.storage || "",
      display: product.display || "",
      camera: product.camera || "",
      colors: product.colors || ""
    };
  }
  
  const gallery = (
    details.images && details.images.length ? details.images : [product.image]
  ).filter((src, idx, arr) => src && arr.indexOf(src) === idx);
  if (main) main.src = gallery[0] || product.image;

  const thumbs = $("#thumbs");
  if (thumbs) {
    thumbs.innerHTML = "";
    gallery.forEach((src, i) => {
      const t = document.createElement("img");
      t.src = src;
      t.alt = product.title + " " + (i + 1);
      if (i === 0) t.classList.add("active");
      t.addEventListener("click", () => {
        if (main) main.src = src;
        thumbs
          .querySelectorAll("img")
          .forEach((el) => el.classList.remove("active"));
        t.classList.add("active");
      });
      thumbs.appendChild(t);
    });
  }


  if (details.overview) {
    $("#overview").textContent = details.overview;
  }
  if (details.storage) {
    $("#specStorage").textContent = details.storage;
  }
  if (details.camera) {
    $("#specCamera").textContent = details.camera;
  }
  if (details.display) {
    $("#specDisplay").textContent = details.display;
  }
  

  const colorsWrap = $("#colorDots");
  let selectedColor = null;
  
  if (colorsWrap && details.colors) {
    colorsWrap.innerHTML = "";
    let colorArray = [];
    

    if (typeof details.colors === 'string') {
      try {
        colorArray = JSON.parse(details.colors);
      } catch (e) {

        const text = document.createElement("span");
        text.textContent = details.colors;
        text.style.padding = "5px";
        colorsWrap.appendChild(text);
      }
    } else if (Array.isArray(details.colors)) {
      colorArray = details.colors;
    }
    

    if (Array.isArray(colorArray) && colorArray.length > 0 && colorArray[0].name) {
      colorArray.forEach((colorData, index) => {
        const colorOption = document.createElement("div");
        colorOption.className = "color-option-dot";
        colorOption.style.cssText = `
          display: inline-block;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background-color: ${colorData.hex};
          margin: 0 6px;
          cursor: pointer;
          border: 2px solid #e5e7eb;
          transition: all 0.2s;
        `;
        
        colorOption.title = colorData.name;
        colorOption.dataset.color = colorData.name;
        colorOption.dataset.hex = colorData.hex;
        

        if (index === 0) {
          colorOption.style.border = '3px solid #0d6efd';
          colorOption.style.boxShadow = '0 0 0 2px rgba(13, 110, 253, 0.25)';
          selectedColor = colorData.name;
        }
        
        colorOption.addEventListener('click', () => {

          colorsWrap.querySelectorAll('.color-option-dot').forEach(dot => {
            dot.style.border = '2px solid #e5e7eb';
            dot.style.boxShadow = 'none';
          });

          colorOption.style.border = '3px solid #0d6efd';
          colorOption.style.boxShadow = '0 0 0 2px rgba(13, 110, 253, 0.25)';
          selectedColor = colorData.name;
        });
        
        colorsWrap.appendChild(colorOption);
      });
    }
  }

  document.querySelector(".add-btn")?.addEventListener("click", () => {
    if (!isLoggedIn()) {
      window.location.href = "../login/login.html";
      return;
    }
    

    const productTitle = selectedColor ? `${product.title} (${selectedColor})` : product.title;
    
    addToCart(
      {
        id: product.id,
        title: productTitle,
        price: product.price,
        image: product.image,
      },
      1
    );
    window.location.href = "../cart/cart.html";
  });


  const addBtn = document.querySelector(".add-btn");
  if (addBtn && !document.getElementById("wishBtn")) {
    const wishBtn = document.createElement("button");
    wishBtn.id = "wishBtn";
    wishBtn.className = "btn btn-outline-secondary ms-2 mt-2";
    wishBtn.innerHTML =
      '<i class="fa-regular fa-heart me-1"></i> Add to Wishlist';
    addBtn.parentElement?.insertBefore(wishBtn, addBtn.nextSibling);
    wishBtn.addEventListener("click", (e) => {
      e.preventDefault();
      addToWishlist({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      });
      wishBtn.innerHTML =
        '<i class="fa-solid fa-heart text-danger me-1"></i> In Wishlist';
      

      if (window.updateNavbarCounts) window.updateNavbarCounts();
    });
  }




  document.querySelectorAll(".related-wishlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const id = btn.getAttribute("data-id");
      const title = btn.getAttribute("data-title");
      const price = parseFloat(btn.getAttribute("data-price"));
      const image = btn.getAttribute("data-image");
      
      addToWishlist({ id, title, price, image });
      

      const icon = btn.querySelector("i");
      icon.classList.remove("fa-regular");
      icon.classList.add("fa-solid", "text-danger");
      

      if (window.updateNavbarCounts) window.updateNavbarCounts();
    });
  });


  document.getElementById("seeMoreRelated")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "../products/products.html";
  });
});
