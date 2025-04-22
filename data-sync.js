// Data Synchronization for Fire Village Website
document.addEventListener('DOMContentLoaded', function() {
    // Function to load and display tournaments on public pages
    function loadPublicTournaments() {
        const tournaments = JSON.parse(localStorage.getItem('tournaments')) || [];
        const tournamentsContainer = document.getElementById('tournamentsContainer');
        
        if (!tournamentsContainer) return;
        
        tournamentsContainer.innerHTML = '';
        
        tournaments.forEach(tournament => {
            const card = createTournamentCard(tournament);
            tournamentsContainer.appendChild(card);
        });
    }

    // Function to create tournament card for public pages
    function createTournamentCard(tournament) {
        const card = document.createElement('div');
        card.className = 'tournament-card bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300';
        
        let typeClass = 'bg-yellow-500 text-black';
        if (tournament.type === 'solo') {
            typeClass = 'bg-blue-500 text-white';
        } else if (tournament.type === 'duo') {
            typeClass = 'bg-green-500 text-white';
        }
        
        card.innerHTML = `
            <div class="relative">
                <img src="${tournament.banner || './assets/Tournament-Banner1.jpg'}" alt="${tournament.name}" class="w-full h-48 object-cover">
                <div class="absolute top-2 left-2 ${typeClass} px-3 py-1 rounded-full text-sm font-bold">${tournament.type.toUpperCase()}</div>
                <div class="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">₹${tournament.entryFee}</div>
            </div>
            <div class="p-6">
                <h3 class="text-xl font-bold text-yellow-400 mb-2">${tournament.name}</h3>
                <div class="flex items-center text-gray-300 mb-3">
                    <i class="far fa-calendar-alt mr-2"></i>
                    <span>${tournament.date}</span>
                </div>
                <div class="flex items-center text-gray-300 mb-4">
                    <i class="far fa-clock mr-2"></i>
                    <span>${tournament.time} IST</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="bg-gray-700 text-yellow-400 px-3 py-1 rounded-full text-sm">
                        ${tournament.type === 'squad' ? '4v4' : tournament.type === 'duo' ? '2v2' : '1v1'}
                    </span>
                    <a href="register.html?tournament=${tournament.id}" class="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                        Register Now
                    </a>
                </div>
            </div>
        `;
        
        return card;
    }

    // Function to load and display teams on public pages
    function loadPublicTeams() {
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        const teamsContainer = document.getElementById('teamsContainer');
        
        if (!teamsContainer) return;
        
        teamsContainer.innerHTML = '';
        
        teams.forEach(team => {
            const card = createTeamCard(team);
            teamsContainer.appendChild(card);
        });
    }

    // Function to create team card for public pages
    function createTeamCard(team) {
        const card = document.createElement('div');
        card.className = 'team-card bg-gray-800 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300';
        
        card.innerHTML = `
            <div class="p-6">
                <div class="flex items-center mb-4">
                    <img src="${team.logo || './assets/team-logo-placeholder.png'}" alt="${team.name}" class="h-16 w-16 rounded-full mr-4">
                    <div>
                        <h3 class="text-xl font-bold text-yellow-400">${team.name}</h3>
                        <span class="text-gray-400">${team.tournament}</span>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 mb-4">
                    <div class="text-center">
                        <div class="text-gray-400">Win Rate</div>
                        <div class="text-yellow-400 font-bold">${team.winRate || '0%'}</div>
                    </div>
                    <div class="text-center">
                        <div class="text-gray-400">Total Kills</div>
                        <div class="text-yellow-400 font-bold">${team.totalKills || '0'}</div>
                    </div>
                </div>
                <a href="team-details.html?id=${team.id}" class="block text-center bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300">
                    View Profile
                </a>
            </div>
        `;
        
        return card;
    }

    // Function to load and display leaderboard on public pages
    function loadPublicLeaderboard() {
        const teams = JSON.parse(localStorage.getItem('teams')) || [];
        const leaderboardContainer = document.getElementById('leaderboardContainer');
        
        if (!leaderboardContainer) return;
        
        // Sort teams by points
        const sortedTeams = teams.sort((a, b) => (b.points || 0) - (a.points || 0));
        
        leaderboardContainer.innerHTML = '';
        
        sortedTeams.forEach((team, index) => {
            const row = createLeaderboardRow(team, index + 1);
            leaderboardContainer.appendChild(row);
        });
    }

    // Function to create leaderboard row for public pages
    function createLeaderboardRow(team, rank) {
        const row = document.createElement('tr');
        row.className = 'border-t border-gray-700 hover:bg-gray-800 transition-colors duration-300';
        
        let rankClass = 'text-gray-400';
        if (rank === 1) rankClass = 'text-yellow-400';
        else if (rank === 2) rankClass = 'text-gray-300';
        else if (rank === 3) rankClass = 'text-yellow-600';
        
        row.innerHTML = `
            <td class="py-4 px-6">
                <span class="${rankClass} font-bold">#${rank}</span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <img src="${team.logo || './assets/team-logo-placeholder.png'}" alt="${team.name}" class="h-8 w-8 rounded-full mr-3">
                    <span class="text-yellow-400">${team.name}</span>
                </div>
            </td>
            <td class="py-4 px-6">${team.tournament || 'N/A'}</td>
            <td class="py-4 px-6">${team.kdRatio || '0.00'}</td>
            <td class="py-4 px-6">${team.winRate || '0%'}</td>
            <td class="py-4 px-6">${team.points || '0'}</td>
        `;
        
        return row;
    }

    // Load data based on current page
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
        case 'index.html':
        case '':
            loadPublicTournaments();
            loadPublicTeams();
            break;
        case 'tournaments.html':
            loadPublicTournaments();
            break;
        case 'teams.html':
            loadPublicTeams();
            break;
        case 'leaderboard.html':
            loadPublicLeaderboard();
            break;
    }
}); 