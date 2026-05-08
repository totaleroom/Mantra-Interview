const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Gemini SDK. The API key must be set in the .env file.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// Helper to handle AI requests
async function generateAIResponse(prompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  return result.response.text();
}

// 1. Analyze CV (Protected Route for Members)
router.post('/analyze-cv', authenticateToken, async (req, res) => {
  const { resumeText, jobDescription, mode, text, target_position } = req.body;
  
  try {
    let prompt = '';
    
    if (mode === 'enhance-bullet') {
      prompt = `You are an expert resume writer. Enhance the following resume experience bullet points to be more impactful and metric-driven for a ${target_position || 'general'} role.
      Original Text: ${text}
      Format the response exactly as JSON with key: "enhanced" (string containing the new text).`;
    } else {
      // General full CV analysis
      prompt = `Analyze this CV against the following job description (if provided). 
      Provide an ATS score out of 100, missing keywords, and 3 actionable improvement tips.
      Format the response as JSON with keys: "score" (number), "missingKeywords" (array of strings), "tips" (array of strings).
      
      Job Description: ${jobDescription || 'N/A'}
      CV Text: ${resumeText || text}`;
    }

    const rawResponse = await generateAIResponse(prompt);
    const cleanedJsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedJsonString);

    res.json(result);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// 2. Free CV Check (Public Route)
router.post('/free-cv-check', async (req, res) => {
  const { resumeText } = req.body;
  
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. 
    Analyze the following CV. Give exactly 3 actionable tips (insights) to improve it.
    Format the response as JSON with key: "insights" (array of strings).
    
    CV Text: ${resumeText}`;

    const rawResponse = await generateAIResponse(prompt);
    const cleanedJsonString = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
    const result = JSON.parse(cleanedJsonString);

    res.json(result);
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
