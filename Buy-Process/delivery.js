
import { getOrder, setOrder } from '../shared/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const order = getOrder();
    if (!order) { window.location.href = '../cart/cart.html'; return; }

    const method = form.querySelector('input[name="deliveryMethod"]:checked')?.value || 'standard';

    const price = method === 'express' ? 30 : method === 'pickup' ? 20 : 10;
    order.deliveryMethod = { method, price };

    order.pricing.shipping = price;
    order.pricing.total = order.pricing.subtotal + order.pricing.tax + order.pricing.shipping;
    setOrder(order);
    window.location.href = 'payment.html';
  });
});

