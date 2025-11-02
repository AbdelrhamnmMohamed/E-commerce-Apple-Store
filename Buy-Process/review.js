
import { getOrder, setOrder, clearOrder, getCart, setCart, addOrder, getCurrentUser } from '../shared/store.js';

const fmt = (n) => `$${n.toFixed(2)}`;

document.addEventListener('DOMContentLoaded', () => {
  const order = getOrder();
  if (!order) { window.location.href = '../cart/cart.html'; return; }


  const count = order.items.reduce((s, x) => s + x.qty, 0);
  document.getElementById('revCount').textContent = String(count);
  document.getElementById('revSubtotal').textContent = fmt(order.pricing.subtotal);
  document.getElementById('revTax').textContent = fmt(order.pricing.tax);
  document.getElementById('revShipping').textContent = fmt(order.pricing.shipping);
  document.getElementById('revTotal').textContent = fmt(order.pricing.total);


  try {
    const name = `${order.shippingInfo?.firstName || ''} ${order.shippingInfo?.lastName || ''}`.trim();
    const address = [order.shippingInfo?.address, order.shippingInfo?.city, order.shippingInfo?.state, order.shippingInfo?.country, order.shippingInfo?.zip]
      .filter(Boolean).join(', ');
    const shipBox = [...document.querySelectorAll('.review-box')].find(b => b.querySelector('h5')?.textContent?.toLowerCase().includes('ship to'));
    if (shipBox) {
      const ps = shipBox.querySelectorAll('p');
      if (ps[0]) ps[0].innerHTML = `<strong>${name || '—'}</strong>`;
      if (ps[1]) ps[1].textContent = address || '—';
    }
  } catch {}


  try {
    const shipSection = [...document.querySelectorAll('.review-box')].find(b => b.querySelector('h5')?.textContent?.toLowerCase().includes('shipping'));
    if (shipSection) {
      const header = shipSection.querySelector('h5 .text-muted') || shipSection.querySelector('h5 span');
      const thumbsWrap = shipSection.querySelector('.d-flex.gap-3') || shipSection.querySelector('div.mt-3');
      if (header) header.textContent = `(${count} items)`;
      if (thumbsWrap) {
        thumbsWrap.innerHTML = order.items.map((it, idx) => {

          let imgSrc = it.image || '../imgs/store.png';
          if (imgSrc && !imgSrc.startsWith('data:') && !imgSrc.startsWith('http') && !imgSrc.startsWith('../')) {
            imgSrc = '../' + imgSrc;
          }
          return `<img src="${imgSrc}" alt="item${idx+1}" class="thumb" onerror="this.src='../imgs/store.png'">`;
        }).join('');
      }
    }
  } catch {}


  try {
    const delBox = [...document.querySelectorAll('.review-box')].find(b => b.querySelector('h5')?.textContent?.toLowerCase().includes('delivery method'));
    if (delBox && order.deliveryMethod) {
      const nameEl = delBox.querySelector('.fw-semibold');
      const small = delBox.querySelector('small');
      const priceEl = delBox.querySelector('strong');
      if (nameEl) nameEl.textContent = (order.deliveryMethod.method || 'standard').replace(/^./, c=>c.toUpperCase());
      if (small) small.textContent = order.deliveryMethod.method === 'express' ? 'Transit Time: 1–2 Business Days' : order.deliveryMethod.method === 'pickup' ? 'Transit Time: 2–3 Business Days' : 'Transit Time: 3–6 Business Days';
      if (priceEl) priceEl.textContent = fmt(order.deliveryMethod.price || order.pricing.shipping || 0);
    }
  } catch {}


  try {
    const payBox = [...document.querySelectorAll('.review-box')].find(b => b.querySelector('h5')?.textContent?.toLowerCase().includes('payment method'));
    if (payBox) {
      const span = payBox.querySelector('span');
      const num = (order.payment?.number || '').replace(/\s+/g,'');
      const last4 = num.slice(-4);
      if (span) span.textContent = last4 ? `•••• •••• •••• ${last4}` : '—';
    }
  } catch {}

  document.getElementById('placeOrderBtn')?.addEventListener('click', () => {
    try {
      const user = getCurrentUser();
      const id = 'ORD-' + Date.now();
      const rec = {
        id,
        userEmail: user?.email || '',
        items: order.items,
        pricing: order.pricing,
        deliveryMethod: order.deliveryMethod,
        shippingInfo: order.shippingInfo,
        createdAt: Date.now()
      };
      addOrder(rec);
    } catch {}
    setCart([]);
    clearOrder();
    window.location.href = 'thankyou.html';
  });
});
