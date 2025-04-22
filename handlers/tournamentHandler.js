const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
const TOURNAMENTS_FILE = path.join(DATA_DIR, 'tournaments.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Initialize tournaments file if it doesn't exist
if (!fs.existsSync(TOURNAMENTS_FILE)) {
    fs.writeFileSync(TOURNAMENTS_FILE, JSON.stringify([], null, 2));
}

// Helper function to read tournaments
const readTournaments = () => {
    try {
        const data = fs.readFileSync(TOURNAMENTS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tournaments:', error);
        return [];
    }
};

// Helper function to write tournaments
const writeTournaments = (tournaments) => {
    try {
        fs.writeFileSync(TOURNAMENTS_FILE, JSON.stringify(tournaments, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing tournaments:', error);
        return false;
    }
};

// Get all tournaments
const getAllTournaments = () => {
    return readTournaments();
};

// Get tournament by ID
const getTournamentById = (id) => {
    const tournaments = readTournaments();
    return tournaments.find(t => t.id === id);
};

// Save tournament (create or update)
const saveTournament = (tournamentData) => {
    const tournaments = readTournaments();
    
    if (tournamentData.id) {
        // Update existing tournament
        const index = tournaments.findIndex(t => t.id === tournamentData.id);
        if (index !== -1) {
            tournaments[index] = {
                ...tournaments[index],
                ...tournamentData,
                updatedAt: new Date().toISOString()
            };
        } else {
            // ID exists but tournament not found (shouldn't happen)
            return null;
        }
    } else {
        // Create new tournament
        const newTournament = {
            id: Date.now().toString(),
            ...tournamentData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        tournaments.push(newTournament);
    }
    
    if (writeTournaments(tournaments)) {
        return tournamentData.id ? 
            tournaments.find(t => t.id === tournamentData.id) : 
            tournaments[tournaments.length - 1];
    }
    
    return null;
};

// Delete tournament
const deleteTournament = (id) => {
    const tournaments = readTournaments();
    const filteredTournaments = tournaments.filter(t => t.id !== id);
    
    if (filteredTournaments.length !== tournaments.length) {
        return writeTournaments(filteredTournaments);
    }
    
    return false;
};

// Get recent activities
const getRecentActivities = () => {
    const tournaments = readTournaments();
    return tournaments
        .filter(t => t.updatedAt)
        .map(t => ({
            id: t.id,
            type: 'tournament',
            action: t.createdAt === t.updatedAt ? 'created' : 'updated',
            title: t.name,
            timestamp: t.updatedAt
        }))
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);
};

// Get participation data for charts
const getParticipationData = () => {
    const tournaments = readTournaments();
    const participationData = {
        labels: [],
        data: []
    };
    
    // Group tournaments by month
    const monthlyData = {};
    
    tournaments.forEach(tournament => {
        const date = new Date(tournament.startDate);
        const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthYear]) {
            monthlyData[monthYear] = 0;
        }
        
        monthlyData[monthYear] += tournament.participants || 0;
    });
    
    // Sort by date and format for chart
    Object.keys(monthlyData)
        .sort()
        .forEach(monthYear => {
            const [year, month] = monthYear.split('-');
            const date = new Date(year, month - 1);
            participationData.labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));
            participationData.data.push(monthlyData[monthYear]);
        });
    
    return participationData;
};

module.exports = {
    getAllTournaments,
    getTournamentById,
    saveTournament,
    deleteTournament,
    getRecentActivities,
    getParticipationData
}; 