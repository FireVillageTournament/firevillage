# Fire Village Tournament Management System

A comprehensive tournament management system for Free Fire esports tournaments. This system provides a robust admin dashboard for managing tournaments, teams, players, registrations, and leaderboards.

## Features

- **Secure Admin Authentication**: Password-protected admin access
- **Tournament Management**: Create, edit, and manage tournaments
- **Team Management**: Register and manage teams
- **Player Management**: Track player statistics and performance
- **Registration System**: Handle tournament registrations
- **Leaderboard**: Track and display tournament standings
- **Mobile-Friendly**: Responsive design for all devices

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/fire-village-tournament.git
   cd fire-village-tournament
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

   For development with auto-reload:
   ```bash
   npm run dev
   ```

4. Access the application:
   - Admin Dashboard: http://localhost:3000/admin-dashboard.html
   - Admin Login: http://localhost:3000/admin-login.html

## Admin Access

- **URL**: /admin-login.html
- **Password**: 2580aauFVT

## Project Structure

```
fire-village-tournament/
├── data/                  # JSON data files
├── public/               # Static files
│   ├── css/             # Stylesheets
│   ├── js/              # JavaScript files
│   └── images/          # Image assets
├── server.js            # Express server
├── package.json         # Project dependencies
└── README.md            # Project documentation
```

## API Endpoints

### Tournaments
- `GET /api/tournaments` - Get all tournaments
- `GET /api/tournaments/:id` - Get a specific tournament
- `POST /api/tournaments` - Create a new tournament
- `PUT /api/tournaments/:id` - Update a tournament
- `DELETE /api/tournaments/:id` - Delete a tournament

### Teams
- `GET /api/teams` - Get all teams
- `GET /api/teams/:id` - Get a specific team
- `POST /api/teams` - Create a new team
- `PUT /api/teams/:id` - Update a team
- `DELETE /api/teams/:id` - Delete a team

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get a specific player
- `POST /api/players` - Create a new player
- `PUT /api/players/:id` - Update a player
- `DELETE /api/players/:id` - Delete a player

### Registrations
- `GET /api/registrations` - Get all registrations
- `GET /api/registrations/:id` - Get a specific registration
- `POST /api/registrations` - Create a new registration
- `PUT /api/registrations/:id` - Update a registration
- `DELETE /api/registrations/:id` - Delete a registration

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard entries
- `POST /api/leaderboard` - Add a leaderboard entry
- `PUT /api/leaderboard/:id` - Update a leaderboard entry
- `DELETE /api/leaderboard/:id` - Delete a leaderboard entry

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Free Fire for the game inspiration
- Express.js for the backend framework
- Chart.js for data visualization
