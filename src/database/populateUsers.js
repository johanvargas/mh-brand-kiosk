const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.join(__dirname, 'container.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database at:', dbPath);
  }
});

// Sample users data with diverse names and genders
const sampleUsers = [
  { name: 'Alex Johnson', username: 'alex_j', firstLogIn: 1 },
  { name: 'Maria Garcia', username: 'maria_g', firstLogIn: 0 },
  { name: 'James Wilson', username: 'james_w', firstLogIn: 1 },
  { name: 'Sarah Chen', username: 'sarah_c', firstLogIn: 0 },
  { name: 'Michael Brown', username: 'mike_b', firstLogIn: 1 },
  { name: 'Emily Davis', username: 'emily_d', firstLogIn: 0 },
  { name: 'David Rodriguez', username: 'david_r', firstLogIn: 1 },
  { name: 'Jessica Taylor', username: 'jess_t', firstLogIn: 0 },
  { name: 'Christopher Lee', username: 'chris_l', firstLogIn: 1 },
  { name: 'Amanda Martinez', username: 'amanda_m', firstLogIn: 0 },
  { name: 'Daniel Anderson', username: 'dan_a', firstLogIn: 1 },
  { name: 'Jennifer Thompson', username: 'jen_t', firstLogIn: 0 },
  { name: 'Matthew White', username: 'matt_w', firstLogIn: 1 },
  { name: 'Ashley Jackson', username: 'ash_j', firstLogIn: 0 },
  { name: 'Andrew Harris', username: 'andy_h', firstLogIn: 1 },
  { name: 'Samantha Martin', username: 'sam_m', firstLogIn: 0 },
  { name: 'Ryan Garcia', username: 'ryan_g', firstLogIn: 1 },
  { name: 'Nicole Robinson', username: 'nicole_r', firstLogIn: 0 },
  { name: 'Kevin Clark', username: 'kevin_c', firstLogIn: 1 },
  { name: 'Stephanie Lewis', username: 'steph_l', firstLogIn: 0 },
  { name: 'Brandon Walker', username: 'brandon_w', firstLogIn: 1 },
  { name: 'Rachel Hall', username: 'rachel_h', firstLogIn: 0 },
  { name: 'Tyler Allen', username: 'tyler_a', firstLogIn: 1 },
  { name: 'Lauren Young', username: 'lauren_y', firstLogIn: 0 },
  { name: 'Jordan King', username: 'jordan_k', firstLogIn: 1 },
  { name: 'Megan Wright', username: 'megan_w', firstLogIn: 0 },
  { name: 'Nathan Scott', username: 'nathan_s', firstLogIn: 1 },
  { name: 'Kayla Green', username: 'kayla_g', firstLogIn: 0 },
  { name: 'Zachary Adams', username: 'zach_a', firstLogIn: 1 },
  { name: 'Brittany Baker', username: 'brittany_b', firstLogIn: 0 },
  { name: 'Cameron Nelson', username: 'cam_n', firstLogIn: 1 },
  { name: 'Taylor Carter', username: 'taylor_c', firstLogIn: 0 },
  { name: 'Jordan Mitchell', username: 'jordan_m', firstLogIn: 1 },
  { name: 'Alexis Perez', username: 'alexis_p', firstLogIn: 0 },
  { name: 'Blake Roberts', username: 'blake_r', firstLogIn: 1 }
];

// Function to populate users table
const populateUsers = () => {
  console.log('Starting to populate users table...');
  
  db.serialize(() => {
    // Create users table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      username TEXT UNIQUE NOT NULL,
      firstLogIn BOOLEAN DEFAULT 1,
      dateCreated DATETIME DEFAULT CURRENT_TIMESTAMP,
      lastLoggedOn DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
      if (err) {
        console.error('Error creating users table:', err.message);
        return;
      }
      console.log('Users table created/verified');
    });

    // Clear existing users (optional - remove if you want to keep existing data)
    db.run('DELETE FROM users', (err) => {
      if (err) {
        console.error('Error clearing users table:', err.message);
      } else {
        console.log('Cleared existing users');
      }
    });

    // Prepare statement for inserting users
    const stmt = db.prepare(`INSERT INTO users (name, username, firstLogIn, dateCreated, lastLoggedOn) 
                             VALUES (?, ?, ?, datetime('now', '-${Math.floor(Math.random() * 365)} days'), 
                             datetime('now', '-${Math.floor(Math.random() * 30)} days'))`);

    let completed = 0;
    sampleUsers.forEach((user, index) => {
      // Add some randomness to dates
      const daysAgoCreated = Math.floor(Math.random() * 365);
      const daysAgoLogged = Math.floor(Math.random() * 30);
      
      stmt.run([user.name, user.username, user.firstLogIn], function(err) {
        if (err) {
          console.error(`Error inserting user ${user.name}:`, err.message);
        } else {
          completed++;
          console.log(`Inserted user ${completed}/${sampleUsers.length}: ${user.name} (ID: ${this.lastID})`);
          
          if (completed === sampleUsers.length) {
            stmt.finalize();
            console.log('✅ Successfully populated users table with 35 users!');
            db.close();
          }
        }
      });
    });
  });
};

// Run the population script
populateUsers();