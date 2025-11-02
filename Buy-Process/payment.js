
import { getOrder, setOrder } from '../shared/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const order = getOrder();
    if (!order) { window.location.href = '../cart/cart.html'; return; }


    const inputs = form.querySelectorAll('input');
    const [holder, number, expiry, cvc] = inputs;
    order.payment = {
      method: 'card',
      holder: holder?.value || '',
      number: number?.value || '',
      expiry: expiry?.value || '',
      cvc: cvc?.value || ''
    };
    setOrder(order);
    window.location.href = 'review.html';
  });
});

