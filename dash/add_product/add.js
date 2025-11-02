const form = document.getElementById("productForm");
const backBtn = document.getElementById("backBtn");
const title = document.getElementById("formTitle");
const imageFileInput = document.getElementById("imageFile");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");

let uploadedImageData = null;


imageFileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert("❌ Image too large! Please use an image smaller than 5MB");
      imageFileInput.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      uploadedImageData = event.target.result;
      previewImg.src = uploadedImageData;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(file);
  }
});


const params = new URLSearchParams(window.location.search);
const editId = params.get("edit");


if (editId !== null) {
  title.textContent = "Edit Product";
  const products = JSON.parse(localStorage.getItem("allProducts")) || [];
  const product = products.find(p => p.id === editId);

  if (product) {
    document.getElementById("name").value = product.name;
    document.getElementById("category").value = product.category;
    document.getElementById("quantity").value = product.quantity;
    document.getElementById("price").value = product.price;
    document.getElementById("status").value = product.status;
    

    if (product.image) {
      uploadedImageData = product.image;
      previewImg.src = product.image;
      imagePreview.style.display = "block";
    }
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  

  const finalImage = uploadedImageData || "imgs/store.png";

  const products = JSON.parse(localStorage.getItem("allProducts")) || [];

  const productData = {
    name: document.getElementById("name").value,
    category: document.getElementById("category").value,
    quantity: parseInt(document.getElementById("quantity").value),
    price: parseFloat(document.getElementById("price").value),
    image: finalImage,
    status: document.getElementById("status").value,
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (editId !== null) {

    const index = products.findIndex(p => p.id === editId);
    if (index !== -1) {
      products[index] = { ...products[index], ...productData };
      alert("✅ Product Updated Successfully!");
    }
  } else {

    productData.id = "product-" + Date.now();
    products.push(productData);
    alert("✅ Product Added Successfully!");
  }

  localStorage.setItem("allProducts", JSON.stringify(products));
  window.location.href = "index.html";
});

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});