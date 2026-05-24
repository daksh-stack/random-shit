const { SEVERITY_WEIGHTS, RISK_LEVEL_BANDS } = require('../config/constants');

function calculateRiskScore(risks) {
  if (!risks.length) return 0;

  let total = 0;

  for (const risk of risks) {
    const weight = SEVERITY_WEIGHTS[risk.severity] || SEVERITY_WEIGHTS.medium;
    const confidence = typeof risk.confidence === 'number' ? risk.confidence : 0.7;
    total += weight * confidence;
  }

  const normalized = Math.min(100, Math.round(total / Math.max(risks.length, 1) * 1.5));
  return normalized;
}

function getRiskLevel(score) {
  for (const band of RISK_LEVEL_BANDS) {
    if (score <= band.max) return band.level;
  }
  return 'critical';
}

function buildSummary(risks, aiSummary) {
  if (aiSummary && aiSummary.trim()) return aiSummary.trim();

  if (!risks.length) {
    return 'No high-confidence risky clauses were detected using rule-based screening.';
  }

  const highCount = risks.filter((r) => r.severity === 'high' || r.severity === 'critical').length;

  return `Detected ${risks.length} potentially risky clause(s), including ${highCount} high-severity item(s). Review explanations and questions before signing.`;
}

module.exports = {
  calculateRiskScore,
  getRiskLevel,
  buildSummary,
};
