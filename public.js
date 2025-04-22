// Public-facing functionality for Fire Village Tournament Website

// Initialize public UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializePublicUI();
    loadPublicData();
});

// Initialize public UI elements
function initializePublicUI() {
    // Add event listeners for navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Add event listeners for tournament registration
    document.querySelectorAll('.register-tournament-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tournamentId = e.target.dataset.tournamentId;
            showRegistrationModal(tournamentId);
        });
    });

    // Add event listeners for tournament details
    document.querySelectorAll('.view-tournament-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tournamentId = e.target.dataset.tournamentId;
            showTournamentDetails(tournamentId);
        });
    });

    // Add event listeners for team details
    document.querySelectorAll('.view-team-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const teamId = e.target.dataset.teamId;
            showTeamDetails(teamId);
        });
    });
}

// Load all public data
async function loadPublicData() {
    await Promise.all([
        loadPublicTournaments(),
        loadPublicTeams(),
        loadLeaderboard(),
        loadUpcomingTournaments()
    ]);
}

// Load and display public tournaments
async function loadPublicTournaments() {
    try {
        const response = await fetch('/api/tournaments');
        const tournaments = await response.json();
        
        const tournamentsContainer = document.getElementById('tournaments-container');
        if (!tournamentsContainer) return;

        tournamentsContainer.innerHTML = tournaments.map(tournament => `
            <div class="tournament-card glass-card">
                <h3>${tournament.name}</h3>
                <p>${tournament.description}</p>
                <div class="tournament-details">
                    <span><i class="fas fa-calendar"></i> ${new Date(tournament.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-users"></i> ${tournament.maxTeams} teams</span>
                    <span><i class="fas fa-trophy"></i> $${tournament.prizePool}</span>
                </div>
                <div class="tournament-actions">
                    <button class="btn btn-primary view-tournament-btn" data-tournament-id="${tournament.id}">
                        View Details
                    </button>
                    <button class="btn btn-outline register-tournament-btn" data-tournament-id="${tournament.id}">
                        Register Now
                    </button>
                </div>
            </div>
        `).join('');

        // Reattach event listeners
        initializePublicUI();
    } catch (error) {
        console.error('Error loading tournaments:', error);
        showToast('Error loading tournaments. Please try again later.', 'error');
    }
}

// Load and display public teams
async function loadPublicTeams() {
    try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        
        const teamsContainer = document.getElementById('teams-container');
        if (!teamsContainer) return;

        teamsContainer.innerHTML = teams.map(team => `
            <div class="team-card glass-card">
                <h3>${team.name}</h3>
                <p>${team.description}</p>
                <div class="team-stats">
                    <span><i class="fas fa-trophy"></i> ${team.wins} Wins</span>
                    <span><i class="fas fa-gamepad"></i> ${team.matches} Matches</span>
                    <span><i class="fas fa-star"></i> ${team.rating} Rating</span>
                </div>
                <button class="btn btn-primary view-team-btn" data-team-id="${team.id}">
                    View Team
                </button>
            </div>
        `).join('');

        // Reattach event listeners
        initializePublicUI();
    } catch (error) {
        console.error('Error loading teams:', error);
        showToast('Error loading teams. Please try again later.', 'error');
    }
}

