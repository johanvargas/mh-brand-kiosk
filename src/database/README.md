# SQLite3 Server

A basic Express.js server for SQLite3 database operations for the game application.

## Features

- RESTful API endpoints for players and games
- SQLite3 database with proper table relationships
- CORS enabled for frontend integration
- Error handling and validation
- Leaderboard functionality

## API Endpoints

### Players
- `GET /api/players` - Get all players
- `GET /api/players/:id` - Get player by ID
- `POST /api/players` - Create new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player

### Games
- `GET /api/games` - Get all games
- `GET /api/players/:id/games` - Get games by player
- `POST /api/games` - Create new game

### Other
- `GET /api/leaderboard` - Get top 10 players
- `GET /api/health` - Health check

## Installation

```bash
cd src/database
npm install
```

## Usage

```bash
# Start server
npm start

# Development mode with auto-restart
npm run dev
```

Server will run on port 3001 by default.

## Database Schema

### Players Table
- id (INTEGER PRIMARY KEY)
- name (TEXT NOT NULL)
- storeId (INTEGER)
- highScore (INTEGER DEFAULT 0)
- currentScore (INTEGER DEFAULT 0)
- createdAt (DATETIME)

### Games Table
- id (INTEGER PRIMARY KEY)
- playerId (INTEGER, FOREIGN KEY)
- score (INTEGER)
- throws (INTEGER)
- date (TEXT)
- createdAt (DATETIME)