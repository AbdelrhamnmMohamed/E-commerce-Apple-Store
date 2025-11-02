
import {
  isLoggedIn,
  getCurrentUser,
  updateUser,
  getOrdersForUser,
} from "../shared/store.js";

document.addEventListener("DOMContentLoaded", () => {
  if (!isLoggedIn()) {
    window.location.href = "../login/login.html";
    return;
  }
  const user = getCurrentUser();
  if (!user) {
    window.location.href = "../login/login.html";
    return;
  }

  const name = user.name || user.fullname || "";
  const email = user.email || "";

  const accName = document.getElementById("accName");
  const accEmail = document.getElementById("accEmail");
  const accNameInput = document.getElementById("accNameInput");
  const accEmailInput = document.getElementById("accEmailInput");
  const accPhoneInput = document.getElementById("accPhoneInput");
  const avatarImg = document.getElementById("avatarImg");
  const avatarBtn = document.getElementById("avatarBtn");
  const avatarInput = document.getElementById("avatarInput");

  if (accName) accName.textContent = name;
  if (accEmail) accEmail.textContent = email;
  if (accNameInput) accNameInput.value = name;
  if (accEmailInput) accEmailInput.value = email;
  if (accPhoneInput) accPhoneInput.value = user.phone || "";


  if (avatarImg && user.avatar) avatarImg.src = user.avatar;
  avatarBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    avatarInput?.click();
  });
  avatarInput?.addEventListener("change", () => {
    const f = avatarInput.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      if (avatarImg) avatarImg.src = dataUrl;
      updateUser(email, { avatar: dataUrl });
    };
    reader.readAsDataURL(f);
  });


  const ordersList = document.getElementById("ordersList");
  if (ordersList) {
    const orders = getOrdersForUser(email).sort(
      (a, b) => b.createdAt - a.createdAt
    );
    if (!orders.length) {
      ordersList.innerHTML = '<p class="text-muted">No orders yet.</p>';
    } else {
      ordersList.innerHTML = orders
        .map((o) => {
          const count = o.items.reduce((s, x) => s + x.qty, 0);
          const date = new Date(o.createdAt).toLocaleDateString();


          const itemsHTML = o.items
            .map(
              (item) => {

                let imgSrc = item.image || "../imgs/store.png";
                if (imgSrc && !imgSrc.startsWith('data:') && !imgSrc.startsWith('http') && !imgSrc.startsWith('../')) {
                  imgSrc = '../' + imgSrc;
                }
                return `
            <div class="d-flex align-items-center gap-3 mb-2 pb-2 border-bottom">
              <img src="${imgSrc}" class="rounded bg-light" style="width:60px;height:60px;object-fit:contain" 
                   onerror="this.src='../imgs/store.png'"/>
              <div class="flex-grow-1">
                <div class="fw-medium">${item.title || "Product"}</div>
                <small class="text-secondary">Quantity: ${item.qty || 1}</small>
              </div>
              <div class="text-end">
                <strong>$${((item.price || 0) * (item.qty || 1)).toFixed(
                  2
                )}</strong>
              </div>
            </div>
          `;
              }
            )
            .join("");

          return `
          <div class="border rounded-3 p-3 mb-3">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div>
                <div class="fw-bold">Order #${o.id}</div>
                <small class="text-secondary">${date} · ${count} item${
            count > 1 ? "s" : ""
          }</small>
              </div>
              <div class="text-end">
                <div class="fw-bold text-primary">Total: $${
                  o.pricing?.total?.toFixed(2) || "0.00"
                }</div>
                <small class="text-secondary">Status: ${
                  o.status || "Processing"
                }</small>
              </div>
            </div>
            <div class="order-items">
              ${itemsHTML}
            </div>
          </div>`;
        })
        .join("");
    }
  }


  const paymentsList = document.getElementById("paymentsList");
  const addBtn = document.getElementById("addCardBtn");
  const addForm = document.getElementById("addCardForm");
  const saveCardBtn = document.getElementById("saveCardBtn");
  const numInput = document.getElementById("newCardNumber");
  const expInput = document.getElementById("newCardExpiry");

  function mask(num) {
    const n = (num || "").replace(/\D/g, "");
    return n ? `•••• •••• •••• ${n.slice(-4)}` : "";
  }
  function renderPayments() {
    const u = getCurrentUser();
    const list = u?.payments || [];
    if (!paymentsList) return;
    if (!list.length) {
      paymentsList.innerHTML = '<p class="text-muted">No saved cards.</p>';
      return;
    }
    paymentsList.innerHTML = list
      .map(
        (
          p,
          i
        ) => `<div class="border rounded-3 p-3 d-flex justify-content-between align-items-center" data-idx="${i}">
      <div class="d-flex align-items-center gap-3">
        <span class="icon-square">
          <i class="bi bi-credit-card-2-front"></i>
        </span>
        <div>
          <div class="fw-medium">${mask(p.number)}</div>
          <small class="text-secondary">Expires ${p.expiry || ""}</small>
        </div>
      </div>
      <button class="btn btn-outline-danger btn-sm btn-remove">Remove</button>
    </div>`
      )
      .join("");
  }
  renderPayments();

  addBtn?.addEventListener("click", (e) => {
    e.preventDefault();
    addForm?.classList.toggle("d-none");
  });
  saveCardBtn?.addEventListener("click", () => {
    const num = numInput.value.replace(/\s+/g, "");
    const exp = expInput.value.trim();
    if (!/^\d{16}$/.test(num)) {
      alert("Enter a valid 16-digit card number");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      alert("Enter expiry as MM/YY");
      return;
    }
    updateUser(email, (u) => ({
      ...u,
      payments: [...(u.payments || []), { number: num, expiry: exp }],
    }));
    numInput.value = "";
    expInput.value = "";
    addForm.classList.add("d-none");
    renderPayments();
  });
  paymentsList?.addEventListener("click", (e) => {
    const row = e.target.closest("[data-idx]");
    if (!row) return;
    if (e.target.closest(".btn-remove")) {
      const idx = parseInt(row.getAttribute("data-idx"));
      updateUser(email, (u) => {
        const arr = [...(u.payments || [])];
        arr.splice(idx, 1);
        return { ...u, payments: arr };
      });
      renderPayments();
    }
  });


  const piEdit = document.getElementById("piEdit");
  const piSave = document.getElementById("piSave");
  const piCancel = document.getElementById("piCancel");

  function setEditing(on) {
    [accNameInput, accEmailInput, accPhoneInput].forEach(
      (i) => i && (i.readOnly = !on)
    );
    if (on) {
      piEdit?.classList.add("d-none");
      piSave?.classList.remove("d-none");
      piCancel?.classList.remove("d-none");
    } else {
      piEdit?.classList.remove("d-none");
      piSave?.classList.add("d-none");
      piCancel?.classList.add("d-none");
    }
  }
  piEdit?.addEventListener("click", (e) => {
    e.preventDefault();
    setEditing(true);
  });
  piCancel?.addEventListener("click", (e) => {
    e.preventDefault();

    const u = getCurrentUser();
    if (accNameInput) accNameInput.value = u?.name || u?.fullname || "";
    if (accEmailInput) accEmailInput.value = u?.email || "";
    if (accPhoneInput) accPhoneInput.value = u?.phone || "";
    setEditing(false);
  });
  piSave?.addEventListener("click", (e) => {
    e.preventDefault();
    const newName = accNameInput?.value.trim() || "";
    const newEmail = accEmailInput?.value.trim().toLowerCase() || "";
    const newPhone = accPhoneInput?.value.trim() || "";
    if (!newName || !newEmail) {
      alert("Name and email are required.");
      return;
    }

    updateUser(email, { name: newName, email: newEmail, phone: newPhone });

    const u = getCurrentUser();
    if (accName) accName.textContent = u?.name || u?.fullname || "";
    if (accEmail) accEmail.textContent = u?.email || "";
    setEditing(false);

    email = u?.email || email;
  });
});
