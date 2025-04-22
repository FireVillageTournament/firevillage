/**
 * Server Module for Fire Village Tournament
 * Handles API endpoints and connects frontend with database
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Import data handlers
const tournamentHandler = require('./handlers/tournamentHandler');
const teamHandler = require('./handlers/teamHandler');
const playerHandler = require('./handlers/playerHandler');
const leaderboardHandler = require('./handlers/leaderboardHandler');
const registrationHandler = require('./handlers/registrationHandler');
const paymentHandler = require('./handlers/paymentHandler');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'fire-village-secret-key'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.adminId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// Admin authentication routes
app.post('/api/admin/login', async (req, res) => {
    const { password } = req.body;
    
    // Check if password matches the admin password
    if (password === '2580aauFVT') {
        const token = jwt.sign({ adminId: 'admin' }, JWT_SECRET, { expiresIn: '1d' });
        return res.json({ token, message: 'Login successful' });
    }
    
    return res.status(401).json({ error: 'Invalid password' });
});

// Tournament routes
app.get('/api/tournaments', (req, res) => {
    const tournaments = tournamentHandler.getAllTournaments();
    res.json(tournaments);
});

app.get('/api/tournaments/upcoming', (req, res) => {
    const tournaments = tournamentHandler.getAllTournaments();
    const upcomingTournaments = tournaments.filter(t => new Date(t.endDate) > new Date());
    res.json(upcomingTournaments);
});

app.get('/api/tournaments/active', (req, res) => {
    const tournaments = tournamentHandler.getAllTournaments();
    const activeTournaments = tournaments.filter(t => new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date());
    res.json(activeTournaments);
});

app.get('/api/tournaments/:id', (req, res) => {
    const tournament = tournamentHandler.getTournamentById(req.params.id);
    if (tournament) {
        res.json(tournament);
    } else {
        res.status(404).json({ error: 'Tournament not found' });
    }
});

app.post('/api/tournaments', authenticateAdmin, (req, res) => {
    const newTournament = tournamentHandler.saveTournament(req.body);
    res.status(201).json(newTournament);
});

app.put('/api/tournaments/:id', authenticateAdmin, (req, res) => {
    const updatedTournament = tournamentHandler.saveTournament(req.body);
    res.json(updatedTournament);
});

app.delete('/api/tournaments/:id', authenticateAdmin, (req, res) => {
    const success = tournamentHandler.deleteTournament(req.params.id);
    if (success) {
        res.json({ message: 'Tournament deleted successfully' });
    } else {
        res.status(404).json({ error: 'Tournament not found' });
    }
});

// Team routes
app.get('/api/teams', (req, res) => {
    const teams = teamHandler.getAllTeams();
    res.json(teams);
});

app.get('/api/teams/top', (req, res) => {
    const teams = teamHandler.getAllTeams();
    const topTeams = teams.sort((a, b) => b.points - a.points).slice(0, 10);
    res.json(topTeams);
});

app.get('/api/teams/:id', (req, res) => {
    const team = teamHandler.getTeamById(req.params.id);
    if (team) {
        res.json(team);
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

app.post('/api/teams', authenticateAdmin, (req, res) => {
    const newTeam = teamHandler.saveTeam(req.body);
    res.status(201).json(newTeam);
});

app.put('/api/teams/:id', authenticateAdmin, (req, res) => {
    const updatedTeam = teamHandler.saveTeam(req.body);
    res.json(updatedTeam);
});

app.delete('/api/teams/:id', authenticateAdmin, (req, res) => {
    const success = teamHandler.deleteTeam(req.params.id);
    if (success) {
        res.json({ message: 'Team deleted successfully' });
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

// Player routes
app.get('/api/players', (req, res) => {
    const players = playerHandler.getAllPlayers();
    res.json(players);
});

app.get('/api/players/top', (req, res) => {
    const players = playerHandler.getAllPlayers();
    const topPlayers = players.sort((a, b) => b.points - a.points).slice(0, 10);
    res.json(topPlayers);
});

app.get('/api/players/team/:teamId', (req, res) => {
    const players = playerHandler.getAllPlayers();
    const teamPlayers = players.filter(p => p.teamId === req.params.teamId);
    res.json(teamPlayers);
});

app.get('/api/players/:id', (req, res) => {
    const player = playerHandler.getPlayerById(req.params.id);
    if (player) {
        res.json(player);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

app.post('/api/players', authenticateAdmin, (req, res) => {
    const newPlayer = playerHandler.savePlayer(req.body);
    res.status(201).json(newPlayer);
});

app.put('/api/players/:id', authenticateAdmin, (req, res) => {
    const updatedPlayer = playerHandler.savePlayer(req.body);
    res.json(updatedPlayer);
});

app.delete('/api/players/:id', authenticateAdmin, (req, res) => {
    const success = playerHandler.deletePlayer(req.params.id);
    if (success) {
        res.json({ message: 'Player deleted successfully' });
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

// Leaderboard routes
app.get('/api/leaderboard', (req, res) => {
    const { type = 'all' } = req.query;
    const leaderboard = leaderboardHandler.getLeaderboard(type);
    res.json(leaderboard);
});

app.post('/api/leaderboard/update', authenticateAdmin, (req, res) => {
    const { playerId, tournamentId, kills, points, rank } = req.body;
    const updatedEntry = leaderboardHandler.updateLeaderboardEntry(playerId, tournamentId, kills, points, rank);
    res.json(updatedEntry);
});

// Registration routes
app.get('/api/registrations', authenticateAdmin, (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    res.json(registrations);
});

app.get('/api/registrations/tournament/:tournamentId', authenticateAdmin, (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    const tournamentRegistrations = registrations.filter(r => r.tournamentId === req.params.tournamentId);
    res.json(tournamentRegistrations);
});

app.get('/api/registrations/team/:teamId', authenticateAdmin, (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    const teamRegistrations = registrations.filter(r => r.teamId === req.params.teamId);
    res.json(teamRegistrations);
});

app.get('/api/registrations/:id', authenticateAdmin, (req, res) => {
    const registration = registrationHandler.getRegistrationById(req.params.id);
    if (registration) {
        res.json(registration);
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

app.post('/api/registrations', (req, res) => {
    const newRegistration = registrationHandler.saveRegistration(req.body);
    res.status(201).json(newRegistration);
});

app.put('/api/registrations/:id', authenticateAdmin, (req, res) => {
    const updatedRegistration = registrationHandler.saveRegistration(req.body);
    res.json(updatedRegistration);
});

app.delete('/api/registrations/:id', authenticateAdmin, (req, res) => {
    const success = registrationHandler.deleteRegistration(req.params.id);
    if (success) {
        res.json({ message: 'Registration deleted successfully' });
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

app.post('/api/registrations/:id/approve', authenticateAdmin, (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    const index = registrations.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        registrations[index].status = 'approved';
        registrationHandler.saveRegistrations(registrations);
        res.json(registrations[index]);
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

app.post('/api/registrations/:id/reject', authenticateAdmin, (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    const index = registrations.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        registrations[index].status = 'rejected';
        registrationHandler.saveRegistrations(registrations);
        res.json(registrations[index]);
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

app.post('/api/registrations/:id/payment', (req, res) => {
    const registrations = registrationHandler.getAllRegistrations();
    const index = registrations.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        registrations[index].paymentStatus = req.body.paymentStatus;
        registrations[index].upiReference = req.body.upiReference;
        registrationHandler.saveRegistrations(registrations);
        res.json(registrations[index]);
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

// Payment routes
app.get('/api/payments', authenticateAdmin, (req, res) => {
    const payments = paymentHandler.getAllPayments();
    res.json(payments);
});

app.get('/api/payments/:id', authenticateAdmin, (req, res) => {
    const payment = paymentHandler.getPaymentById(req.params.id);
    if (payment) {
        res.json(payment);
    } else {
        res.status(404).json({ error: 'Payment not found' });
    }
});

app.post('/api/payments', (req, res) => {
    const newPayment = paymentHandler.savePayment(req.body);
    res.status(201).json(newPayment);
});

app.put('/api/payments/:id', authenticateAdmin, (req, res) => {
    const updatedPayment = paymentHandler.savePayment(req.body);
    res.json(updatedPayment);
});

// Dashboard statistics
app.get('/api/dashboard/stats', authenticateAdmin, (req, res) => {
    const stats = {
        totalTournaments: tournamentHandler.getAllTournaments().length,
        activeTournaments: tournamentHandler.getAllTournaments().filter(t => t.status === 'active').length,
        totalTeams: teamHandler.getAllTeams().length,
        totalRevenue: paymentHandler.getAllPayments().reduce((sum, payment) => sum + payment.amount, 0),
        recentActivities: [
            ...tournamentHandler.getRecentActivities(),
            ...teamHandler.getRecentActivities(),
            ...playerHandler.getRecentActivities(),
            ...registrationHandler.getRecentActivities(),
            ...paymentHandler.getRecentActivities()
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10),
        upcomingTournaments: tournamentHandler.getAllTournaments()
            .filter(t => t.status === 'upcoming')
            .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
            .slice(0, 5),
        recentRegistrations: registrationHandler.getAllRegistrations()
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, 5)
    };
    
    res.json(stats);
});

// Dashboard charts data
app.get('/api/dashboard/charts', authenticateAdmin, (req, res) => {
    const participationData = tournamentHandler.getParticipationData();
    const revenueData = paymentHandler.getRevenueData();
    
    res.json({
        participation: participationData,
        revenue: revenueData
    });
});

// Public Tournament Routes
app.get('/api/tournaments', async (req, res) => {
    try {
        const tournaments = await mongoose.model('Tournament').find()
            .select('name status schedule prizePool entryFee maxTeams currentTeams')
            .sort({ 'schedule.startDate': 1 });
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/tournaments/register', async (req, res) => {
    try {
        const { tournamentId, teamName, teamTag } = req.body;
        
        // Validate tournament
        const tournament = await mongoose.model('Tournament').findById(tournamentId);
        if (!tournament) {
            return res.status(404).json({ message: 'Tournament not found' });
        }
        
        if (tournament.status !== 'upcoming') {
            return res.status(400).json({ message: 'Tournament registration is closed' });
        }
        
        if (tournament.currentTeams >= tournament.maxTeams) {
            return res.status(400).json({ message: 'Tournament is full' });
        }
        
        // Create or get team
        let team = await mongoose.model('Team').findOne({ tag: teamTag });
        if (!team) {
            team = new mongoose.model('Team')({
                name: teamName,
                tag: teamTag,
                status: 'active'
            });
            await team.save();
        }
        
        // Add team to tournament
        tournament.teams.push({
            teamId: team._id,
            status: 'registered'
        });
        tournament.currentTeams += 1;
        await tournament.save();
        
        res.json({ message: 'Successfully registered for tournament' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Public Team Routes
app.get('/api/teams/user', async (req, res) => {
    try {
        // In a real app, you would get the user ID from the session/token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Please login to view your teams' });
        }
        
        const teams = await mongoose.model('Team').find({ 'members.playerId': userId })
            .select('name tag status region members statistics')
            .populate('members.playerId', 'name playerId');
            
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/teams', async (req, res) => {
    try {
        // In a real app, you would get the user ID from the session/token
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).json({ message: 'Please login to create a team' });
        }
        
        const { name, tag, region } = req.body;
        
        // Check if tag is already taken
        const existingTeam = await mongoose.model('Team').findOne({ tag });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team tag is already taken' });
        }
        
        const team = new mongoose.model('Team')({
            name,
            tag,
            region,
            members: [{
                playerId: userId,
                role: 'captain'
            }]
        });
        
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Public Match Routes
app.get('/api/matches/upcoming', async (req, res) => {
    try {
        const matches = await mongoose.model('Match').find({ 
            status: 'scheduled',
            scheduledTime: { $gt: new Date() }
        })
        .populate('tournament', 'name')
        .populate('team1.teamId', 'name tag')
        .populate('team2.teamId', 'name tag')
        .sort({ scheduledTime: 1 })
        .limit(10);
        
        res.json(matches);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});