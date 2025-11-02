



import { getDashboardStats, getOrders, isAdmin, isLoggedIn } from "../shared/store.js";


if (!isLoggedIn() || !isAdmin()) {
  alert("⛔ Access Denied!\n\nYou must be logged in as an Admin to access this page.");
  window.location.href = "../../login/login.html";
}


document.addEventListener("DOMContentLoaded", () => {

  const sidebar = document.getElementById("sidebar");
  const toggleButton = document.getElementById("toggleSidebarBtn");
  const toggleIcon = document.getElementById("toggleIcon");
  const mainContent = document.getElementById("mainContent");

  if (toggleButton && sidebar && mainContent) {
    console.log("Sidebar toggle initialized");


    let backdrop = document.querySelector(".sidebar-backdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "sidebar-backdrop";
      document.body.appendChild(backdrop);
    }

    function closeSidebar() {
      sidebar.classList.remove("active");
      backdrop.classList.remove("show");
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-xmark");
        toggleIcon.classList.add("fa-bars");
      }
    }

    function openSidebar() {
      sidebar.classList.add("active");
      backdrop.classList.add("show");
      if (toggleIcon) {
        toggleIcon.classList.remove("fa-bars");
        toggleIcon.classList.add("fa-xmark");
      }
    }

    toggleButton.addEventListener("click", (e) => {
      console.log("Toggle clicked, window width:", window.innerWidth);
      e.stopPropagation();

      if (window.innerWidth <= 992) {

        if (sidebar.classList.contains("active")) {
          console.log("Closing sidebar");
          closeSidebar();
        } else {
          console.log("Opening sidebar");
          openSidebar();
        }
      } else {

        sidebar.classList.toggle("collapsed");
        mainContent.classList.toggle("expanded");


        if (sidebar.classList.contains("collapsed")) {
          toggleIcon.classList.remove("fa-xmark");
          toggleIcon.classList.add("fa-bars");
        } else {
          toggleIcon.classList.remove("fa-bars");
          toggleIcon.classList.add("fa-xmark");
        }
      }
    });


    backdrop.addEventListener("click", () => {
      if (window.innerWidth <= 992) {
        closeSidebar();
      }
    });


    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        sidebar.classList.remove("active");
        sidebar.classList.remove("collapsed");
        mainContent.classList.remove("expanded");
        backdrop.classList.remove("show");
        if (toggleIcon) {
          toggleIcon.classList.remove("fa-xmark");
          toggleIcon.classList.add("fa-bars");
        }
      } else {
        sidebar.classList.remove("collapsed");
        mainContent.classList.remove("expanded");
      }
    });


    document.addEventListener("click", (e) => {
      if (
        window.innerWidth <= 992 &&
        sidebar.classList.contains("active") &&
        !sidebar.contains(e.target) &&
        !toggleButton.contains(e.target)
      ) {
        closeSidebar();
      }
    });
  } else {
    console.error("Sidebar elements not found:", {
      sidebar,
      toggleButton,
      toggleIcon,
      mainContent,
    });
  }


  const links = document.querySelectorAll("#sidebar ul li a");


  links.forEach((link) => {
    link.addEventListener("click", function () {

      links.forEach((l) => l.classList.remove("active"));


      this.classList.add("active");


      localStorage.setItem("activeLink", this.getAttribute("href"));
    });
  });


  const activeHref = localStorage.getItem("activeLink");
  if (activeHref) {
    links.forEach((link) => {
      if (link.getAttribute("href") === activeHref) {
        link.classList.add("active");
      }
    });
  }
});


function updateDashboardStats() {
  const stats = getDashboardStats();


  const totalUsersEl = document.getElementById("totalUsers");
  const totalOrdersEl = document.getElementById("totalOrders");
  const totalSalesEl = document.getElementById("totalSales");

  if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers;
  if (totalOrdersEl) totalOrdersEl.textContent = stats.totalOrders;
  if (totalSalesEl)
    totalSalesEl.textContent = `$${stats.totalRevenue.toFixed(2)}`;
}


function generateChartData() {
  const orders = getOrders();
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
      orders: 0,
      revenue: 0,
    });
  }


  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const monthDiff =
      (now.getFullYear() - orderDate.getFullYear()) * 12 +
      (now.getMonth() - orderDate.getMonth());

    if (monthDiff >= 0 && monthDiff < 7) {
      const index = 6 - monthDiff;
      if (index >= 0 && index < last7Months.length) {
        last7Months[index].orders++;
        last7Months[index].revenue += order.pricing?.total || 0;
      }
    }
  });

  return {
    labels: last7Months.map((m) => m.month),
    orders: last7Months.map((m) => m.orders),
    revenue: last7Months.map((m) => m.revenue),
  };
}


document.addEventListener("DOMContentLoaded", () => {

  const chartElement = document.getElementById("dashboardChart");
  if (chartElement) {
    updateDashboardStats();

    const ctx = chartElement.getContext("2d");
    const chartData = generateChartData();

    const chartDataSets = {
      users: {
        thisYear: chartData.orders,
        lastYear: chartData.orders.map(() => Math.floor(Math.random() * 5)),
      },
      projects: {
        thisYear: chartData.orders,
        lastYear: chartData.orders.map(() => Math.floor(Math.random() * 3)),
      },
      operations: {
        thisYear: chartData.orders.map((o) => Math.min(100, o * 10)),
        lastYear: chartData.orders.map(() =>
          Math.floor(Math.random() * 30 + 50)
        ),
      },
    };

    const chartConfig = {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [],
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: "index",
            intersect: false,
            backgroundColor: "#111827",
            titleColor: "#fff",
            bodyColor: "#fff",
            padding: 16,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => (val >= 1000 ? val / 1000 + "K" : val),
              color: "#9ca3af",
              font: { size: 12 },
            },
            grid: { color: "#f3f4f6" },
          },
          x: {
            ticks: { color: "#9ca3af", font: { size: 12 } },
            grid: { display: false },
          },
        },
      },
    };

    const dashboardChart = new Chart(ctx, chartConfig);

    function updateChart(type) {
      const data = chartDataSets[type];
      dashboardChart.data.datasets = [
        {
          label: "This year",
          data: data.thisYear,
          borderColor: "#111827",
          borderWidth: 2,
          tension: 0.4,
          fill: {
            target: "origin",
            above: "rgba(0,0,0,0.03)",
          },
          pointRadius: 0,
        },
        {
          label: "Last year",
          data: data.lastYear,
          borderColor: "#60a5fa",
          borderWidth: 1.5,
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 0,
          fill: false,
        },
      ];
      dashboardChart.update();
    }


    updateChart("users");


    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach((btn) => {
      btn.addEventListener("click", () => {
        tabs.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        updateChart(btn.dataset.type);
      });
    });


    window.addEventListener("ordersUpdated", () => {
      updateDashboardStats();
      const newChartData = generateChartData();
      chartDataSets.users.thisYear = newChartData.orders;
      chartDataSets.projects.thisYear = newChartData.orders;
      chartDataSets.operations.thisYear = newChartData.orders.map((o) =>
        Math.min(100, o * 10)
      );
      updateChart("users");
    });
  }
});
