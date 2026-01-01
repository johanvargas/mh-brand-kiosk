const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');
const initDatabase = require('./initDatabase');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const dbPath = path.join(__dirname, 'container.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});


// API Routes

// Get all coffee drinks
app.get('/api/coffee', (req, res) => {
  db.all('SELECT * FROM coffee_drinks ORDER BY name DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

app.get('/api/coffee/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM coffee_drinks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Drink not found' });
      return;
    }
    res.json(row);
  });
});


// Get all alocoholic drinks
app.get('/api/drinkies', (req, res) => {
  db.all('SELECT * FROM alcohol_drinks ORDER BY name DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all alcoholic drinks
app.get('/api/menu', (req, res) => {
  db.all('SELECT * FROM alcohol_drinks ORDER BY name DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get alcoholic drink by id (params.id)
app.get('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM alcohol_drinks WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Drink not found' });
      return;
    }
    res.json(row);
  });
});

app.post('/api/menu', (req, res) => {
  const { name, storeId } = req.body;

  console.log("you found me")
  
  if (!name) {
    res.status(400).json({ error: 'Name is required' });
    return;
  }

  db.run(
    'INSERT INTO menu (name, storeId) VALUES (?, ?)',
    [name, storeId || null],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, storeId });
    }
  );
});

app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM menu WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }
    res.json({ message: 'Player deleted successfully' });
  });
});

/* USERS CRUD */
// Get all users
app.get('/api/users', (req, res) => {
  db.all('SELECT * FROM users ORDER BY dateCreated DESC', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get user by ID
app.get('/api/users/:name', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM users WHERE name = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(row);
  });
});

// Create new user
app.post('/api/users', (req, res) => {
  const { name, username, firstLogIn } = req.body;
  
  if (!name || !username) {
    res.status(400).json({ error: 'Name and username are required' });
    return;
  }

  db.run(
    'INSERT INTO users (name, username, firstLogIn) VALUES (?, ?, ?)',
    [name, username, firstLogIn || 1],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, name, username, firstLogIn });
    }
  );
});

// Update user login status
app.put('/api/users/:id/login', (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE users SET firstLogIn = 0, lastLoggedOn = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User login updated successfully' });
    }
  );
});

/* GENERAL SERVER FUNCTIONS & CHECKS */

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`SQLite server running on port ${PORT}`);
  initDatabase(db);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err.message);
    } else {
      console.log('Database connection closed.');
    }
    process.exit(0);
  });
});

module.exports = app;
