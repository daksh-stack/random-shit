const { truncate } = require('../utils/textUtils');

function normalizeAiClause(aiClause, detectedClause) {
  return {
    id: detectedClause.id,
    type: aiClause.type || detectedClause.riskType || detectedClause.type,
    severity: aiClause.severity || detectedClause.baseSeverity,
    confidence: detectedClause.confidence,
    clause: truncate(detectedClause.clause, 700),
    explanation: aiClause.explanation || detectedClause.templateExplanation,
    simplifiedMeaning: aiClause.simplifiedMeaning || detectedClause.templateExplanation,
    questionsToAsk: (aiClause.questionsToAsk || []).slice(0, 5),
    source: 'rule+ai',
  };
}

function buildFallbackRisk(detectedClause) {
  return {
    id: detectedClause.id,
    type: detectedClause.riskType || detectedClause.type,
    severity: detectedClause.baseSeverity,
    confidence: detectedClause.confidence,
    clause: truncate(detectedClause.clause, 700),
    explanation: detectedClause.templateExplanation,
    simplifiedMeaning: detectedClause.templateExplanation,
    questionsToAsk: [],
    source: 'rule+fallback',
  };
}

module.exports = {
  normalizeAiClause,
  buildFallbackRisk,
};
