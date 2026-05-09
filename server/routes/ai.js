const express = require('express');
const { GoogleGenerativeAI, SchemaType } = require('@google/generative-ai');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Initialize Gemini SDK. The API key must be set in the .env file.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

// ── Constants ──
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 1000;

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

// ── Custom Error Classes ──

class AIServiceError extends Error {
  constructor(message, originalError) {
    super(message);
    this.name = 'AIServiceError';
    this.statusCode = 502; // Bad Gateway — upstream AI failed
    this.originalError = originalError;
  }
}

class AIParseError extends Error {
  constructor(rawText) {
    super('AI returned unparseable response');
    this.name = 'AIParseError';
    this.statusCode = 502;
    this.rawText = rawText;
  }
}

// ── Validation helpers (lightweight Zod-like checks) ──

function validateCVAnalysis(data) {
  if (typeof data?.score !== 'number') return false;
  if (!Array.isArray(data?.missingKeywords)) return false;
  if (!Array.isArray(data?.tips)) return false;
  return true;
}

function validateEnhanceBullet(data) {
  return typeof data?.enhanced === 'string' && data.enhanced.length > 0;
}

function validateInsights(data) {
  return Array.isArray(data?.insights) && data.insights.length > 0;
}

// Schema-to-validator mapping
const validators = {
  cvAnalysis: validateCVAnalysis,
  enhanceBullet: validateEnhanceBullet,
  freeCvCheck: validateInsights,
};

// ── Retry-enabled structured response generator ──

async function generateStructuredResponse(prompt, responseSchema, validatorKey) {
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

  const validate = validators[validatorKey];
  let lastError = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const text = result.response.text();

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch (parseError) {
        throw new AIParseError(text);
      }

      // Validate shape matches expected schema
      if (validate && !validate(parsed)) {
        console.warn(`Attempt ${attempt + 1}: AI response failed validation, keys:`, Object.keys(parsed));
        if (attempt < MAX_RETRIES) {
          await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
          continue; // retry
        }
        throw new AIParseError(JSON.stringify(parsed));
      }

      return parsed;
    } catch (error) {
      lastError = error;

      // Don't retry on config/auth errors
      if (error.message?.includes('API_KEY') || error.message?.includes('permission')) {
        throw error;
      }

      // Retry on AI service errors
      if (attempt < MAX_RETRIES) {
        console.warn(`AI attempt ${attempt + 1} failed: ${error.message}. Retrying in ${RETRY_DELAY_MS}ms...`);
        await new Promise(r => setTimeout(r, RETRY_DELAY_MS));
      }
    }
  }

  // All retries exhausted
  throw new AIServiceError(
    `AI service failed after ${MAX_RETRIES + 1} attempts: ${lastError?.message}`,
    lastError
  );
}

// ── Route error handler ──

function handleAIError(error, res) {
  const statusCode = error.statusCode || 500;
  const isUpstreamError = error instanceof AIServiceError || error instanceof AIParseError;

  console.error(`[AI ${statusCode}]`, error.message);

  res.status(statusCode).json({
    error: isUpstreamError
      ? 'Layanan AI sedang sibuk atau tidak merespons dengan benar. Silakan coba lagi dalam beberapa saat.'
      : error.message,
    code: isUpstreamError ? 'AI_SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR',
  });
}

// ── Routes ──

// 1. Analyze CV (Protected Route for Members)
router.post('/analyze-cv', authenticateToken, async (req, res) => {
  const { resumeText, jobDescription, mode, text, target_position } = req.body;
  
  try {
    let prompt = '';
    let schema;
    let validatorKey;
    
    if (mode === 'enhance-bullet') {
      prompt = `You are an expert resume writer. Enhance the following resume experience bullet points to be more impactful and metric-driven for a ${target_position || 'general'} role.
      Original Text: ${text}`;
      schema = enhanceBulletSchema;
      validatorKey = 'enhanceBullet';
    } else {
      prompt = `Analyze this CV against the following job description (if provided). 
      Provide an ATS score out of 100, missing keywords, and 3 actionable improvement tips.
      
      Job Description: ${jobDescription || 'N/A'}
      CV Text: ${resumeText || text}`;
      schema = cvAnalysisSchema;
      validatorKey = 'cvAnalysis';
    }

    const result = await generateStructuredResponse(prompt, schema, validatorKey);
    res.json(result);
  } catch (error) {
    handleAIError(error, res);
  }
});

// 2. Free CV Check (Public Route)
router.post('/free-cv-check', async (req, res) => {
  const { resumeText } = req.body;
  
  try {
    const prompt = `You are an expert ATS (Applicant Tracking System) analyzer. 
    Analyze the following CV. Give exactly 3 actionable tips (insights) to improve it.
    
    CV Text: ${resumeText}`;

    const result = await generateStructuredResponse(prompt, freeCvCheckSchema, 'freeCvCheck');
    res.json(result);
  } catch (error) {
    handleAIError(error, res);
  }
});

module.exports = router;
