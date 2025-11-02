
import {
  getOrdersForSeller,
  getDashboardStats,
  getUsers,
} from "../../shared/store.js";


function updateSellerDashboardStats() {
  const sellerId = "default-seller";
  const sellerOrders = getOrdersForSeller(sellerId);
  const allUsers = getUsers();


  const totalOrders = sellerOrders.length;
  const totalRevenue = sellerOrders.reduce(
    (sum, order) => sum + (order.pricing?.total || 0),
    0
  );
  const uniqueCustomers = new Set(sellerOrders.map((order) => order.userEmail))
    .size;
  const totalProducts = 10;


  const totalProductsEl = document.getElementById("sellerTotalProducts");
  const activeCustomersEl = document.getElementById("sellerActiveCustomers");
  const totalOrdersEl = document.getElementById("sellerTotalOrders");
  const revenueEl = document.getElementById("sellerRevenue");

  if (totalProductsEl) totalProductsEl.textContent = totalProducts;
  if (activeCustomersEl) activeCustomersEl.textContent = uniqueCustomers;
  if (totalOrdersEl) totalOrdersEl.textContent = totalOrders;
  if (revenueEl) revenueEl.textContent = `$${totalRevenue.toFixed(2)}`;
}


function generateSalesChartData() {
  const sellerId = "default-seller";
  const sellerOrders = getOrdersForSeller(sellerId);
  const now = new Date();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];


  const last7Months = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    last7Months.push({
      month: months[date.getMonth()],
      revenue: 0,
    });
  }


  sellerOrders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const monthDiff =
      (now.getFullYear() - orderDate.getFullYear()) * 12 +
      (now.getMonth() - orderDate.getMonth());

    if (monthDiff >= 0 && monthDiff < 7) {
      const index = 6 - monthDiff;
      if (index >= 0 && index < last7Months.length) {
        last7Months[index].revenue += order.pricing?.total || 0;
      }
    }
  });

  return {
    labels: last7Months.map((m) => m.month),
    data: last7Months.map((m) => m.revenue),
  };
}


let salesChart;
function initializeSalesChart() {
  const ctx = document.getElementById("salesChart");
  if (!ctx) return;

  const chartData = generateSalesChartData();

  salesChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: chartData.labels,
      datasets: [
        {
          label: "Monthly Sales",
          data: chartData.data,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: "#e5e7eb" } },
        x: { grid: { color: "#f3f4f6" } },
      },
    },
  });
}


function updateSalesChart() {
  if (salesChart) {
    const chartData = generateSalesChartData();
    salesChart.data.labels = chartData.labels;
    salesChart.data.datasets[0].data = chartData.data;
    salesChart.update();
  }
}


document.addEventListener("DOMContentLoaded", () => {
  updateSellerDashboardStats();
  initializeSalesChart();
});


window.addEventListener("ordersUpdated", () => {
  updateSellerDashboardStats();
  updateSalesChart();
});
