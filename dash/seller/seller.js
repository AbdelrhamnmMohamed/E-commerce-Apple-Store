


import { getUsers, saveUsers } from "../../shared/store.js";


const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("toggleSidebarBtn");
const toggleIcon = document.getElementById("toggleIcon");
const mainContent = document.getElementById("mainContent");

if (toggleButton && sidebar && mainContent) {
  toggleButton.addEventListener("click", () => {
    if (window.innerWidth <= 992) {
      sidebar.classList.toggle("show");
    } else {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");
    }


    const isSidebarOpen =
      !sidebar.classList.contains("collapsed") &&
      !sidebar.classList.contains("show")
        ? false
        : true;
    if (
      sidebar.classList.contains("show") ||
      !sidebar.classList.contains("collapsed")
    ) {
      toggleIcon.classList.replace("fa-bars", "fa-xmark");
    } else {
      toggleIcon.classList.replace("fa-xmark", "fa-bars");
    }
  });


  window.addEventListener("resize", () => {
    if (window.innerWidth > 992) {
      sidebar.classList.remove("show");
      toggleIcon.classList.replace("fa-xmark", "fa-bars");
    }
  });
}


function loadSellers() {
  const users = getUsers();


  const sellers = users.filter((user) => user.role === "seller");

  const tbody = document.querySelector("#productTable tbody");
  if (!tbody) return;

  if (sellers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-muted py-4">No sellers yet.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = sellers
    .map((seller, index) => {
      const name =
        seller.firstName && seller.lastName
          ? `${seller.firstName} ${seller.lastName}`
          : seller.name || seller.email;
      const email = seller.email || "N/A";
      const phone = seller.phone || "N/A";
      const location = seller.location || "N/A";


      const status = seller.isActive !== false ? "Active" : "Inactive";
      const statusBadge =
        status === "Active"
          ? '<span class="badge bg-success">Active</span>'
          : '<span class="badge bg-warning">Inactive</span>';

      return `
        <tr data-email="${email}">
          <td>${index + 1}</td>
          <td>${name}</td>
          <td>${phone}</td>
          <td>${email}</td>
          <td>${location}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn btn-sm btn-outline-primary view-seller" data-email="${email}">
              <i class="fa fa-eye"></i>
            </button>
            <button class="btn btn-sm btn-outline-danger delete-seller" data-email="${email}">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");


  attachEvents();
}


function attachEvents() {

  document.querySelectorAll(".view-seller").forEach((button) => {
    button.addEventListener("click", function () {
      const email = this.getAttribute("data-email");
      const users = getUsers();
      const seller = users.find((user) => user.email === email);

      if (seller) {
        const name =
          seller.firstName && seller.lastName
            ? `${seller.firstName} ${seller.lastName}`
            : seller.name || seller.email;

        const details = `
Seller Information:
━━━━━━━━━━━━━━━━━━━━
Name: ${name}
Email: ${seller.email}
Phone: ${seller.phone || "Not provided"}
Location: ${seller.location || "Not provided"}
Role: ${seller.role}
Joined: ${
          seller.createdAt
            ? new Date(seller.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "N/A"
        }
Status: ${seller.isActive !== false ? "Active" : "Inactive"}
        `;
        alert(details);
      }
    });
  });


  document.querySelectorAll(".delete-seller").forEach((button) => {
    button.addEventListener("click", function () {
      const email = this.getAttribute("data-email");

      if (
        !confirm(
          `Are you sure you want to delete seller: ${email}?\n\nThis action cannot be undone.`
        )
      ) {
        return;
      }


      const users = getUsers();
      const updatedUsers = users.filter((user) => user.email !== email);
      saveUsers(updatedUsers);


      loadSellers();
    });
  });
}


const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

if (searchForm) {
  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const term = searchInput.value.toLowerCase();
    const table = document.getElementById("productTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
      const text = rows[i].innerText.toLowerCase();
      rows[i].style.display = text.includes(term) ? "" : "none";
    }
  });
}


const addProductBtn = document.getElementById("addProduct");
if (addProductBtn) {
  addProductBtn.addEventListener("click", () => {
    window.location.href = "add-seller.html";
  });
}


document.addEventListener("DOMContentLoaded", () => {
  loadSellers();
});
