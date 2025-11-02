
const KEY = "theme";

function getPreferredTheme() {
  const saved = localStorage.getItem(KEY);
  if (saved === "light" || saved === "dark") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(KEY, theme);
  updateToggleIcon(theme);
}

function updateToggleIcon(theme) {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  btn.setAttribute(
    "aria-label",
    theme === "dark" ? "Switch to light" : "Switch to dark"
  );
  btn.innerHTML =
    theme === "dark"
      ? '<i class="fa-solid fa-sun"></i>'
      : '<i class="fa-solid fa-moon"></i>';
}

function initThemeToggle() {
  applyTheme(getPreferredTheme());

  const btn = document.getElementById("themeToggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const current =
      document.documentElement.getAttribute("data-theme") || "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
  });


  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener?.("change", () => {
    const saved = localStorage.getItem(KEY);
    if (!saved) applyTheme(getPreferredTheme());
  });
}

document.addEventListener("DOMContentLoaded", initThemeToggle);
