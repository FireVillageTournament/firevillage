const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    gameType: {
        type: String,
        required: true,
        enum: ['BGMI', 'Free Fire', 'Valorant']
    },
    status: {
        type: String,
        required: true,
        enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
        default: 'upcoming'
    },
    schedule: {
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        registrationDeadline: {
            type: Date,
            required: true
        }
    },
    format: {
        type: String,
        required: true,
        enum: ['single-elimination', 'double-elimination', 'round-robin']
    },
    rules: {
        type: String,
        required: true
    },
    prizePool: {
        type: Number,
        required: true,
        min: 0
    },
    entryFee: {
        type: Number,
        required: true,
        min: 0
    },
    maxTeams: {
        type: Number,
        required: true,
        min: 2
    },
    currentTeams: {
        type: Number,
        default: 0
    },
    teams: [{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        registrationDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['registered', 'approved', 'rejected', 'eliminated'],
            default: 'registered'
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'refunded'],
            default: 'pending'
        }
    }],
    matches: [{
        matchId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Match'
        },
        round: {
            type: Number,
            required: true
        },
        team1: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        team2: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        winner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        status: {
            type: String,
            enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
            default: 'scheduled'
        },
        scheduledTime: Date
    }],
    specialRules: [{
        type: String
    }],
    matchDuration: {
        type: Number, // in minutes
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Tournament', tournamentSchema); 