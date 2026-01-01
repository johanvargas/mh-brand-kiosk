const initDatabase = (db) => {
  db.serialize(() => {
    // menu table
    db.run(`CREATE TABLE IF NOT EXISTS menu (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      storeId INTEGER,
      highScore INTEGER DEFAULT 0,
      currentScore INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // alcohol_drinks table
    db.run(`CREATE TABLE IF NOT EXISTS alcohol_drinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT,
      price DECIMAL(10,2),
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // coffee_drinks table
    db.run(`CREATE TABLE IF NOT EXISTS coffee_drinks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size TEXT,
      price DECIMAL(10,2),
      description TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Users table
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      firstLogIn BOOLEAN DEFAULT 1,
      dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLoggedOn DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('Database tables initialized');
  });
};

module.exports = initDatabase;