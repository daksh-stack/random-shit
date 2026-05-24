const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');
const logger = require('../utils/logger');
const { getSystemPrompt } = require('../prompts/system.prompt');
const { buildClauseAnalysisPrompt } = require('../prompts/clauseAnalysis.prompt');
const { validateGeminiResponse } = require('./gemini.schema');
const AppError = require('../utils/AppError');

let genAI = null;

function getClient() {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
  }
  return genAI;
}

function extractJsonFromText(text) {
  const trimmed = (text || '').trim();

  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    return JSON.parse(fenced[1].trim());
  }

  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end !== -1) {
    return JSON.parse(trimmed.slice(start, end + 1));
  }

  return JSON.parse(trimmed);
}

async function callGemini(contractType, clauses, requestId) {
  const model = getClient().getGenerativeModel({
    model: config.gemini.model,
    generationConfig: {
      temperature: 0.2,
      responseMimeType: 'application/json',
    },
  });

  const systemPrompt = getSystemPrompt();
  const userPrompt = buildClauseAnalysisPrompt(contractType, clauses);
  const expectedIds = clauses.map((c) => c.id);

  let lastError = null;

  for (let attempt = 0; attempt <= config.gemini.maxRetries; attempt += 1) {
    try {
      const prompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const parsed = extractJsonFromText(text);
      const validation = validateGeminiResponse(parsed, expectedIds);

      if (!validation.valid) {
        throw new Error(`Gemini response validation failed: ${validation.errors.join('; ')}`);
      }

      return parsed;
    } catch (err) {
      lastError = err;
      logger.warn('Gemini call failed', {
        requestId,
        attempt,
        message: err.message,
      });

      if (attempt < config.gemini.maxRetries) {
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }

  throw new AppError(
    `AI analysis unavailable: ${lastError?.message || 'unknown error'}`,
    503,
    'AI_UNAVAILABLE'
  );
}

module.exports = {
  callGemini,
  extractJsonFromText,
};
