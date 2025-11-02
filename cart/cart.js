
import { getCart, updateQty, removeFromCart, cartTotals, seedOrderFromCart, findProductById } from '../shared/store.js';

const fmt = (n) => `$${n.toFixed(2)}`;

function render() {
  const list = document.getElementById('cartItems');
  const headerCount = document.getElementById('itemCount');
  const { items, count, subtotal } = cartTotals();

  headerCount.textContent = String(count);

  if (!items.length) {
    list.innerHTML = '<p class="text-center text-muted my-5">Your cart is empty.</p>';
  } else {
    list.innerHTML = items.map(it => {

      const actualProduct = findProductById(it.id);
      let imgSrc = actualProduct ? actualProduct.image : (it.image || '../imgs/store.png');
      

      if (imgSrc && !imgSrc.startsWith('data:') && !imgSrc.startsWith('http') && !imgSrc.startsWith('../')) {
        imgSrc = '../' + imgSrc;
      }
      return `
      <div class="row mb-4 align-items-center" data-id="${it.id}">
        <div class="col-md-2">
          <img src="${imgSrc}" class="img-fluid rounded" alt="${it.title}" 
               onerror="this.src='../imgs/store.png'" style="object-fit: contain; max-height: 120px;" />
        </div>
        <div class="col-md-6">
          <h6 class="fw-bold mb-1">${it.title}</h6>
          <div class="quantity d-flex align-items-center gap-2 mt-2">
            <button class="btn btn-light btn-sm border btn-dec">-</button>
            <span class="mx-2 qty">${it.qty}</span>
            <button class="btn btn-light btn-sm border btn-inc">+</button>
          </div>
        </div>
        <div class="col-md-2 text-center"></div>
        <div class="col-md-2 text-end">
          <p class="fw-bold mb-0">${fmt(it.price * it.qty)}</p>
          <button class="remove-btn btn btn-danger mt-3"><i class="fa-solid fa-trash-can me-1"></i>Remove</button>
        </div>
      </div>
      <hr />
    `;
    }).join('');
  }

  const tax = Math.round(subtotal * 0.02 * 100) / 100;
  const shipping = items.length ? 10 : 0;
  const total = subtotal + tax + shipping;

  document.getElementById('sumCount').textContent = String(count);
  document.getElementById('sumSubtotal').textContent = fmt(subtotal);
  document.getElementById('sumTax').textContent = fmt(tax);
  document.getElementById('sumShipping').textContent = fmt(shipping);
  document.getElementById('sumTotal').textContent = fmt(total);
}

document.addEventListener('DOMContentLoaded', () => {

  const cont = document.getElementById('continueShopping');
  cont?.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../products/products.html';
  });

  const list = document.getElementById('cartItems');
  list.addEventListener('click', (e) => {
    const row = e.target.closest('[data-id]');
    if (!row) return;
    const id = row.getAttribute('data-id');
    if (e.target.closest('.btn-inc')) {
      const item = getCart().find(x => x.id === id);
      if (!item) return; updateQty(id, item.qty + 1); render(); return;
    }
    if (e.target.closest('.btn-dec')) {
      const item = getCart().find(x => x.id === id);
      if (!item) return; updateQty(id, Math.max(1, item.qty - 1)); render(); return;
    }
    if (e.target.closest('.remove-btn')) {
      removeFromCart(id); render(); return;
    }
  });

  document.getElementById('checkoutBtn')?.addEventListener('click', () => {
    const cart = getCart();
    if (!cart.length) return;
    seedOrderFromCart();
    window.location.href = '../Buy-Process/Shipping.html';
  });

  render();
});
