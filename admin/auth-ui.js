// ════════════════════════════════════════════════
// src/utils/auth-ui.js - Centralized Authentication UI Logic
// ════════════════════════════════════════════════
import { auth, firebaseReady } from '../firebase-init.js';
import { showToast } from './toast.js';

/**
 * Updates the navigation bar's authentication area based on the user's login status.
 * @param {firebase.User | null} user - The current Firebase user object, or null if logged out.
 * @param {string} [redirectPathOnAuth] - Path to redirect to if user is logged in (e.g., 'index.html').
 *                                        Useful for login/register pages to prevent re-access.
 */
export function renderAuthUI(user, redirectPathOnAuth = null) {
  const authArea = document.getElementById('authArea');
  const mobileAuth = document.getElementById('mobileAuthArea');

  if (!authArea || !mobileAuth) {
    // If auth areas are not present (e.g., admin login), just log and return
    if (user) console.log("User authenticated, but auth UI not found.");
    else console.log("User not authenticated, and auth UI not found.");
    return;
  }

  if (user) {
    const displayName = user.displayName || user.email?.split('@')[0] || 'Player';
    authArea.innerHTML = `
      <div class="user-menu-wrap">
        <button class="user-btn" id="userBtn">
          <i class="fas fa-user-circle"></i> <span>${displayName}</span>
          <i class="fas fa-chevron-down" style="font-size:.7rem;"></i>
        </button>
        <div class="user-dropdown" id="userDropdown">
          <a href="profile.html"><i class="fas fa-user-circle" style="margin-right:8px;color:var(--fire-yellow)"></i>Profile</a>
          <a href="#" id="logoutBtn" class="logout"><i class="fas fa-sign-out-alt" style="margin-right:8px;"></i>Logout</a>
        </div>
      </div>`;
    mobileAuth.innerHTML = `
      <a href="profile.html"><i class="fas fa-user-circle" style="margin-right:10px;color:var(--fire-yellow)"></i>Profile</a>
      <a href="#" id="mobileLogoutBtn" class="logout"><i class="fas fa-sign-out-alt" style="margin-right:10px;"></i>Logout</a>`;
  } else {
    authArea.innerHTML = `<a href="login.html" class="btn-primary">Login</a>`;
    mobileAuth.innerHTML = `<a href="login.html" class="mobile-nav-link">Login</a>`;
  }
}
