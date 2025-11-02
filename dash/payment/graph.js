


import { getOrders, getUsers } from "../../shared/store.js";


function calculatePaymentStats() {
  const orders = getOrders();


  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.pricing?.total || 0),
    0
  );


  const successfulPayments = orders.filter(
    (o) => o.payment?.status === "success" || o.status === "completed"
  ).length;
  const pendingPayments = orders.filter(
    (o) => o.payment?.status === "pending" || o.status === "pending"
  ).length;
  const failedPayments = orders.filter(
    (o) => o.payment?.status === "failed" || o.status === "failed"
  ).length;


  const paymentMethods = {
    creditCard: 0,
    paypal: 0,
    bankTransfer: 0,
    cash: 0,
    other: 0,
  };

  const methodAmounts = {
    creditCard: 0,
    paypal: 0,
    bankTransfer: 0,
    cash: 0,
    other: 0,
  };

  orders.forEach((order) => {
    const method = (order.payment?.method || "cash").toLowerCase();
    const amount = order.pricing?.total || 0;

    if (method.includes("credit") || method.includes("card")) {
      paymentMethods.creditCard++;
      methodAmounts.creditCard += amount;
    } else if (method.includes("paypal")) {
      paymentMethods.paypal++;
      methodAmounts.paypal += amount;
    } else if (method.includes("bank") || method.includes("transfer")) {
      paymentMethods.bankTransfer++;
      methodAmounts.bankTransfer += amount;
    } else if (method.includes("cash")) {
      paymentMethods.cash++;
      methodAmounts.cash += amount;
    } else {
      paymentMethods.other++;
      methodAmounts.other += amount;
    }
  });

  return {
    totalRevenue,
    successfulPayments,
    pendingPayments,
    failedPayments,
    paymentMethods,
    methodAmounts,
  };
}


function updatePaymentOverview() {
  const stats = calculatePaymentStats();


  const totalRevenueEl = document.querySelector(
    ".card.text-primary .fs-4.fw-bold"
  );
  if (totalRevenueEl) {
    totalRevenueEl.textContent = `$${stats.totalRevenue.toFixed(2)}`;
  }


  const successfulEl = document.querySelector(
    ".card.text-success .fs-4.fw-bold"
  );
  if (successfulEl) {
    successfulEl.textContent = stats.successfulPayments;
  }


  const pendingEl = document.querySelector(".card.text-warning .fs-4.fw-bold");
  if (pendingEl) {
    pendingEl.textContent = stats.pendingPayments;
  }


  const failedEl = document.querySelector(".card.text-danger .fs-4.fw-bold");
  if (failedEl) {
    failedEl.textContent = stats.failedPayments;
  }
}


function createPaymentChart() {
  const stats = calculatePaymentStats();
  const ctx = document.getElementById("paymentChart");

  if (!ctx) return;

  new Chart(ctx.getContext("2d"), {
    type: "bar",
    data: {
      labels: ["Credit Card", "PayPal", "Bank Transfer", "Cash", "Other"],
      datasets: [
        {
          label: "Amount ($)",
          data: [
            stats.methodAmounts.creditCard,
            stats.methodAmounts.paypal,
            stats.methodAmounts.bankTransfer,
            stats.methodAmounts.cash,
            stats.methodAmounts.other,
          ],
          backgroundColor: [
            "#a4c8ff",
            "#6af0dd",
            "#000000",
            "#b595f0",
            "#68e48c",
          ],
          borderRadius: 20,
          borderSkipped: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#333",
          titleColor: "#fff",
          bodyColor: "#fff",
          callbacks: {
            label: (context) => `Amount: $${context.parsed.y.toFixed(2)}`,
          },
        },
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#9a9a9a", font: { size: 14 } },
        },
        y: {
          beginAtZero: true,
          ticks: {
            color: "#9a9a9a",
            callback: (value) =>
              value === 0
                ? "0"
                : "$" + (value >= 1000 ? value / 1000 + "K" : value),
          },
          grid: { color: "#eaeaea" },
        },
      },
    },
  });
}


function loadPaymentTransactions() {
  const orders = getOrders();
  const users = getUsers();
  const tbody = document.querySelector("#paymentsTable tbody");

  if (!tbody) return;

  if (orders.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="text-muted py-4">No transactions yet.</td>
      </tr>
    `;
    return;
  }


  orders.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  tbody.innerHTML = orders
    .map((order) => {

      const user = users.find((u) => u.email === order.userEmail);
      const customerName =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}`
          : user?.name || order.userName || "Guest";


      const createdDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "N/A";


      const amount = order.pricing?.total || 0;
      const method = order.payment?.method || "Cash on Delivery";
      const paymentStatus = order.payment?.status || order.status || "pending";


      let statusBadge;
      if (
        paymentStatus === "success" ||
        paymentStatus === "completed" ||
        paymentStatus === "delivered"
      ) {
        statusBadge = '<span class="badge bg-success">Paid</span>';
      } else if (paymentStatus === "failed" || paymentStatus === "cancelled") {
        statusBadge = '<span class="badge bg-danger">Failed</span>';
      } else {
        statusBadge = '<span class="badge bg-warning">Pending</span>';
      }

      return `
        <tr>
          <td>${order.id || "N/A"}</td>
          <td>${customerName}</td>
          <td>${createdDate}</td>
          <td>$${amount.toFixed(2)}</td>
          <td>${method}</td>
          <td>${statusBadge}</td>
          <td>${createdDate}</td>
        </tr>
      `;
    })
    .join("");
}


document.addEventListener("DOMContentLoaded", () => {
  updatePaymentOverview();
  createPaymentChart();
  loadPaymentTransactions();
});


window.addEventListener("ordersUpdated", () => {
  updatePaymentOverview();
  loadPaymentTransactions();
});
