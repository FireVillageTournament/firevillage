const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    playerId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    verificationStatus: {
        type: String,
        required: true,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending'
    },
    documents: {
        idProof: {
            url: String,
            verified: {
                type: Boolean,
                default: false
            },
            verifiedAt: Date
        },
        ageVerification: {
            url: String,
            verified: {
                type: Boolean,
                default: false
            },
            verifiedAt: Date
        },
        parentalConsent: {
            url: String,
            verified: {
                type: Boolean,
                default: false
            },
            verifiedAt: Date
        }
    },
    statistics: {
        totalTournaments: {
            type: Number,
            default: 0
        },
        wins: {
            type: Number,
            default: 0
        },
        prizeMoney: {
            type: Number,
            default: 0
        },
        playerRating: {
            type: Number,
            default: 0
        }
    },
    teams: [{
        teamId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Team'
        },
        role: {
            type: String,
            enum: ['captain', 'player', 'substitute']
        },
        joinedDate: {
            type: Date,
            default: Date.now
        }
    }],
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
        twitter: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Player', playerSchema); 