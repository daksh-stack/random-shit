const config = require('../config');
const { callGemini } = require('../ai/gemini.client');
const { normalizeAiClause, buildFallbackRisk } = require('../ai/responseNormalizer');
const logger = require('../utils/logger');

async function enrichClausesWithAi(detectedClauses, contractType, requestId) {
  if (!detectedClauses.length) {
    return {
      risks: [],
      summary: null,
      aiEnriched: false,
      partial: false,
      warnings: [],
    };
  }

  const batches = [];
  for (let i = 0; i < detectedClauses.length; i += config.analysis.aiBatchSize) {
    batches.push(detectedClauses.slice(i, i + config.analysis.aiBatchSize));
  }

  const aiClauseMap = new Map();
  let summary = null;
  const warnings = [];
  let aiEnriched = false;
  let partial = false;

  for (const batch of batches) {
    try {
      const response = await callGemini(contractType, batch, requestId);

      for (const clause of response.clauses) {
        aiClauseMap.set(clause.id, clause);
      }

      if (response.summary) {
        summary = response.summary;
      }

      aiEnriched = true;
    } catch (err) {
      logger.warn('AI batch failed, using rule fallbacks', {
        requestId,
        message: err.message,
      });
      partial = true;
      warnings.push('AI enrichment partially unavailable; rule-based explanations used.');
    }
  }

  const risks = detectedClauses.map((detected) => {
    const aiClause = aiClauseMap.get(detected.id);

    if (aiClause) {
      return normalizeAiClause(aiClause, detected);
    }

    return buildFallbackRisk(detected);
  });

  return {
    risks,
    summary,
    aiEnriched,
    partial,
    warnings,
  };
}

module.exports = { enrichClausesWithAi };
