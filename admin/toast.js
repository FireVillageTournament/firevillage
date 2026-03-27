// ════════════════════════════════════════════════
// src/utils/toast.js - Toast Notification Utility
// ════════════════════════════════════════════════

let toastTimer;

/**
 * Displays a toast notification.
 * @param {string} msg - The message to display.
 * @param {'success'|'error'|'info'} type - The type of toast (controls color/icon).
 */
export function showToast(msg, type = 'success') {
  const t = document.getElementById('toast');
  const i = t.querySelector('i');
  t.querySelector('#toastMsg').textContent = msg;
  t.className = `toast ${type}`;
  i.className = type === 'success' ? 'fas fa-check-circle' : type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle';
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3500);
}
