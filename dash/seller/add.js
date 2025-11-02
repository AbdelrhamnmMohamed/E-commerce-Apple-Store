const form = document.getElementById("productForm");
const backBtn = document.getElementById("backBtn");
const title = document.getElementById("formTitle");


const params = new URLSearchParams(window.location.search);
const editIndex = params.get("edit");


if (editIndex !== null) {
  title.textContent = "Edit Seller";
  const sellers = JSON.parse(localStorage.getItem("sellers")) || [];
  const seller = sellers[editIndex];

  if (seller) {
    document.getElementById("name").value = seller.name;
    document.getElementById("phone").value = seller.phone;
    document.getElementById("email").value = seller.email;
    document.getElementById("location").value = seller.location;
    document.getElementById("status").value = seller.role;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const sellers = JSON.parse(localStorage.getItem("sellers")) || [];

  const newSeller = {
    name: document.getElementById("name").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    location: document.getElementById("location").value,
    role: document.getElementById("status").value,
    createdAt: new Date().toISOString().split("T")[0],
  };

  if (editIndex !== null) {
    sellers[editIndex] = newSeller;
    alert("✅ Seller Updated Successfully!");
  } else {
    sellers.push(newSeller);
    alert("✅ Seller Added Successfully!");
  }

  localStorage.setItem("sellers", JSON.stringify(sellers));
  window.location.href = "seller.html";
});

backBtn.addEventListener("click", () => {
  window.location.href = "seller.html";
});
