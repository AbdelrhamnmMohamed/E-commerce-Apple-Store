


import { getUsers, saveUsers, getOrdersForUser } from "../../shared/store.js";

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


function loadCustomers() {
  const users = getUsers();


  const customers = users.filter(
    (user) => user.role === "customer" || !user.role
  );

  const tbody = document.querySelector("#customersTable tbody");
  if (!tbody) return;

  if (customers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" class="text-muted py-4">No customers yet.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = customers
    .map((customer, index) => {
      const name =
        customer.firstName && customer.lastName
          ? `${customer.firstName} ${customer.lastName}`
          : customer.name || customer.email;
      const email = customer.email || "N/A";
      const phone = customer.phone || "N/A";


      const orderCount = getOrdersForUser(email).length;


      const status = orderCount > 0 ? "Active" : "Pending";
      const statusBadge =
        status === "Active"
          ? '<span class="badge bg-success">Active</span>'
          : '<span class="badge bg-warning">Pending</span>';


      const joinDate = customer.createdAt
        ? new Date(customer.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          })
        : "N/A";

      return `
        <tr data-email="${email}">
          <td>${index + 1}</td>
          <td>${name}</td>
          <td>${email}</td>
          <td>${phone}</td>
          <td>${statusBadge}</td>
          <td>${joinDate}</td>
          <td>${orderCount}</td>
          <td>
            <button class="btn btn-sm btn-outline-danger delete-customer" data-email="${email}">
              <i class="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      `;
    })
    .join("");


  attachDeleteListeners();
}


function attachDeleteListeners() {
  document.querySelectorAll(".delete-customer").forEach((button) => {
    button.addEventListener("click", function () {
      const email = this.getAttribute("data-email");

      if (!confirm(`Are you sure you want to delete customer: ${email}?`)) {
        return;
      }


      const users = getUsers();
      const updatedUsers = users.filter((user) => user.email !== email);
      saveUsers(updatedUsers);


      loadCustomers();
    });
  });
}


const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");

if (searchForm) {
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const filter = searchInput.value.toLowerCase();
    const table = document.getElementById("customersTable");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {
      const name = rows[i].cells[1]?.textContent.toLowerCase() || "";
      const email = rows[i].cells[2]?.textContent.toLowerCase() || "";

      if (name.includes(filter) || email.includes(filter)) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    }
  });
}


document.addEventListener("DOMContentLoaded", () => {
  loadCustomers();
});
