// ===================================================================================
// FIREBASE CONFIGURATION
// WARNING: Do not expose your Firebase API keys in client-side code in production.
// This is a security risk. These keys should be stored in environment variables
// on a server, and your client-side code should make API calls to your server,
// which then interacts with Firebase. For this example, we are initializing
// it here.
// ===================================================================================
const firebaseConfig = {
  apiKey: "AIzaSyDFjHR5_D6yQ9tXrEut-3c2o4oA1ddz6hQ",
  authDomain: "firevillagetournament.firebaseapp.com",
  projectId: "firevillagetournament",
  storageBucket: "firevillagetournament.firebasestorage.app",
  messagingSenderId: "511246704009",
  appId: "1:511246704009:web:8ae5e484591a64bb735558",
  measurementId: "G-ZCQ2V6DEGX"
};

// Initialize Firebase
let auth, db;
try {
  firebase.initializeApp(firebaseConfig);
  auth = firebase.auth();
  db = firebase.firestore();
} catch (error) {
  console.error("Firebase initialization failed:", error);
}


// ===================================================================================
// DOMContentLoaded - Main Entry Point
// ===================================================================================
document.addEventListener('DOMContentLoaded', function() {
  // Initialize all page components
  initMobileMenu();
  initSmoothScrolling();
  highlightActiveLink();
  checkAuth();
  initUserMenu();
  initLogout();
  initCountUpAnimation();
  createParticles();
  
  // Load dynamic content
  loadTournaments();
  loadTeams();
  loadLeaderboardPreview();

  // Update footer year
  updateCopyrightYear();
});


// ===================================================================================
// COMPONENT INITIALIZATION
// ===================================================================================

function initMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  
  if (!mobileMenuBtn || !mobileMenu) return;

  mobileMenuBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    mobileMenu.classList.toggle('hidden');
    
    if (mobileMenu.classList.contains('hidden')) {
      icon.classList.replace('fa-times', 'fa-bars');
    } else {
      icon.classList.replace('fa-bars', 'fa-times');
    }
  });

  document.addEventListener('click', function(event) {
    if (!mobileMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
      if (!mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
      }
    }
  });
}

function highlightActiveLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPath = (link.getAttribute('href') || '').split('/').pop() || 'index.html';
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}

function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          const mobileMenu = document.getElementById('mobileMenu');
          if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
            const icon = document.getElementById('mobileMenuBtn').querySelector('i');
            icon.classList.replace('fa-times', 'fa-bars');
          }
          
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      } catch (error) {
        console.warn(`Smooth scroll target not found: ${targetId}`);
      }
    });
  });
}

function initUserMenu() {
  const userMenuBtn = document.getElementById('userMenuBtn');
  const dropdown = document.getElementById('userDropdown');

  if (!userMenuBtn || !dropdown) return;

  userMenuBtn.addEventListener('click', () => dropdown.classList.toggle('hidden'));

  document.addEventListener('click', (event) => {
    if (!dropdown.contains(event.target) && !userMenuBtn.contains(event.target)) {
      dropdown.classList.add('hidden');
    }
  });
}

function initLogout() {
  const logoutBtn = document.getElementById('logoutBtn');
  if (!logoutBtn) return;

  logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (auth) {
      auth.signOut().then(() => {
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
      }).catch(error => console.error("Logout failed:", error));
    } else {
      localStorage.removeItem('currentUser');
      window.location.href = 'login.html';
    }
  });
}

function initCountUpAnimation() {
    const counters = document.querySelectorAll('.count-up');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let current = 0;
                const duration = 1500; // ms
                const stepTime = 20; // ms
                const steps = duration / stepTime;
                const increment = target / steps;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current).toLocaleString();
                        setTimeout(updateCounter, stepTime);
                    } else {
                        counter.innerText = target.toLocaleString();
                    }
                };
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ===================================================================================
// DYNAMIC CONTENT LOADING
// ===================================================================================

