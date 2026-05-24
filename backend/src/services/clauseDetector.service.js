const config = require('../config');
const { detectClauses } = require('../detectors');
const { mergeOverlappingClauses } = require('../utils/clauseUtils');

const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };

function detectRiskyClauses(text, contractType) {
  const rawMatches = detectClauses(text, contractType);
  const merged = mergeOverlappingClauses(rawMatches);

  const filtered = merged
    .filter((c) => c.confidence >= config.analysis.minConfidence)
    .sort((a, b) => {
      const sevDiff = severityRank[b.baseSeverity] - severityRank[a.baseSeverity];
      if (sevDiff !== 0) return sevDiff;
      return b.confidence - a.confidence;
    });

  return filtered.slice(0, config.analysis.maxClausesForAi);
}

module.exports = { detectRiskyClauses };
