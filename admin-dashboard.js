import adminAuth from './admin-auth.js';

// Initialize authentication
adminAuth.init();

// DOM Elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenuClose = document.getElementById('mobile-menu-close');
const sidebar = document.querySelector('.sidebar');
const logoutBtn = document.getElementById('logout-btn');
const notificationBtn = document.getElementById('notification-btn');
const toastContainer = document.getElementById('toast-container');

// Dashboard Statistics
const totalTournaments = document.getElementById('total-tournaments');
const activeTournaments = document.getElementById('active-tournaments');
const totalTeams = document.getElementById('total-teams');
const totalPlayers = document.getElementById('total-players');
const totalRegistrations = document.getElementById('total-registrations');
const totalRevenue = document.getElementById('total-revenue');

// Recent Activities
const recentActivitiesList = document.getElementById('recent-activities');
const upcomingTournamentsList = document.getElementById('upcoming-tournaments');
const recentRegistrationsList = document.getElementById('recent-registrations');

// Mobile Menu Toggle
function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    document.body.classList.toggle('sidebar-open');
}

// Event Listeners for Mobile Menu
mobileMenuBtn.addEventListener('click', toggleMobileMenu);
mobileMenuClose.addEventListener('click', toggleMobileMenu);

// Set Active Navigation Link
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Logout Handler
logoutBtn.addEventListener('click', () => {
    adminAuth.logout();
});

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${getToastIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    toastContainer.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.add('fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function getToastIcon(type) {
    switch(type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-circle';
        default: return 'fa-info-circle';
    }
}

// Load Dashboard Data
async function loadDashboardData() {
    try {
        // In a real application, this would be an API call
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        updateStatistics(data.statistics);
        updateRecentActivities(data.recentActivities);
        updateUpcomingTournaments(data.upcomingTournaments);
        updateRecentRegistrations(data.recentRegistrations);
        
        showToast('Dashboard data updated successfully', 'success');
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        showToast('Failed to load dashboard data', 'error');
    }
}

// Update Statistics with Animation
function updateStatistics(stats) {
    animateCount(totalTournaments, stats.totalTournaments);
    animateCount(activeTournaments, stats.activeTournaments);
    animateCount(totalTeams, stats.totalTeams);
    animateCount(totalPlayers, stats.totalPlayers);
    animateCount(totalRegistrations, stats.totalRegistrations);
    animateCount(totalRevenue, stats.totalRevenue, true);
}

function animateCount(element, target, isCurrency = false) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const animate = () => {
        current += increment;
        if (current >= target) {
            element.textContent = isCurrency ? 
                `₹${target.toLocaleString()}` : 
                target.toLocaleString();
        } else {
            element.textContent = isCurrency ? 
                `₹${Math.floor(current).toLocaleString()}` : 
                Math.floor(current).toLocaleString();
            requestAnimationFrame(animate);
        }
    };
    
    animate();
}

// Update Recent Activities
function updateRecentActivities(activities) {
    recentActivitiesList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.type}">
                <i class="fas ${getActivityIcon(activity.type)}"></i>
            </div>
            <div class="activity-details">
                <p class="activity-text">${activity.description}</p>
                <span class="activity-time">${formatTime(activity.timestamp)}</span>
            </div>
        </div>
    `).join('');
}

function getActivityIcon(type) {
    switch(type) {
        case 'tournament': return 'fa-trophy';
        case 'registration': return 'fa-user-plus';
        case 'payment': return 'fa-money-bill';
        case 'team': return 'fa-users';
        default: return 'fa-info-circle';
    }
}

// Update Upcoming Tournaments
function updateUpcomingTournaments(tournaments) {
    upcomingTournamentsList.innerHTML = tournaments.map(tournament => `
        <div class="tournament-card">
            <div class="tournament-header">
                <h4>${tournament.name}</h4>
                <span class="tournament-date">${formatDate(tournament.date)}</span>
            </div>
            <div class="tournament-details">
                <p><i class="fas fa-users"></i> ${tournament.registeredTeams}/${tournament.maxTeams} Teams</p>
                <p><i class="fas fa-trophy"></i> Prize Pool: ₹${tournament.prizePool}</p>
            </div>
            <div class="tournament-status ${tournament.status.toLowerCase()}">
                ${tournament.status}
            </div>
        </div>
    `).join('');
}

// Update Recent Registrations
function updateRecentRegistrations(registrations) {
    recentRegistrationsList.innerHTML = registrations.map(registration => `
        <div class="registration-item">
            <div class="registration-info">
                <h4>${registration.teamName}</h4>
                <p>${registration.tournamentName}</p>
            </div>
            <div class="registration-status ${registration.status.toLowerCase()}">
                ${registration.status}
            </div>
        </div>
    `).join('');
}

// Utility Functions
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
    return date.toLocaleDateString();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    setActiveNavLink();
    loadDashboardData();
    
    // Check authentication
    if (!adminAuth.checkAuth()) {
        return;
    }
    
    // Notification Button Handler
    notificationBtn.addEventListener('click', () => {
        showToast('Notifications feature coming soon!', 'info');
    });
}); 