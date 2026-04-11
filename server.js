const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key-change-this';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

// Initialize database
function initializeDatabase() {
  db.serialize(() => {
    // Admin users table
    db.run(`CREATE TABLE IF NOT EXISTS admins (\
      id TEXT PRIMARY KEY,\
      username TEXT UNIQUE NOT NULL,\
      password TEXT NOT NULL,\
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\
    )`);

    // Categories table
    db.run(`CREATE TABLE IF NOT EXISTS categories (\
      id TEXT PRIMARY KEY,\
      name TEXT UNIQUE NOT NULL,\
      description TEXT,\
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\
    )`);

    // Software table
    db.run(`CREATE TABLE IF NOT EXISTS software (\
      id TEXT PRIMARY KEY,\
      name TEXT NOT NULL,\
      description TEXT,\
      version TEXT,\
      categoryId TEXT NOT NULL,\
      downloadUrl TEXT NOT NULL,\
      fileSize TEXT,\
      tags TEXT,\
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\
      FOREIGN KEY(categoryId) REFERENCES categories(id)\
    )`);

    // Invitation codes table
    db.run(`CREATE TABLE IF NOT EXISTS invitationCodes (\
      id TEXT PRIMARY KEY,\
      code TEXT UNIQUE NOT NULL,\
      expiresAt DATETIME NOT NULL,\
      isUsed INTEGER DEFAULT 0,\
      usedBy TEXT,\
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP\
    )`);

    // Tickets table
    db.run(`CREATE TABLE IF NOT EXISTS tickets (\
      id TEXT PRIMARY KEY,\
      title TEXT NOT NULL,\
      description TEXT,\
      status TEXT DEFAULT 'open',\
      priority TEXT DEFAULT 'medium',\
      userCode TEXT NOT NULL,\
      response TEXT,\
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,\
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP\
    )`);

    console.log('Database initialized');
  });
}

initializeDatabase();

// Helper functions
function verifyAdminToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.adminId = decoded.id;
    next();
  });
}

// ============= ADMIN ROUTES =============

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  db.get('SELECT * FROM admins WHERE username = ?', [username], (err, admin) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    bcrypt.compare(password, admin.password, (err, isMatch) => {
      if (err || !isMatch) return res.status(401).json({ error: 'Invalid credentials' });

      const token = jwt.sign({ id: admin.id }, SECRET_KEY, { expiresIn: '24h' });
      res.json({ token, adminId: admin.id });
    });
  });
});

// Create default admin (run once)
app.post('/api/admin/setup', (req, res) => {
  const adminId = uuidv4();
  const hashedPassword = bcrypt.hashSync('admin123', 10);

  db.run(
    'INSERT INTO admins (id, username, password) VALUES (?, ?, ?)',
    [adminId, 'admin', hashedPassword],
    (err) => {
      if (err) return res.status(400).json({ error: 'Admin already exists' });
      res.json({ message: 'Admin created', username: 'admin', password: 'admin123' });
    }
  );
});

// ============= CATEGORY ROUTES =============

// Get all categories
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY name', (err, categories) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(categories);
  });
});

// Create category
app.post('/api/categories', verifyAdminToken, (req, res) => {
  const { name, description } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
    [id, name, description],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id, name, description });
    }
  );
});

// Update category
app.put('/api/categories/:id', verifyAdminToken, (req, res) => {
  const { name, description } = req.body;

  db.run(
    'UPDATE categories SET name = ?, description = ? WHERE id = ?',
    [name, description, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Category updated' });
    }
  );
});

// Delete category
app.delete('/api/categories/:id', verifyAdminToken, (req, res) => {
  db.run('DELETE FROM categories WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Category deleted' });
  });
});

// ============= SOFTWARE ROUTES =============

// Get all software
app.get('/api/software', (req, res) => {
  db.all('SELECT * FROM software ORDER BY createdAt DESC', (err, software) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(software);
  });
});

// Get software by category
app.get('/api/software/category/:categoryId', (req, res) => {
  db.all(
    'SELECT * FROM software WHERE categoryId = ? ORDER BY createdAt DESC',
    [req.params.categoryId],
    (err, software) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(software);
    }
  );
});