async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Could not fetch data from ${url}:`, error);
    return null;
  }
}

async function loadTournaments() {
  const container = document.getElementById('tournamentsContainer');
  if (!container) return;

  const tournaments = await fetchData('./data/tournaments.json');
  if (!tournaments) {
    container.innerHTML = '<p class="text-red-400 col-span-full text-center">Failed to load tournaments.</p>';
    return;
  }
  
  container.innerHTML = '';
  tournaments.forEach(tournament => {
    const card = document.createElement('div');
    card.className = 'tournament-card rounded-xl overflow-hidden cursor-pointer';
    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img src="${tournament.image}" alt="${tournament.name}" class="tournament-image w-full h-48 object-cover">
        <div class="tournament-badge absolute top-4 right-4 bg-black bg-opacity-70 px-3 py-1 rounded-full text-yellow-400 font-bold">
          ${tournament.prize}
        </div>
      </div>
      <div class="p-6">
        <h3 class="text-xl font-bold text-white mb-2">${tournament.name}</h3>
        <div class="flex justify-between text-gray-400 mb-4">
          <div class="flex items-center"><i class="fas fa-calendar-alt mr-2"></i><span>${tournament.date}</span></div>
          <div class="flex items-center"><i class="fas fa-users mr-2"></i><span>${tournament.teams}</span></div>
        </div>
        <div class="tournament-stats">
          <div class="flex justify-between items-center">
            <span class="px-3 py-1 bg-${tournament.status === 'Upcoming' ? 'blue' : 'green'}-500 bg-opacity-20 text-${tournament.status === 'Upcoming' ? 'blue' : 'green'}-400 rounded-full text-sm">${tournament.status}</span>
            <a href="tournament-details.html?id=${tournament.id}" class="text-yellow-400 hover:text-yellow-300 font-medium">View Details <i class="fas fa-arrow-right ml-1"></i></a>
          </div>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

async function loadTeams() {
  const container = document.getElementById('teamsContainer');
  if (!container) return;

  const teams = await fetchData('./data/teams.json');
  if (!teams) {
    container.innerHTML = '<p class="text-red-400 col-span-full text-center">Failed to load teams.</p>';
    return;
  }
  
  container.innerHTML = '';
  teams.forEach(team => {
    const card = document.createElement('div');
    card.className = 'team-card rounded-xl overflow-hidden cursor-pointer relative';
    card.innerHTML = `
      <div class="team-rank">#${team.rank}</div>
      <div class="p-6 text-center">
        <div class="team-logo w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-yellow-400">
          <img src="${team.logo}" alt="${team.name}" class="w-full h-full object-cover">
        </div>
        <h3 class="text-xl font-bold text-white mb-2">${team.name}</h3>
        <div class="team-stats">
          <div class="flex justify-center space-x-4 text-gray-400">
            <div><div class="font-bold text-yellow-400">${team.wins}</div><div class="text-sm">Wins</div></div>
            <div><div class="font-bold text-yellow-400">${team.members}</div><div class="text-sm">Members</div></div>
          </div>
          <a href="team-details.html?id=${team.id}" class="mt-4 inline-block text-yellow-400 hover:text-yellow-300 font-medium">View Team <i class="fas fa-arrow-right ml-1"></i></a>
        </div>
      </div>`;
    container.appendChild(card);
  });
}

async function loadLeaderboardPreview() {
  const container = document.getElementById('leaderboardPreview');
  if (!container) return;

  const players = await fetchData('./data/leaderboard.json');
  if (!players) {
    container.innerHTML = '<tr><td colspan="6" class="text-red-400 text-center py-4">Failed to load leaderboard.</td></tr>';
    return;
  }
  
  container.innerHTML = '';
  players.forEach(player => {
    const row = document.createElement('tr');
    row.className = 'leaderboard-row border-b border-gray-700';
    
    const rankBadgeClass = player.rank === 1 ? 'gold' : player.rank === 2 ? 'silver' : player.rank === 3 ? 'bronze' : '';
    const statusColor = player.status === 'offline' ? 'bg-red-500' : player.status === 'away' ? 'bg-yellow-500' : 'bg-green-500';
    
    row.innerHTML = `
      <td class="py-3 px-4 sm:py-4 sm:px-6"><div class="rank-badge ${rankBadgeClass} w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-black">${player.rank}</div></td>
      <td class="py-3 px-4 sm:py-4 sm:px-6">
        <div class="flex items-center space-x-3 sm:space-x-4">
          <div class="relative">
            <img src="./assets/player-avatar.png" alt="${player.name}" class="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 ${player.rank === 1 ? 'border-yellow-400' : player.rank === 2 ? 'border-gray-400' : player.rank === 3 ? 'border-yellow-700' : 'border-gray-600'}">
            <div class="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 ${statusColor} rounded-full border-2 border-gray-800"></div>
          </div>
          <div>
            <p class="font-bold text-white">${player.name}</p>
            <p class="text-xs text-gray-400">${player.rank === 1 ? 'MVP of the Season' : player.rank === 2 ? 'Rising Star' : player.rank === 3 ? 'Veteran' : 'Elite'}</p>
          </div>
        </div>
      </td>
      <td class="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell"><div class="flex items-center space-x-2"><img src="./assets/team-logo-placeholder.png" alt="${player.team}" class="h-6 w-6 rounded-full"><span>${player.team}</span></div></td>
      <td class="py-3 px-4 sm:py-4 sm:px-6"><div class="player-stats"><p class="font-bold text-yellow-400">${player.kills}</p><p class="text-xs text-gray-400">+${Math.floor(Math.random() * 15)} today</p></div></td>
      <td class="py-3 px-4 sm:py-4 sm:px-6 hidden sm:table-cell"><div class="player-stats"><p class="font-bold text-yellow-400">${player.wins}</p><p class="text-xs text-gray-400">${Math.floor((player.wins / 20) * 100)}% rate</p></div></td>
      <td class="py-3 px-4 sm:py-4 sm:px-6">
        <div class="player-stats">
          <p class="font-bold text-xl sm:text-2xl text-yellow-400">${player.points.toLocaleString()}</p>
          <div class="flex items-center text-xs ${player.rank <= 3 ? 'text-green-400' : 'text-red-400'}"><i class="fas ${player.rank <= 3 ? 'fa-caret-up' : 'fa-caret-down'} mr-1"></i><span>${player.rank <= 3 ? '+' : '-'}${Math.floor(Math.random() * 200)}</span></div>
        </div>
      </td>`;
    container.appendChild(row);
  });
}

// ===================================================================================
// AUTHENTICATION
// ===================================================================================
function checkAuth() {
  const authButtons = document.getElementById('authButtons');
  const userMenu = document.getElementById('userMenu');
  const userName = document.getElementById('userName');
  
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
      if (authButtons) authButtons.classList.add('hidden');
      if (userMenu) userMenu.classList.remove('hidden');
      if (userName) userName.textContent = currentUser.name;
    } else {
      if (authButtons) authButtons.classList.remove('hidden');
      if (userMenu) userMenu.classList.add('hidden');
    }
  } catch (e) {
    console.error("Could not parse user from localStorage", e);
    if (authButtons) authButtons.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
  }
}

// ===================================================================================
// UI EFFECTS
// ===================================================================================
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  
  const particleCount = 50;
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    const size = Math.random() * 5 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 10}s`;
    particle.style.animationDuration = `${Math.random() * 10 + 5}s`;
    
    container.appendChild(particle);
  }
}

// ===================================================================================
// UTILITIES
// ===================================================================================
function updateCopyrightYear() {
  const yearElement = document.getElementById('copyright-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}
