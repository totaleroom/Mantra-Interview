const express = require('express');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Gemini SDK. The API key must be set in the .env file.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// ── Schema definitions for structured output ──

const cvAnalysisSchema = {
  type: SchemaType.OBJECT,
  properties: {
    score: { type: SchemaType.NUMBER, description: "ATS compatibility score from 0 to 100" },
    missingKeywords: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Keywords from the job description missing in the CV" 
    },
    tips: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "3 actionable improvement tips" 
    },
  },
  required: ["score", "missingKeywords", "tips"],
};

const enhanceBulletSchema = {
  type: SchemaType.OBJECT,
  properties: {
    enhanced: { type: SchemaType.STRING, description: "The rewritten, improved bullet point text" },
  },
  required: ["enhanced"],
};

const freeCvCheckSchema = {
  type: SchemaType.OBJECT,
  properties: {
    insights: { 
      type: SchemaType.ARRAY, 
      items: { type: SchemaType.STRING },
      description: "Exactly 3 actionable tips to improve the CV" 
    },
  },
  required: ["insights"],
};

// Helper: generate structured JSON directly from Gemini
async function generateStructuredResponse(prompt, responseSchema) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing from environment variables');
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema,
    },
  });

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // With responseMimeType: "application/json", the output should always be valid JSON.
  // But we still guard against edge cases.
  try {
    return JSON.parse(text);
  } catch (parseError) {
    console.warn("Structured output parsing failed despite schema, raw:", text);
    return null;
  }
}

// 1. Analyze CV (Protected Route for Members)
router.post('/analyze-cv', authenticateToken, async (req, res) => {
  const { resumeText, jobDescription, mode, text, target_position } = req.body;
  
  try {
    let prompt = '';
    let schema;
    
    if (mode === 'enhance-bullet') {
      prompt = `You are an expert resume writer. Enhance the following resume experience bullet points to be more impactful and metric-driven for a ${target_position || 'general'} role.
      Original Text: ${text}`;
      schema = enhanceBulletSchema;
    } else {
      prompt = `Analyze this CV against the following job description (if provided). 
      Provide an ATS score out of 100, missing keywords, and 3 actionable improvement tips.
      
      Job Description: ${jobDescription || 'N/A'}
      CV Text: ${resumeText || text}`;
      schema = cvAnalysisSchema;
    }

    const result = await generateStructuredResponse(prompt, schema);

    if (result === null) {
      return res.json({ 
        score: 0,
        tips: ["Sistem AI memberikan format tidak terduga, silakan coba lagi."],
        missingKeywords: []
      });
    }

    res.json(result);
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// 2. Free CV Check (Public Route)
router.post('/free-cv-check', async (req, res) => {
  const { resumeText } = req.body;
  
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. 
    Analyze the following CV. Give exactly 3 actionable tips (insights) to improve it.
    
    CV Text: ${resumeText}`;

    const result = await generateStructuredResponse(prompt, freeCvCheckSchema);

    if (result === null) {
      return res.json({ insights: ["Terjadi kesalahan saat menganalisis CV. Silakan coba lagi."] });
    }

    res.json(result);
  } catch (error) {
    console.error("AI Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
