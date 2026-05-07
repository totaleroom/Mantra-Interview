const express = require('express');
const { getDbData, saveDbData } = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get profile
router.get('/', authenticateToken, async (req, res) => {
  try {
    const db = await getDbData();
    const profile = db.profiles.find(p => p.user_id === req.user.id);
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile tidak ditemukan' });
    }

    const responseProfile = { ...profile };
    responseProfile.module_progress = JSON.parse(responseProfile.module_progress || '{}');

    res.json(responseProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Update module progress
router.post('/progress', authenticateToken, async (req, res) => {
  const { module_progress } = req.body; // e.g., { "1": true, "2": true }

  try {
    const db = await getDbData();
    const profileIndex = db.profiles.findIndex(p => p.user_id === req.user.id);

    if (profileIndex === -1) {
      return res.status(404).json({ error: 'Profile tidak ditemukan' });
    }

    db.profiles[profileIndex].module_progress = JSON.stringify(module_progress);
    await saveDbData(db);

    const updatedProfile = { ...db.profiles[profileIndex] };
    updatedProfile.module_progress = JSON.parse(updatedProfile.module_progress || '{}');

    res.json(updatedProfile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;
