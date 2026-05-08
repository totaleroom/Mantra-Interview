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
    const modulesPath = path.join(__dirname, '../data/modules.json');
    if (fs.existsSync(modulesPath)) {
      const modulesData = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
      let moduleContent;
      if (Array.isArray(modulesData)) {
        moduleContent = modulesData.find(m => m.module_id === String(module_id));
      } else {
        moduleContent = modulesData[module_id];
      }
      if (moduleContent) {
        res.json({
          id: module_id,
          title: moduleContent.title,
          sections: moduleContent.sections
        });
      } else {
        res.status(404).json({ error: 'Module not found' });
      }
    } else {
      res.status(500).json({ error: 'Modules data missing' });
    }
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
      correct: true, 
      results: answers.map(() => ({ correct: true }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
