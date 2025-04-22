const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true
    },
    round: {
        type: Number,
        required: true
    },
    team1: {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        kills: {
            type: Number,
            default: 0
        },
        placement: {
            type: Number,
            default: null
        }
    },
    team2: {
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team',
            required: true
        },
        score: {
            type: Number,
            default: 0
        },
        kills: {
            type: Number,
            default: 0
        },
        placement: {
            type: Number,
            default: null
        }
    },
    status: {
        type: String,
        enum: ['scheduled', 'ongoing', 'completed', 'cancelled'],
        default: 'scheduled'
    },
    scheduledTime: {
        type: Date,
        required: true
    },
    startTime: Date,
    endTime: Date,
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    map: {
        type: String,
        required: true
    },
    matchType: {
        type: String,
        enum: ['solo', 'duo', 'squad'],
        required: true
    },
    matchDetails: {
        duration: Number, // in minutes
        totalKills: {
            type: Number,
            default: 0
        },
        highlights: [{
            timestamp: Date,
            description: String,
            player: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Player'
            }
        }]
    },
    streamLink: String,
    vodLink: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Match', matchSchema); 