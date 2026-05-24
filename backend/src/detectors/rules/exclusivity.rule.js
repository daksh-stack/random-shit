const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'exclusivity',
  riskType: 'exclusivity',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'general_contract'],
  keywords: patterns.exclusivity.keywords,
  patterns: patterns.exclusivity.patterns,
  baseSeverity: 'high',
  templateExplanation:
    'You may be restricted from other jobs, freelance work, or joining competitors for a period.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
