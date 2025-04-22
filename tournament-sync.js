// Tournament Sync Module
// This module handles the synchronization of tournament data

// Sample tournament data
let tournaments = [
    {
        id: '1',
        name: 'Weekly Squad Showdown',
        datetime: '2023-06-15T18:00',
        type: 'squad',
        entryFee: 1000,
        prizePool: 50000,
        status: 'upcoming',
        map: 'erangel',
        maxParticipants: 100,
        description: 'Weekly tournament for squad players',
        rules: 'Standard tournament rules apply'
    },
    {
        id: '2',
        name: 'Duo Battle Royale',
        datetime: '2023-06-20T19:00',
        type: 'duo',
        entryFee: 500,
        prizePool: 25000,
        status: 'upcoming',
        map: 'miramar',
        maxParticipants: 50,
        description: 'Battle royale tournament for duo teams',
        rules: 'Standard tournament rules apply'
    },
    {
        id: '3',
        name: 'Solo Championship',
        datetime: '2023-06-25T20:00',
        type: 'solo',
        entryFee: 300,
        prizePool: 15000,
        status: 'upcoming',
        map: 'sanhok',
        maxParticipants: 100,
        description: 'Championship tournament for solo players',
        rules: 'Standard tournament rules apply'
    }
];

// Get all tournaments
function getAllTournaments() {
    return tournaments;
}

// Get tournament by ID
function getTournamentById(id) {
    return tournaments.find(tournament => tournament.id === id);
}

// Save tournament
function saveTournament(tournamentData) {
    const index = tournaments.findIndex(t => t.id === tournamentData.id);
    
    if (index !== -1) {
        // Update existing tournament
        tournaments[index] = tournamentData;
    } else {
        // Add new tournament
        tournaments.push(tournamentData);
    }
    
    // In a real application, this would sync with a backend
    console.log('Tournament saved:', tournamentData);
    
    return tournamentData;
}

// Delete tournament
function deleteTournament(id) {
    tournaments = tournaments.filter(tournament => tournament.id !== id);
    
    // In a real application, this would sync with a backend
    console.log('Tournament deleted:', id);
    
    return true;
}

// Filter tournaments
function filterTournaments(filters) {
    return tournaments.filter(tournament => {
        let matches = true;
        
        if (filters.name && !tournament.name.toLowerCase().includes(filters.name.toLowerCase())) {
            matches = false;
        }
        
        if (filters.type && tournament.type !== filters.type) {
            matches = false;
        }
        
        if (filters.status && tournament.status !== filters.status) {
            matches = false;
        }
        
        return matches;
    });
}

// Export functions
module.exports = {
    getAllTournaments,
    getTournamentById,
    saveTournament,
    deleteTournament,
    filterTournaments
}; 