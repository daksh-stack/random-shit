const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'ip_ownership',
  riskType: 'ip_ownership',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'general_contract'],
  keywords: patterns.ipOwnership.keywords,
  patterns: patterns.ipOwnership.patterns,
  baseSeverity: 'high',
  templateExplanation:
    'The company may own work you create, including projects built outside core job duties or on personal time.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
