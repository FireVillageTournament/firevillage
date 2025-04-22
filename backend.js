// Backend Server Configuration
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Database Configuration
const db = {
    tournaments: [],
    teams: [],
    players: [],
    registrations: [],
    payments: []
};

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API Routes

// Tournament Routes
app.get('/api/tournaments', (req, res) => {
    res.json(db.tournaments);
});

app.post('/api/tournaments', (req, res) => {
    const tournament = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        status: 'upcoming'
    };
    db.tournaments.push(tournament);
    res.json(tournament);
});

app.put('/api/tournaments/:id', (req, res) => {
    const index = db.tournaments.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        db.tournaments[index] = { ...db.tournaments[index], ...req.body };
        res.json(db.tournaments[index]);
    } else {
        res.status(404).json({ error: 'Tournament not found' });
    }
});

app.delete('/api/tournaments/:id', (req, res) => {
    const index = db.tournaments.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        db.tournaments.splice(index, 1);
        res.json({ message: 'Tournament deleted successfully' });
    } else {
        res.status(404).json({ error: 'Tournament not found' });
    }
});

// Team Routes
app.get('/api/teams', (req, res) => {
    res.json(db.teams);
});

app.post('/api/teams', (req, res) => {
    const team = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        status: 'active'
    };
    db.teams.push(team);
    res.json(team);
});

app.put('/api/teams/:id', (req, res) => {
    const index = db.teams.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        db.teams[index] = { ...db.teams[index], ...req.body };
        res.json(db.teams[index]);
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

app.delete('/api/teams/:id', (req, res) => {
    const index = db.teams.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
        db.teams.splice(index, 1);
        res.json({ message: 'Team deleted successfully' });
    } else {
        res.status(404).json({ error: 'Team not found' });
    }
});

// Player Routes
app.get('/api/players', (req, res) => {
    res.json(db.players);
});

app.post('/api/players', (req, res) => {
    const player = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        status: 'active'
    };
    db.players.push(player);
    res.json(player);
});

app.put('/api/players/:id', (req, res) => {
    const index = db.players.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        db.players[index] = { ...db.players[index], ...req.body };
        res.json(db.players[index]);
    } else {
        res.status(404).json({ error: 'Player not found' });
    }
});

// Registration Routes
app.get('/api/registrations', (req, res) => {
    res.json(db.registrations);
});

app.post('/api/registrations', (req, res) => {
    const registration = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        status: 'pending'
    };
    db.registrations.push(registration);
    res.json(registration);
});

app.put('/api/registrations/:id', (req, res) => {
    const index = db.registrations.findIndex(r => r.id === req.params.id);
    if (index !== -1) {
        db.registrations[index] = { ...db.registrations[index], ...req.body };
        res.json(db.registrations[index]);
    } else {
        res.status(404).json({ error: 'Registration not found' });
    }
});

// Payment Routes
app.get('/api/payments', (req, res) => {
    res.json(db.payments);
});

app.post('/api/payments', (req, res) => {
    const payment = {
        id: Date.now().toString(),
        ...req.body,
        createdAt: new Date(),
        status: 'pending'
    };
    db.payments.push(payment);
    res.json(payment);
});

app.put('/api/payments/:id', (req, res) => {
    const index = db.payments.findIndex(p => p.id === req.params.id);
    if (index !== -1) {
        db.payments[index] = { ...db.payments[index], ...req.body };
        res.json(db.payments[index]);
    } else {
        res.status(404).json({ error: 'Payment not found' });
    }
});

// Leaderboard Routes
app.get('/api/leaderboard', (req, res) => {
    const leaderboard = db.players
        .map(player => ({
            ...player,
            points: calculatePlayerPoints(player)
        }))
        .sort((a, b) => b.points - a.points);
    res.json(leaderboard);
});

// Utility Functions
function calculatePlayerPoints(player) {
    // Implement points calculation logic based on player's performance
    return Math.floor(Math.random() * 1000); // Placeholder
}

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 