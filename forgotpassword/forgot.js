

import { getUsers, saveUsers } from '../shared/store.js';

document.addEventListener('DOMContentLoaded', () => {
  const stepEmail = document.getElementById('stepEmail');
  const stepCode = document.getElementById('stepCode');
  const stepReset = document.getElementById('stepReset');

  const btnNext = document.getElementById('btnNext');
  const btnVerify = document.getElementById('btnVerify');
  const btnBackEmail = document.getElementById('btnBackEmail');

  let workingEmail = '';

  function show(el) { el.classList.remove('d-none'); }
  function hide(el) { el.classList.add('d-none'); }

  btnNext?.addEventListener('click', () => {
    const input = document.getElementById('fpEmail');
    const email = input.value.trim().toLowerCase();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRe.test(email)) { input.classList.add('is-invalid'); return; }
    input.classList.remove('is-invalid');
    const user = getUsers().find(u => (u.email||'').toLowerCase() === email);
    if (!user) { input.classList.add('is-invalid'); return; }
    workingEmail = email;
    hide(stepEmail); show(stepCode);
  });

  btnBackEmail?.addEventListener('click', (e) => { e.preventDefault(); hide(stepCode); show(stepEmail); });

  btnVerify?.addEventListener('click', (e) => {
    e.preventDefault();
    const code = document.getElementById('otpInput').value.trim();
    if (code !== '0000') { alert('Invalid code. Use 0000 for demo.'); return; }
    hide(stepCode); show(stepReset);
  });

  stepReset?.addEventListener('submit', (e) => {
    e.preventDefault();
    const p1 = document.getElementById('newPass').value.trim();
    const p2 = document.getElementById('confirmPass').value.trim();
    if (p1.length < 6) { alert('Password must be at least 6 characters.'); return; }
    if (p1 !== p2) { alert('Passwords do not match.'); return; }
    const updated = getUsers().map(u => (u.email||'').toLowerCase() === workingEmail ? { ...u, password: p1 } : u);
    saveUsers(updated);
    alert('Password updated. Please log in.');
    window.location.href = '../login/login.html';
  });
});