// Create software
app.post('/api/software', verifyAdminToken, (req, res) => {
  const { name, description, version, categoryId, downloadUrl, fileSize, tags } = req.body;
  const id = uuidv4();

  db.run(
    'INSERT INTO software (id, name, description, version, categoryId, downloadUrl, fileSize, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, name, description, version, categoryId, downloadUrl, fileSize, tags],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id, name, description, version, categoryId, downloadUrl, fileSize, tags });
    }
  );
});

// Update software
app.put('/api/software/:id', verifyAdminToken, (req, res) => {
  const { name, description, version, categoryId, downloadUrl, fileSize, tags } = req.body;

  db.run(
    'UPDATE software SET name = ?, description = ?, version = ?, categoryId = ?, downloadUrl = ?, fileSize = ?, tags = ? WHERE id = ?',
    [name, description, version, categoryId, downloadUrl, fileSize, tags, req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Software updated' });
    }
  );
});

// Delete software
app.delete('/api/software/:id', verifyAdminToken, (req, res) => {
  db.run('DELETE FROM software WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Software deleted' });
  });
});

// ============= INVITATION CODE ROUTES =============

// Generate invitation code
app.post('/api/invitations/generate', verifyAdminToken, (req, res) => {
  const { durationDays } = req.body;
  const code = Math.random().toString(36).substring(2, 10).toUpperCase();
  const expiresAt = new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000);
  const id = uuidv4();

  db.run(
    'INSERT INTO invitationCodes (id, code, expiresAt) VALUES (?, ?, ?)',
    [id, code, expiresAt],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ code, expiresAt, durationDays });
    }
  );
});

// Get all invitation codes
app.get('/api/invitations', verifyAdminToken, (req, res) => {
  db.all('SELECT * FROM invitationCodes ORDER BY createdAt DESC', (err, codes) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(codes);
  });
});

// Verify and use invitation code
app.post('/api/invitations/verify', (req, res) => {
  const { code } = req.body;

  db.get('SELECT * FROM invitationCodes WHERE code = ?', [code], (err, invitation) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!invitation) return res.status(400).json({ error: 'Code not found' });

    const now = new Date();
    if (new Date(invitation.expiresAt) < now) {
      return res.status(400).json({ error: 'Code expired' });
    }

    if (invitation.isUsed) {
      return res.status(400).json({ error: 'Code already used' });
    }

    res.json({ valid: true, code });
  });
});

// Use invitation code
app.post('/api/invitations/use', (req, res) => {
  const { code } = req.body;

  db.run(
    'UPDATE invitationCodes SET isUsed = 1, usedBy = ? WHERE code = ?',
    [new Date().toISOString(), code],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Code used successfully' });
    }
  );
});

// ============= TICKET ROUTES =============

// Create ticket (using invitation code)
app.post('/api/tickets', (req, res) => {
  const { title, description, userCode } = req.body;
  const id = uuidv4();

  db.get('SELECT * FROM invitationCodes WHERE code = ?', [userCode], (err, invitation) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!invitation || !invitation.isUsed) {
      return res.status(400).json({ error: 'Invalid user code' });
    }

    db.run(
      'INSERT INTO tickets (id, title, description, userCode) VALUES (?, ?, ?, ?)',
      [id, title, description, userCode],
      (err) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id, title, description, userCode, status: 'open' });
      }
    );
  });
});

// Get all tickets (admin)
app.get('/api/tickets', verifyAdminToken, (req, res) => {
  db.all('SELECT * FROM tickets ORDER BY createdAt DESC', (err, tickets) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(tickets);
  });
});

// Update ticket status
app.put('/api/tickets/:id', verifyAdminToken, (req, res) => {
  const { status, response } = req.body;

  db.run(
    'UPDATE tickets SET status = ?, response = ?, updatedAt = ? WHERE id = ?',
    [status, response, new Date().toISOString(), req.params.id],
    (err) => {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Ticket updated' });
    }
  );
});

// ============= HOME ROUTE =============

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
