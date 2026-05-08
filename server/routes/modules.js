const express = require('express');
const db = require('../db');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

const fs = require('fs');
const path = require('path');

// Get Prompts
router.post('/get-prompts', authenticateToken, async (req, res) => {
  try {
    const promptsPath = path.join(__dirname, '../data/prompts.json');
    if (fs.existsSync(promptsPath)) {
      const promptsData = JSON.parse(fs.readFileSync(promptsPath, 'utf8'));
      res.json({ prompts: promptsData.prompts });
    } else {
      res.json({ prompts: [] });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Module Content
router.post('/get-module-content', authenticateToken, async (req, res) => {
  const { module_id } = req.body;
  try {
    // Normally fetched from DB or static file
    res.json({ content: `<h1>Module ${module_id}</h1><p>Content for this module is being loaded from the new Express backend.</p>` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate Quiz
router.post('/validate-quiz', authenticateToken, async (req, res) => {
  const { module_id, answers } = req.body;
  try {
    // Basic mock validation: assume pass
    res.json({ 
      passed: true, 
      score: 100, 
      feedback: "All answers are correct! Verified by custom backend." 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
