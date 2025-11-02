

const form = document.getElementById("signupForm");

function hideAllErrors() {
  const inputs = form.querySelectorAll("input");
  inputs.forEach((input) => {
    const msg = input.nextElementSibling;
    if (msg && msg.tagName === "SMALL") msg.classList.add("d-none");
    input.classList.remove("is-invalid");
  });
  const termsMsg = document.getElementById("termsError");
  if (termsMsg) termsMsg.classList.add("d-none");
}

function showError(inputEl, text) {
  const msg = inputEl.nextElementSibling;
  if (msg && msg.tagName === "SMALL") {
    msg.textContent = text;
    msg.classList.remove("d-none");
  }
  inputEl.classList.add("is-invalid");
}

function validEmail(v) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(v);
}

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}
function saveUsers(arr) {
  localStorage.setItem("users", JSON.stringify(arr));
}
function emailExists(email) {
  const lower = email.toLowerCase();
  return getUsers().some((u) => (u.email || "").toLowerCase() === lower);
}

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    hideAllErrors();

    const fullname = document.getElementById("signUpName");
    const email = document.getElementById("signUpEmail");
    const password = document.getElementById("signUpPassword");
    const terms = document.getElementById("termsCheckbox");
    const btn = form.querySelector(".sign-btn");

    let isValid = true;


    if (fullname.value.trim().length < 3) {
      showError(fullname, "Full name must be at least 3 characters.");
      isValid = false;
    }


    if (!validEmail(email.value.trim())) {
      showError(email, "Please enter a valid email address.");
      isValid = false;
    }


    if (password.value.trim().length < 8) {
      showError(password, "Password must be at least 8 characters.");
      isValid = false;
    }


    if (!terms.checked) {
      const termsMsg = document.getElementById("termsError");
      if (termsMsg) termsMsg.classList.remove("d-none");
      isValid = false;
    }

    if (!isValid) return;


    if (emailExists(email.value.trim())) {
      showError(email, "Email already registered.");
      return;
    }


    const accountType = document.querySelector(
      'input[name="accountType"]:checked'
    ).value;


    const nameParts = fullname.value.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";


    const users = getUsers();
    const newUser = {
      id: "user-" + Date.now(),
      firstName: firstName,
      lastName: lastName,
      email: email.value.trim(),
      password: password.value.trim(),
      role: accountType,
      createdAt: Date.now(),
    };
    users.push(newUser);
    saveUsers(users);


    if (btn) {
      btn.textContent = "Account Created!";
      btn.style.background = "#28a745";
    }


    


    setTimeout(() => (window.location.href = "../login/login.html"), 1500);
  });


  ["signUpName", "signUpEmail", "signUpPassword"].forEach((id) => {
    const el = document.getElementById(id);
    el.addEventListener("input", () => {
      const msg = el.nextElementSibling;
      if (msg && msg.tagName === "SMALL") msg.classList.add("d-none");
      el.classList.remove("is-invalid");
    });
  });


  const terms = document.getElementById("termsCheckbox");
  terms.addEventListener("change", () => {
    const termsMsg = document.getElementById("termsError");
    if (termsMsg) termsMsg.classList.add("d-none");
  });
}