// Load and display leaderboard
async function loadLeaderboard() {
    try {
        const response = await fetch('/api/leaderboard');
        const leaderboard = await response.json();
        
        const leaderboardContainer = document.getElementById('leaderboard-container');
        if (!leaderboardContainer) return;

        leaderboardContainer.innerHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Player</th>
                        <th>Team</th>
                        <th>Points</th>
                        <th>Wins</th>
                    </tr>
                </thead>
                <tbody>
                    ${leaderboard.map((player, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${player.name}</td>
                            <td>${player.team || 'N/A'}</td>
                            <td>${player.points}</td>
                            <td>${player.wins}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    } catch (error) {
        console.error('Error loading leaderboard:', error);
        showToast('Error loading leaderboard. Please try again later.', 'error');
    }
}

// Load and display upcoming tournaments
async function loadUpcomingTournaments() {
    try {
        const response = await fetch('/api/tournaments');
        const tournaments = await response.json();
        const upcomingTournaments = tournaments.filter(t => new Date(t.date) > new Date());
        
        const upcomingContainer = document.getElementById('upcoming-tournaments-container');
        if (!upcomingContainer) return;

        upcomingContainer.innerHTML = upcomingTournaments.map(tournament => `
            <div class="upcoming-tournament-card glass-card">
                <h3>${tournament.name}</h3>
                <p>${tournament.description}</p>
                <div class="tournament-details">
                    <span><i class="fas fa-calendar"></i> ${new Date(tournament.date).toLocaleDateString()}</span>
                    <span><i class="fas fa-users"></i> ${tournament.maxTeams} teams</span>
                    <span><i class="fas fa-trophy"></i> $${tournament.prizePool}</span>
                </div>
                <button class="btn btn-primary register-tournament-btn" data-tournament-id="${tournament.id}">
                    Register Now
                </button>
            </div>
        `).join('');

        // Reattach event listeners
        initializePublicUI();
    } catch (error) {
        console.error('Error loading upcoming tournaments:', error);
        showToast('Error loading upcoming tournaments. Please try again later.', 'error');
    }
}

// Show registration modal
function showRegistrationModal(tournamentId) {
    const modal = document.getElementById('registration-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content glass-card">
            <h2>Tournament Registration</h2>
            <form id="registration-form" class="registration-form">
                <input type="hidden" name="tournamentId" value="${tournamentId}">
                <div class="form-group">
                    <label for="teamName">Team Name</label>
                    <input type="text" id="teamName" name="teamName" required>
                </div>
                <div class="form-group">
                    <label for="captainName">Team Captain</label>
                    <input type="text" id="captainName" name="captainName" required>
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="phone">Phone</label>
                    <input type="tel" id="phone" name="phone" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Register</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('registration-modal')">Cancel</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = 'flex';
    document.getElementById('registration-form').addEventListener('submit', handleRegistration);
}

// Show tournament details modal
async function showTournamentDetails(tournamentId) {
    try {
        const response = await fetch(`/api/tournaments/${tournamentId}`);
        const tournament = await response.json();
        
        const modal = document.getElementById('tournament-details-modal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content glass-card">
                <h2>${tournament.name}</h2>
                <div class="tournament-info">
                    <p>${tournament.description}</p>
                    <div class="tournament-details">
                        <span><i class="fas fa-calendar"></i> ${new Date(tournament.date).toLocaleDateString()}</span>
                        <span><i class="fas fa-users"></i> ${tournament.maxTeams} teams</span>
                        <span><i class="fas fa-trophy"></i> $${tournament.prizePool}</span>
                    </div>
                    <div class="tournament-rules">
                        <h3>Tournament Rules</h3>
                        <ul>
                            ${tournament.rules.map(rule => `<li>${rule}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-primary register-tournament-btn" data-tournament-id="${tournament.id}">
                        Register Now
                    </button>
                    <button class="btn btn-outline" onclick="closeModal('tournament-details-modal')">Close</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
        initializePublicUI();
    } catch (error) {
        console.error('Error loading tournament details:', error);
        showToast('Error loading tournament details. Please try again later.', 'error');
    }
}

// Show team details modal
async function showTeamDetails(teamId) {
    try {
        const response = await fetch(`/api/teams/${teamId}`);
        const team = await response.json();
        
        const modal = document.getElementById('team-details-modal');
        if (!modal) return;

        modal.innerHTML = `
            <div class="modal-content glass-card">
                <h2>${team.name}</h2>
                <div class="team-info">
                    <p>${team.description}</p>
                    <div class="team-stats">
                        <span><i class="fas fa-trophy"></i> ${team.wins} Wins</span>
                        <span><i class="fas fa-gamepad"></i> ${team.matches} Matches</span>
                        <span><i class="fas fa-star"></i> ${team.rating} Rating</span>
                    </div>
                    <div class="team-members">
                        <h3>Team Members</h3>
                        <ul>
                            ${team.members.map(member => `
                                <li>
                                    <span class="member-name">${member.name}</span>
                                    <span class="member-role">${member.role}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                <div class="modal-actions">
                    <button class="btn btn-outline" onclick="closeModal('team-details-modal')">Close</button>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading team details:', error);
        showToast('Error loading team details. Please try again later.', 'error');
    }
}

// Handle tournament registration
async function handleRegistration(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const registrationData = {
        tournamentId: formData.get('tournamentId'),
        teamName: formData.get('teamName'),
        captainName: formData.get('captainName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };

    try {
        const response = await fetch('/api/registrations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
        });

        if (response.ok) {
            showToast('Registration submitted successfully!', 'success');
            closeModal('registration-modal');
            showPaymentModal(registrationData);
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Error submitting registration:', error);
        showToast('Error submitting registration. Please try again later.', 'error');
    }
}

// Show payment modal
function showPaymentModal(registrationData) {
    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    modal.innerHTML = `
        <div class="modal-content glass-card">
            <h2>Payment Details</h2>
            <form id="payment-form" class="payment-form">
                <input type="hidden" name="registrationId" value="${registrationData.tournamentId}">
                <div class="form-group">
                    <label for="cardNumber">Card Number</label>
                    <input type="text" id="cardNumber" name="cardNumber" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="expiryDate">Expiry Date</label>
                        <input type="text" id="expiryDate" name="expiryDate" placeholder="MM/YY" required>
                    </div>
                    <div class="form-group">
                        <label for="cvv">CVV</label>
                        <input type="text" id="cvv" name="cvv" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="cardName">Name on Card</label>
                    <input type="text" id="cardName" name="cardName" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Pay Now</button>
                    <button type="button" class="btn btn-outline" onclick="closeModal('payment-modal')">Cancel</button>
                </div>
            </form>
        </div>
    `;

    modal.style.display = 'flex';
    document.getElementById('payment-form').addEventListener('submit', handlePayment);
}

// Handle payment submission
async function handlePayment(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const paymentData = {
        registrationId: formData.get('registrationId'),
        cardNumber: formData.get('cardNumber'),
        expiryDate: formData.get('expiryDate'),
        cvv: formData.get('cvv'),
        cardName: formData.get('cardName')
    };

    try {
        const response = await fetch('/api/payments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        if (response.ok) {
            showToast('Payment processed successfully!', 'success');
            closeModal('payment-modal');
        } else {
            throw new Error('Payment failed');
        }
    } catch (error) {
        console.error('Error processing payment:', error);
        showToast('Error processing payment. Please try again later.', 'error');
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Show specific section
function showSection(sectionId) {
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
} 