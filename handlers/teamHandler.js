const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TEAMS_FILE = path.join(DATA_DIR, 'teams.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize teams file if it doesn't exist
if (!fs.existsSync(TEAMS_FILE)) {
    fs.writeFileSync(TEAMS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read teams
const readTeams = () => {
    try {
        const data = fs.readFileSync(TEAMS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading teams:', error);
        return [];
    }
};

// Helper function to write teams
const writeTeams = (teams) => {
    try {
        fs.writeFileSync(TEAMS_FILE, JSON.stringify(teams, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing teams:', error);
        return false;
    }
};

// Get all teams
const getAllTeams = () => {
    return readTeams();
};

// Get team by ID
const getTeamById = (id) => {
    const teams = readTeams();
    return teams.find(t => t.id === id);
};

// Save team (create or update)
const saveTeam = (teamData) => {
    const teams = readTeams();
    
    if (teamData.id) {
        // Update existing team
        const index = teams.findIndex(t => t.id === teamData.id);
        if (index !== -1) {
            teams[index] = {
                ...teams[index],
                ...teamData,
                updatedAt: new Date().toISOString()
            };
        } else {
            // ID exists but team not found (shouldn't happen)
            return null;
        }
    } else {
        // Create new team
        const newTeam = {
            id: Date.now().toString(),
            ...teamData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            points: 0,
            matchesPlayed: 0,
            wins: 0,
            losses: 0
        };
        teams.push(newTeam);
    }
    
    if (writeTeams(teams)) {
        return teamData.id ? 
            teams.find(t => t.id === teamData.id) : 
            teams[teams.length - 1];
    }
    
    return null;
};

// Delete team
const deleteTeam = (id) => {
    const teams = readTeams();
    const filteredTeams = teams.filter(t => t.id !== id);
    
    if (filteredTeams.length !== teams.length) {
        return writeTeams(filteredTeams);
    }
    
    return false;
};

// Update team stats
const updateTeamStats = (teamId, stats) => {
    const teams = readTeams();
    const teamIndex = teams.findIndex(t => t.id === teamId);
    
    if (teamIndex !== -1) {
        teams[teamIndex] = {
            ...teams[teamIndex],
            ...stats,
            updatedAt: new Date().toISOString()
        };
        return writeTeams(teams);
    }
    
    return false;
};

// Get top teams for leaderboard
const getTopTeams = (limit = 10) => {
    const teams = readTeams();
    return teams
        .sort((a, b) => b.points - a.points)
        .slice(0, limit)
        .map(team => ({
            id: team.id,
            name: team.name,
            points: team.points,
            matchesPlayed: team.matchesPlayed,
            wins: team.wins,
            losses: team.losses,
            winRate: team.matchesPlayed > 0 ? 
                ((team.wins / team.matchesPlayed) * 100).toFixed(1) : 0
        }));
};

// Get recent activities
const getRecentActivities = () => {
    const teams = readTeams();
    return teams
        .filter(t => t.updatedAt)
        .map(t => ({
            id: t.id,
            type: 'team',
            action: t.createdAt === t.updatedAt ? 'created' : 'updated',
            title: t.name,
            timestamp: t.updatedAt
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
};

module.exports = {
    getAllTeams,
    getTeamById,
    saveTeam,
    deleteTeam,
    updateTeamStats,
    getTopTeams,
    getRecentActivities
}; 