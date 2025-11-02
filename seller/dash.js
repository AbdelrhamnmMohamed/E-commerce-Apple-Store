

import { isSeller, isLoggedIn } from "../shared/store.js";


if (!isLoggedIn() || !isSeller()) {
  alert("⛔ Access Denied!\n\nYou must be logged in as a Seller to access this page.");
  window.location.href = "../login/login.html";
}

const sidebar = document.getElementById("sidebar");
const toggleButton = document.getElementById("toggleSidebarBtn");
const toggleIcon = document.getElementById("toggleIcon");
const mainContent = document.getElementById("mainContent");

if (toggleButton && sidebar && mainContent) {

  let backdrop = document.querySelector(".sidebar-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.className = "sidebar-backdrop";
    document.body.appendChild(backdrop);
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    backdrop.classList.remove("show");
    toggleIcon.classList.remove("fa-xmark");
    toggleIcon.classList.add("fa-bars");
  }

  function openSidebar() {
    sidebar.classList.add("active");
    backdrop.classList.add("show");
    toggleIcon.classList.remove("fa-bars");
    toggleIcon.classList.add("fa-xmark");
  }

  toggleButton.addEventListener("click", () => {
    if (window.innerWidth <= 992) {

      if (sidebar.classList.contains("active")) {
        closeSidebar();
      } else {
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
      toggleIcon.classList.remove("fa-xmark");
      toggleIcon.classList.add("fa-bars");
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
}


document.addEventListener("DOMContentLoaded", () => {
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


const ctx = document.getElementById("dashboardChart").getContext("2d");

const chartDataSets = {
  users: {
    thisYear: [12000, 8000, 10000, 18000, 25000, 20000, 22000],
    lastYear: [6000, 14000, 16000, 11000, 15000, 13000, 18000],
  },
  projects: {
    thisYear: [5, 8, 12, 15, 14, 18, 20],
    lastYear: [4, 6, 10, 11, 13, 12, 16],
  },
  operations: {
    thisYear: [70, 80, 60, 75, 90, 85, 95],
    lastYear: [65, 70, 55, 60, 75, 80, 82],
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
