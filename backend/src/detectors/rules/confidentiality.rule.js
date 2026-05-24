const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'confidentiality',
  riskType: 'confidentiality',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'rental', 'general_contract'],
  keywords: patterns.confidentiality.keywords,
  patterns: patterns.confidentiality.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'Confidentiality terms may restrict what you can discuss or use after the agreement ends.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
