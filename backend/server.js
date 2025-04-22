const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Models
const Tournament = require('./models/Tournament');
const Team = require('./models/Team');
const Player = require('./models/Player');
const Registration = require('./models/Registration');
const Payment = require('./models/Payment');
const Admin = require('./models/Admin');

// Authentication Middleware
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) throw new Error('No token provided');

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findById(decoded.id);
        if (!admin) throw new Error('Admin not found');

        req.admin = admin;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized' });
    }
};

// Routes

// Admin Authentication
app.post('/api/v1/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        
        if (!admin || !await bcrypt.compare(password, admin.password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Tournament Routes
app.get('/api/v1/tournaments', async (req, res) => {
    try {
        const tournaments = await Tournament.find();
        res.json(tournaments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/v1/tournaments', authMiddleware, async (req, res) => {
    try {
        const tournament = new Tournament(req.body);
        await tournament.save();
        res.status(201).json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/v1/tournaments/:id', authMiddleware, async (req, res) => {
    try {
        const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(tournament);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Team Routes
app.get('/api/v1/teams', async (req, res) => {
    try {
        const teams = await Team.find().populate('players');
        res.json(teams);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/v1/teams', authMiddleware, async (req, res) => {
    try {
        const team = new Team(req.body);
        await team.save();
        res.status(201).json(team);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Player Routes
app.get('/api/v1/players', async (req, res) => {
    try {
        const players = await Player.find().populate('team');
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/v1/players/:id/verify', authMiddleware, async (req, res) => {
    try {
        const player = await Player.findByIdAndUpdate(req.params.id, { 
            verified: true,
            ...req.body 
        }, { new: true });
        res.json(player);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Registration Routes
app.get('/api/v1/registrations', authMiddleware, async (req, res) => {
    try {
        const registrations = await Registration.find()
            .populate('tournament')
            .populate('player');
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/v1/registrations', async (req, res) => {
    try {
        const registration = new Registration(req.body);
        await registration.save();
        res.status(201).json(registration);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Payment Routes
app.get('/api/v1/payments', authMiddleware, async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('registration')
            .populate('player');
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/v1/payments/:id/process', authMiddleware, async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(req.params.id, {
            status: 'completed',
            ...req.body
        }, { new: true });
        res.json(payment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Leaderboard Routes
app.get('/api/v1/leaderboard', async (req, res) => {
    try {
        const { type = 'all' } = req.query;
        let query = {};
        
        if (type !== 'all') {
            query.tournamentType = type;
        }

        const players = await Player.find(query)
            .sort({ points: -1 })
            .limit(100)
            .populate('team');
            
        res.json(players);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 