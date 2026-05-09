const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Get all CVs for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(
      'SELECT * FROM cv_data WHERE user_id = $1 ORDER BY updated_at DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new CV draft
router.post('/', authenticateToken, async (req, res) => {
  const { cv_name, target_position, summary, personal_info, experiences, education, skills, certifications, languages } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO cv_data (user_id, cv_name, target_position, summary, personal_info, experiences, education, skills, certifications, languages)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [req.user.id, cv_name || 'Draft CV', target_position, summary, personal_info || {}, experiences || [], education || [], skills || [], certifications || [], languages || []]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update CV draft
router.patch('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    const updates = [];
    const values = [];
    let idx = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (['cv_name', 'target_position', 'summary', 'personal_info', 'experiences', 'education', 'skills', 'certifications', 'languages', 'ai_analysis'].includes(key)) {
        updates.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });

    values.push(id, req.user.id);
    const result = await db.query(
      `UPDATE cv_data SET ${updates.join(', ')}, updated_at = NOW() WHERE id = $${idx} AND user_id = $${idx+1} RETURNING *`,
      values
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'CV not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete CV
router.delete('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      'DELETE FROM cv_data WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'CV not found' });
    res.json({ message: 'CV deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
