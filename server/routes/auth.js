const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { getDbData, saveDbData } = require('../db');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key';

// Register
router.post('/register', async (req, res) => {
  const { email, password, full_name } = req.body;
  
  try {
    const db = await getDbData();
    
    // Check if user exists
    const existingUser = db.users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email sudah terdaftar' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userId = uuidv4();
    const profileId = uuidv4();

    // Insert user
    db.users.push({
      id: userId,
      email,
      password_hash: hashedPassword,
      created_at: new Date().toISOString()
    });

    // Create profile
    db.profiles.push({
      id: profileId,
      user_id: userId,
      full_name,
      module_progress: '{}',
      created_at: new Date().toISOString()
    });

    await saveDbData(db);

    // Generate token
    const token = jwt.sign({ id: userId, email: email }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ 
      user: { id: userId, email: email }, 
      token 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const db = await getDbData();
    const user = db.users.find(u => u.email === email);

    if (!user) {
      return res.status(400).json({ error: 'Email atau password salah' });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      user: { id: user.id, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
