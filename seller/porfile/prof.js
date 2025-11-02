

import {
  isLoggedIn,
  getCurrentUser,
  updateUser,
  logout,
} from "../../shared/store.js";

document.addEventListener("DOMContentLoaded", () => {

  if (!isLoggedIn()) {
    window.location.href = "../../login/login.html";
    return;
  }

  const user = getCurrentUser();
  if (!user) {
    window.location.href = "../../login/login.html";
    return;
  }


  if (user.role !== "seller") {
    alert("Access denied. Seller account required.");
    window.location.href = "../../index.html";
    return;
  }


  const nameDisplay = document.getElementById("nameDisplay");
  const emailDisplay = document.getElementById("emailDisplay");
  const phoneDisplay = document.getElementById("phoneDisplay");
  const locationDisplay = document.getElementById("locationDisplay");
  const roleDisplay = document.getElementById("roleDisplay");
  const joinedDisplay = document.getElementById("joinedDisplay");

  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");
  const phoneInput = document.getElementById("phoneInput");
  const locationInput = document.getElementById("locationInput");

  const editBtn = document.getElementById("editBtn");
  const saveBtn = document.getElementById("saveBtn");
  const cancelBtn = document.getElementById("cancelBtn");
  const logoutBtn = document.getElementById("logoutBtn");


  function loadUserData() {
    const name = user.name || user.fullname || "Seller";
    const email = user.email || "";
    const phone = user.phone || "";
    const location = user.location || "";
    const role = user.role || "seller";
    const joined = user.createdAt
      ? new Date(user.createdAt).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";


    if (nameDisplay) nameDisplay.textContent = name;
    if (emailDisplay) emailDisplay.textContent = email;
    if (phoneDisplay) phoneDisplay.textContent = phone || "Not provided";
    if (locationDisplay)
      locationDisplay.textContent = location || "Not provided";
    if (roleDisplay) roleDisplay.textContent = role;
    if (joinedDisplay) joinedDisplay.textContent = joined;


    if (nameInput) nameInput.value = name;
    if (emailInput) emailInput.value = email;
    if (phoneInput) phoneInput.value = phone;
    if (locationInput) locationInput.value = location;
  }

  loadUserData();


  function setEditMode(isEditing) {
    const displays = [nameDisplay, emailDisplay, phoneDisplay, locationDisplay];
    const inputs = [nameInput, emailInput, phoneInput, locationInput];

    displays.forEach((display) => {
      if (display) {
        if (isEditing) {
          display.classList.add("d-none");
        } else {
          display.classList.remove("d-none");
        }
      }
    });

    inputs.forEach((input) => {
      if (input) {
        if (isEditing) {
          input.classList.remove("d-none");
        } else {
          input.classList.add("d-none");
        }
      }
    });


    if (editBtn) {
      if (isEditing) {
        editBtn.classList.add("d-none");
      } else {
        editBtn.classList.remove("d-none");
      }
    }

    if (saveBtn) {
      if (isEditing) {
        saveBtn.classList.remove("d-none");
      } else {
        saveBtn.classList.add("d-none");
      }
    }

    if (cancelBtn) {
      if (isEditing) {
        cancelBtn.classList.remove("d-none");
      } else {
        cancelBtn.classList.add("d-none");
      }
    }
  }


  editBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    setEditMode(true);
  });


  cancelBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    loadUserData();
    setEditMode(false);
  });


  saveBtn?.addEventListener("click", (e) => {
    e.preventDefault();

    const newName = nameInput?.value.trim() || "";
    const newEmail = emailInput?.value.trim().toLowerCase() || "";
    const newPhone = phoneInput?.value.trim() || "";
    const newLocation = locationInput?.value.trim() || "";


    if (!newName) {
      alert("Name is required.");
      return;
    }

    if (!newEmail || !newEmail.includes("@")) {
      alert("Valid email is required.");
      return;
    }


    const oldEmail = user.email;
    updateUser(oldEmail, {
      name: newName,
      email: newEmail,
      phone: newPhone,
      location: newLocation,
    });


    if (nameDisplay) nameDisplay.textContent = newName;
    if (emailDisplay) emailDisplay.textContent = newEmail;
    if (phoneDisplay) phoneDisplay.textContent = newPhone || "Not provided";
    if (locationDisplay)
      locationDisplay.textContent = newLocation || "Not provided";


    Object.assign(user, getCurrentUser());

    setEditMode(false);

    alert("Profile updated successfully!");
  });


  logoutBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    if (confirm("Are you sure you want to logout?")) {
      logout();
      window.location.href = "../../login/login.html";
    }
  });
});
