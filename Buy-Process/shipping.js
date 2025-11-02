
import { getOrder, setOrder } from '../shared/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('shippingForm') || document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let order = getOrder();
    if (!order) { window.location.href = '../cart/cart.html'; return; }

    const data = {
      firstName: document.getElementById('firstName')?.value?.trim() || '',
      lastName: document.getElementById('lastName')?.value?.trim() || '',
      email: document.getElementById('email')?.value?.trim() || '',
      phone: document.getElementById('phone')?.value?.trim() || '',
      address: document.getElementById('address')?.value?.trim() || '',
      city: document.getElementById('city')?.value?.trim() || '',
      state: document.getElementById('state')?.value?.trim() || '',
      zip: document.getElementById('zip')?.value?.trim() || '',
      country: document.getElementById('country')?.value?.trim() || ''
    };

    order.shippingInfo = data;
    setOrder(order);
    window.location.href = 'Delivery.html';
  });
});

