// Admin Authentication Module
class AdminAuth {
    constructor() {
        this.isAuthenticated = false;
        this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
        this.lastActivity = Date.now();
    }

    init() {
        // Check if user is already authenticated
        const token = localStorage.getItem('adminToken');
        if (token) {
            this.isAuthenticated = true;
            this.startSessionTimer();
        }

        // Add activity listeners
        this.addActivityListeners();
    }

    login(password) {
        // Verify password
        if (this.verifyPassword(password)) {
            this.isAuthenticated = true;
            localStorage.setItem('adminToken', this.generateToken());
            this.startSessionTimer();
            return true;
        }
        return false;
    }

    logout() {
        this.isAuthenticated = false;
        localStorage.removeItem('adminToken');
        this.stopSessionTimer();
        window.location.href = 'admin-login.html';
    }

    verifyPassword(password) {
        // Using the specific password provided by the user
        return password === '2580aauFVT';
    }

    generateToken() {
        // Generate a simple token for session management
        return Math.random().toString(36).substring(2) + Date.now().toString(36);
    }

    startSessionTimer() {
        this.lastActivity = Date.now();
        this.sessionTimer = setInterval(() => {
            this.checkSession();
        }, 60000); // Check every minute
    }

    stopSessionTimer() {
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
        }
    }

    checkSession() {
        const now = Date.now();
        if (now - this.lastActivity > this.sessionTimeout) {
            this.logout();
        }
    }

    addActivityListeners() {
        // Reset timer on user activity
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(event => {
            document.addEventListener(event, () => {
                this.lastActivity = Date.now();
            });
        });
    }

    // Check if user is authenticated
    checkAuth() {
        if (!this.isAuthenticated) {
            window.location.href = 'admin-login.html';
            return false;
        }
        return true;
    }
}

// Create and export a single instance
const adminAuth = new AdminAuth();
export default adminAuth; 