const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get profile (includes server-side subscription status)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const profileResult = await db.query('SELECT * FROM profiles WHERE user_id = $1', [req.user.id]);
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile tidak ditemukan' });
    }

    const profile = profileResult.rows[0];
    
    // Compute subscription status using SERVER time (not client time)
    const serverNow = new Date();
    const expiresAt = profile.license_expires_at ? new Date(profile.license_expires_at) : null;
    const isSubscriptionActive = profile.role === 'admin' || (expiresAt !== null && expiresAt > serverNow);
    const daysRemaining = expiresAt
      ? Math.max(0, Math.ceil((expiresAt.getTime() - serverNow.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    res.json({
      ...profile,
      subscription_active: isSubscriptionActive,
      days_remaining: daysRemaining,
      server_time: serverNow.toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// Dedicated subscription status check (lightweight, server-authoritative)
router.get('/subscription-status', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT role, license_expires_at FROM profiles WHERE user_id = $1',
      [req.user.id]
    );
    
    if (result.rows.length === 0) {
      return res.json({ active: false, days_remaining: 0 });
    }

    const { role, license_expires_at } = result.rows[0];
    const serverNow = new Date();
    const expiresAt = license_expires_at ? new Date(license_expires_at) : null;
    const active = role === 'admin' || (expiresAt !== null && expiresAt > serverNow);
    const daysRemaining = expiresAt
      ? Math.max(0, Math.ceil((expiresAt.getTime() - serverNow.getTime()) / (1000 * 60 * 60 * 24)))
      : 0;

    res.json({ active, days_remaining: daysRemaining, server_time: serverNow.toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Terjadi kesalahan' });
  }
});

// Update profile / progress
router.patch('/', authenticateToken, async (req, res) => {
  const { full_name, module_progress, role, license_key, license_expires_at } = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    if (full_name !== undefined) {
      updates.push(`full_name = $${idx++}`);
      values.push(full_name);
    }
    if (module_progress !== undefined) {
      updates.push(`module_progress = $${idx++}`);
      values.push(module_progress);
    }
    if (role !== undefined && req.user.role === 'admin') {
      updates.push(`role = $${idx++}`);
      values.push(role);
    }
    if (license_key !== undefined) {
      updates.push(`license_key = $${idx++}`);
      values.push(license_key);
    }
    if (license_expires_at !== undefined) {
      updates.push(`license_expires_at = $${idx++}`);
      values.push(license_expires_at);
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(req.user.id);
    const result = await db.query(
      `UPDATE profiles SET ${updates.join(', ')}, updated_at = NOW() WHERE user_id = $${idx} RETURNING *`,
      values
    );

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
