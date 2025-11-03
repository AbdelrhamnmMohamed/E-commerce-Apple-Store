
import {
  getOrdersForSeller,
  updateOrderStatus,
  getUsers,
} from "../../shared/store.js";

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("toggleSidebarBtn");
const toggleIcon = document.getElementById("toggleIcon");
const mainContent = document.getElementById("mainContent");
// side bar toggle
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

// show orders at table
function loadSellerOrders() {
  const sellerId = "default-seller";
  const orders = getOrdersForSeller(sellerId);
  const users = getUsers();
  const tbody = document.getElementById("sellerOrdersTableBody");

  if (!tbody) return;

  tbody.innerHTML = "";

  orders.forEach((order, index) => {
    const user = users.find((u) => u.email === order.userEmail);
    const userName = user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
        "Unknown User"
      : "Unknown User";
    const address = order.shippingInfo
      ? `${order.shippingInfo.address || ""}, ${
          order.shippingInfo.city || ""
        }, ${order.shippingInfo.state || ""}`.replace(/^,\s*|,\s*$/g, "")
      : "No address";

    const statusClass =
      {
        pending: "bg-warning",
        completed: "bg-success",
        failed: "bg-danger",
        processing: "bg-info",
      }[order.status] || "bg-secondary";

    const orderDate = new Date(order.createdAt).toLocaleDateString();
    const lastUpdate = new Date(
      order.updatedAt || order.createdAt
    ).toLocaleDateString();

    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${index + 1}</td>
            <td>${userName}</td>
            <td>${order.userEmail || "N/A"}</td>
            <td><span class="badge ${statusClass}">${order.status}</span></td>
            <td>${address}</td>
            <td>${orderDate}</td>
            <td>${lastUpdate}</td>
            <td>${order.items ? order.items.length : 0}</td>
            <td>$${order.pricing ? order.pricing.total.toFixed(2) : "0.00"}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1" onclick="updateSellerOrderStatus('${
                  order.id
                }', 'processing')">
                    <i class="fa fa-play"></i>
                </button>
                <button class="btn btn-sm btn-outline-success me-1" onclick="updateSellerOrderStatus('${
                  order.id
                }', 'completed')">
                    <i class="fa fa-check"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteSellerOrder('${
                  order.id
                }')">
                    <i class="fa fa-trash"></i>
                </button>
            </td>
        `;
    tbody.appendChild(row);
  });
}


window.updateSellerOrderStatus = function (orderId, status) {
  updateOrderStatus(orderId, status);
  loadSellerOrders();
};


window.deleteSellerOrder = function (orderId) {
  if (confirm("Are you sure you want to delete this order?")) {
    const orders = getOrders();
    const updatedOrders = orders.filter((o) => o.id !== orderId);
    localStorage.setItem("orders_v1", JSON.stringify(updatedOrders));
    loadSellerOrders();
  }
};

// search functionality
const searchInput = document.getElementById("searchInput");
const table = document.getElementById("ordertable");

document.getElementById("searchForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const filter = searchInput.value.toLowerCase();
  const rows = table.getElementsByTagName("tr");

  for (let i = 1; i < rows.length; i++) {
    const name = rows[i].cells[1].textContent.toLowerCase();
    const email = rows[i].cells[2].textContent.toLowerCase();
    if (name.includes(filter) || email.includes(filter)) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
});


window.addEventListener("ordersUpdated", () => {
  loadSellerOrders();
});


document.addEventListener("DOMContentLoaded", () => {
  loadSellerOrders();
});
