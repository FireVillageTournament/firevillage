/**
 * Database Module for Fire Village Tournament
 * Handles all data operations for tournaments, teams, players, and registrations
 */

const fs = require('fs');
const path = require('path');

// Define data file paths
const DATA_DIR = path.join(__dirname);
const TOURNAMENTS_FILE = path.join(DATA_DIR, 'tournaments.json');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');
const PLAYERS_FILE = path.join(DATA_DIR, 'players.json');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const LEADERBOARD_FILE = path.join(DATA_DIR, 'leaderboard.json');

// Initialize data files if they don't exist
function initializeDataFiles() {
    const files = [
        { path: TOURNAMENTS_FILE, default: [] },
        { path: TEAMS_FILE, default: [] },
        { path: PLAYERS_FILE, default: [] },
        { path: REGISTRATIONS_FILE, default: [] },
        { path: LEADERBOARD_FILE, default: [] }
    ];

    files.forEach(file => {
        if (!fs.existsSync(file.path)) {
            fs.writeFileSync(file.path, JSON.stringify(file.default, null, 2));
            console.log(`Created ${file.path}`);
        }
    });
}

// Read data from a file
function readData(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return [];
    }
}

// Write data to a file
function writeData(filePath, data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing to ${filePath}:`, error);
        return false;
    }
}

// Generate a unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Tournament operations
const tournaments = {
    getAll: () => readData(TOURNAMENTS_FILE),
    
    getById: (id) => {
        const tournaments = readData(TOURNAMENTS_FILE);
        return tournaments.find(t => t.id === id);
    },
    
    getUpcoming: () => {
        const tournaments = readData(TOURNAMENTS_FILE);
        const now = new Date();
        return tournaments.filter(t => new Date(t.datetime) > now && t.status === 'upcoming');
    },
    
    getActive: () => {
        const tournaments = readData(TOURNAMENTS_FILE);
        const now = new Date();
        return tournaments.filter(t => t.status === 'ongoing');
    },
    
    getByType: (type) => {
        const tournaments = readData(TOURNAMENTS_FILE);
        return tournaments.filter(t => t.type === type);
    },
    
    create: (tournamentData) => {
        const tournaments = readData(TOURNAMENTS_FILE);
        const newTournament = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            ...tournamentData
        };
        tournaments.push(newTournament);
        writeData(TOURNAMENTS_FILE, tournaments);
        return newTournament;
    },
    
    update: (id, tournamentData) => {
        const tournaments = readData(TOURNAMENTS_FILE);
        const index = tournaments.findIndex(t => t.id === id);
        if (index === -1) return null;
        
        tournaments[index] = {
            ...tournaments[index],
            ...tournamentData,
            updatedAt: new Date().toISOString()
        };
        
        writeData(TOURNAMENTS_FILE, tournaments);
        return tournaments[index];
    },
    
    delete: (id) => {
        const tournaments = readData(TOURNAMENTS_FILE);
        const filteredTournaments = tournaments.filter(t => t.id !== id);
        if (filteredTournaments.length === tournaments.length) return false;
        
        writeData(TOURNAMENTS_FILE, filteredTournaments);
        return true;
    }
};

// Team operations
const teams = {
    getAll: () => readData(TEAMS_FILE),
    
    getById: (id) => {
        const teams = readData(TEAMS_FILE);
        return teams.find(t => t.id === id);
    },
    
    getTopTeams: (limit = 10) => {
        const teams = readData(TEAMS_FILE);
        return teams
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);
    },
    
    create: (teamData) => {
        const teams = readData(TEAMS_FILE);
        const newTeam = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            points: 0,
            wins: 0,
            kills: 0,
            ...teamData
        };
        teams.push(newTeam);
        writeData(TEAMS_FILE, teams);
        return newTeam;
    },
    
    update: (id, teamData) => {
        const teams = readData(TEAMS_FILE);
        const index = teams.findIndex(t => t.id === id);
        if (index === -1) return null;
        
        teams[index] = {
            ...teams[index],
            ...teamData,
            updatedAt: new Date().toISOString()
        };
        
        writeData(TEAMS_FILE, teams);
        return teams[index];
    },
    
    delete: (id) => {
        const teams = readData(TEAMS_FILE);
        const filteredTeams = teams.filter(t => t.id !== id);
        if (filteredTeams.length === teams.length) return false;
        
        writeData(TEAMS_FILE, filteredTeams);
        return true;
    },
    
    addMember: (teamId, playerId) => {
        const teams = readData(TEAMS_FILE);
        const index = teams.findIndex(t => t.id === teamId);
        if (index === -1) return false;
        
        if (!teams[index].members) {
            teams[index].members = [];
        }
        
        if (!teams[index].members.includes(playerId)) {
            teams[index].members.push(playerId);
            teams[index].updatedAt = new Date().toISOString();
            writeData(TEAMS_FILE, teams);
        }
        
        return true;
    },
    
    removeMember: (teamId, playerId) => {
        const teams = readData(TEAMS_FILE);
        const index = teams.findIndex(t => t.id === teamId);
        if (index === -1) return false;
        
        if (teams[index].members) {
            teams[index].members = teams[index].members.filter(id => id !== playerId);
            teams[index].updatedAt = new Date().toISOString();
            writeData(TEAMS_FILE, teams);
        }
        
        return true;
    }
};

// Player operations
const players = {
    getAll: () => readData(PLAYERS_FILE),
    
    getById: (id) => {
        const players = readData(PLAYERS_FILE);
        return players.find(p => p.id === id);
    },
    
    getTopPlayers: (limit = 10) => {
        const players = readData(PLAYERS_FILE);
        return players
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);
    },
    
    getByTeam: (teamId) => {
        const players = readData(PLAYERS_FILE);
        return players.filter(p => p.teamId === teamId);
    },
    
    create: (playerData) => {
        const players = readData(PLAYERS_FILE);
        const newPlayer = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            points: 0,
            kills: 0,
            deaths: 0,
            wins: 0,
            matches: 0,
            kdRatio: 0,
            winRate: 0,
            ...playerData
        };
        players.push(newPlayer);
        writeData(PLAYERS_FILE, players);
        return newPlayer;
    },
    
    update: (id, playerData) => {
        const players = readData(PLAYERS_FILE);
        const index = players.findIndex(p => p.id === id);
        if (index === -1) return null;
        
        // Calculate K/D ratio and win rate
        if (playerData.kills !== undefined && playerData.deaths !== undefined) {
            playerData.kdRatio = playerData.deaths > 0 ? (playerData.kills / playerData.deaths).toFixed(2) : playerData.kills;
        }
        
        if (playerData.wins !== undefined && playerData.matches !== undefined && playerData.matches > 0) {
            playerData.winRate = ((playerData.wins / playerData.matches) * 100).toFixed(1);
        }
        
        players[index] = {
            ...players[index],
            ...playerData,
            updatedAt: new Date().toISOString()
        };
        
        writeData(PLAYERS_FILE, players);
        return players[index];
    },
    
    delete: (id) => {
        const players = readData(PLAYERS_FILE);
        const filteredPlayers = players.filter(p => p.id !== id);
        if (filteredPlayers.length === players.length) return false;
        
        writeData(PLAYERS_FILE, filteredPlayers);
        return true;
    }
};

// Registration operations
const registrations = {
    getAll: () => readData(REGISTRATIONS_FILE),
    
    getById: (id) => {
        const registrations = readData(REGISTRATIONS_FILE);
        return registrations.find(r => r.id === id);
    },
    
    getByTournament: (tournamentId) => {
        const registrations = readData(REGISTRATIONS_FILE);
        return registrations.filter(r => r.tournamentId === tournamentId);
    },
    
    getByTeam: (teamId) => {
        const registrations = readData(REGISTRATIONS_FILE);
        return registrations.filter(r => r.teamId === teamId);
    },
    
    create: (registrationData) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const newRegistration = {
            id: generateId(),
            createdAt: new Date().toISOString(),
            status: 'pending',
            paymentStatus: 'pending',
            ...registrationData
        };
        registrations.push(newRegistration);
        writeData(REGISTRATIONS_FILE, registrations);
        return newRegistration;
    },
    
    update: (id, registrationData) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const index = registrations.findIndex(r => r.id === id);
        if (index === -1) return null;
        
        registrations[index] = {
            ...registrations[index],
            ...registrationData,
            updatedAt: new Date().toISOString()
        };
        
        writeData(REGISTRATIONS_FILE, registrations);
        return registrations[index];
    },
    
    delete: (id) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const filteredRegistrations = registrations.filter(r => r.id !== id);
        if (filteredRegistrations.length === registrations.length) return false;
        
        writeData(REGISTRATIONS_FILE, filteredRegistrations);
        return true;
    },
    
    approve: (id) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const index = registrations.findIndex(r => r.id === id);
        if (index === -1) return null;
        
        registrations[index].status = 'approved';
        registrations[index].updatedAt = new Date().toISOString();
        
        writeData(REGISTRATIONS_FILE, registrations);
        return registrations[index];
    },
    
    reject: (id) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const index = registrations.findIndex(r => r.id === id);
        if (index === -1) return null;
        
        registrations[index].status = 'rejected';
        registrations[index].updatedAt = new Date().toISOString();
        
        writeData(REGISTRATIONS_FILE, registrations);
        return registrations[index];
    },
    
    updatePaymentStatus: (id, paymentStatus, upiReference) => {
        const registrations = readData(REGISTRATIONS_FILE);
        const index = registrations.findIndex(r => r.id === id);
        if (index === -1) return null;
        
        registrations[index].paymentStatus = paymentStatus;
        if (upiReference) {
            registrations[index].upiReference = upiReference;
        }
        registrations[index].updatedAt = new Date().toISOString();
        
        writeData(REGISTRATIONS_FILE, registrations);
        return registrations[index];
    }
};

// Leaderboard operations
const leaderboard = {
    getAll: () => readData(LEADERBOARD_FILE),
    
    getTopPlayers: (limit = 10, type = 'all') => {
        const leaderboard = readData(LEADERBOARD_FILE);
        let filtered = leaderboard;
        
        if (type !== 'all') {
            filtered = leaderboard.filter(p => p.type === type);
        }
        
        return filtered
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);
    },
    
    getTopTeams: (limit = 10) => {
        const teams = readData(TEAMS_FILE);
        return teams
            .sort((a, b) => b.points - a.points)
            .slice(0, limit);
    },
    
    updatePlayerStats: (playerId, stats) => {
        const players = readData(PLAYERS_FILE);
        const index = players.findIndex(p => p.id === playerId);
        if (index === -1) return null;
        
        // Update player stats
        players[index].kills += stats.kills || 0;
        players[index].deaths += stats.deaths || 0;
        players[index].wins += stats.wins || 0;
        players[index].matches += stats.matches || 0;
        players[index].points += stats.points || 0;
        
        // Calculate K/D ratio and win rate
        players[index].kdRatio = players[index].deaths > 0 
            ? (players[index].kills / players[index].deaths).toFixed(2) 
            : players[index].kills;
        
        players[index].winRate = players[index].matches > 0 
            ? ((players[index].wins / players[index].matches) * 100).toFixed(1) 
            : 0;
        
        players[index].updatedAt = new Date().toISOString();
        
        writeData(PLAYERS_FILE, players);
        
        // Update leaderboard
        this.updateLeaderboardEntry(players[index]);
        
        return players[index];
    },
    
    updateTeamStats: (teamId, stats) => {
        const teams = readData(TEAMS_FILE);
        const index = teams.findIndex(t => t.id === teamId);
        if (index === -1) return null;
        
        // Update team stats
        teams[index].kills += stats.kills || 0;
        teams[index].wins += stats.wins || 0;
        teams[index].matches += stats.matches || 0;
        teams[index].points += stats.points || 0;
        
        teams[index].updatedAt = new Date().toISOString();
        
        writeData(TEAMS_FILE, teams);
        return teams[index];
    },
    
    updateLeaderboardEntry: (player) => {
        const leaderboard = readData(LEADERBOARD_FILE);
        const index = leaderboard.findIndex(p => p.id === player.id);
        
        const entry = {
            id: player.id,
            name: player.name,
            teamId: player.teamId,
            teamName: player.teamName,
            kills: player.kills,
            points: player.points,
            kdRatio: player.kdRatio,
            winRate: player.winRate,
            type: player.type || 'all',
            updatedAt: new Date().toISOString()
        };
        
        if (index === -1) {
            leaderboard.push(entry);
        } else {
            leaderboard[index] = entry;
        }
        
        writeData(LEADERBOARD_FILE, leaderboard);
        return entry;
    }
};

// Initialize data files
initializeDataFiles();

// Export the database module
module.exports = {
    tournaments,
    teams,
    players,
    registrations,
    leaderboard
}; 