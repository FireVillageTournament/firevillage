const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    tag: {
        type: String,
        required: true,
        trim: true,
        maxLength: 5
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    region: {
        type: String,
        required: true
    },
    members: [{
        playerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Player',
            required: true
        },
        role: {
            type: String,
            enum: ['captain', 'player', 'substitute'],
            required: true
        },
        joinedDate: {
            type: Date,
            default: Date.now
        }
    }],
    statistics: {
        totalMatches: {
            type: Number,
            default: 0
        },
        wins: {
            type: Number,
            default: 0
        },
        winRate: {
            type: Number,
            default: 0
        },
        totalPrizeMoney: {
            type: Number,
            default: 0
        },
        teamRating: {
            type: Number,
            default: 0
        }
    },
    achievements: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        date: {
            type: Date,
            required: true
        },
        tournament: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tournament'
        }
    }],
    socialMedia: {
        discord: String,
        instagram: String,
        twitter: String,
        youtube: String
    },
    documents: {
        teamLogo: {
            url: String,
            verified: {
                type: Boolean,
                default: false
            }
        },
        teamRegistration: {
            url: String,
            verified: {
                type: Boolean,
                default: false
            }
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Team', teamSchema); 