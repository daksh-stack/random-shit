const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'notice_period',
  riskType: 'notice_period',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'general_contract'],
  keywords: patterns.noticePeriod.keywords,
  patterns: patterns.noticePeriod.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'This defines how much advance notice you must give before leaving, which can restrict job mobility.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];

  const matches = runRule(text, ruleDef);

  return matches.map((m) => {
    const longNotice = /\b(?:90|ninety|60|sixty)\s*(?:days?|months?)\b/i.test(m.clause);
    return {
      ...m,
      baseSeverity: longNotice ? 'high' : m.baseSeverity,
      confidence: longNotice ? Math.min(m.confidence + 0.1, 0.99) : m.confidence,
    };
  });
}

module.exports = { detect, ruleDef };
