const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profileResult = await db.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile tidak ditemukan' });
    }

    res.json(profileResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Update module progress
router.post('/progress', authenticateToken, async (req, res) => {
  const { module_progress } = req.body; // e.g., { "1": true, "2": true }

  try {
    const profileResult = await db.query(
      'UPDATE profiles SET module_progress = $1 WHERE user_id = $2 RETURNING *',
      [module_progress, req.user.id]
    );

    res.json(profileResult.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
