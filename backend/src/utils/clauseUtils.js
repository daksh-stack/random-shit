function extractWindow(text, matchIndex, matchLength, before = 200, after = 400) {
  const start = Math.max(0, matchIndex - before);
  const end = Math.min(text.length, matchIndex + matchLength + after);
  return text.slice(start, end).trim();
}

function findSectionBoost(text, matchIndex) {
  const lookback = text.slice(Math.max(0, matchIndex - 500), matchIndex).toLowerCase();
  const sectionPatterns = [
    /termination/,
    /notice\s+period/,
    /confidential/,
    /intellectual\s+property/,
    /arbitration/,
    /compensation|remuneration|salary/,
    /bond|service\s+agreement/,
    /non[- ]?compete/,
    /exclusiv/,
    /overtime/,
    /probation/,
  ];

  return sectionPatterns.some((p) => p.test(lookback)) ? 0.15 : 0;
}

function mergeOverlappingClauses(clauses) {
  if (clauses.length <= 1) return clauses;

  const sorted = [...clauses].sort((a, b) => a.startIndex - b.startIndex);
  const merged = [sorted[0]];

  const severityRank = { low: 1, medium: 2, high: 3, critical: 4 };

  for (let i = 1; i < sorted.length; i += 1) {
    const current = sorted[i];
    const last = merged[merged.length - 1];

    const overlaps =
      current.startIndex <= last.endIndex ||
      current.type === last.type;

    if (overlaps && current.type === last.type) {
      if (severityRank[current.baseSeverity] > severityRank[last.baseSeverity]) {
        last.baseSeverity = current.baseSeverity;
      }
      last.confidence = Math.max(last.confidence, current.confidence);
      if (current.clause.length > last.clause.length) {
        last.clause = current.clause;
        last.endIndex = current.endIndex;
      }
    } else {
      merged.push(current);
    }
  }

  return merged;
}

module.exports = {
  extractWindow,
  findSectionBoost,
  mergeOverlappingClauses,
};
