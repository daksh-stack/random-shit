const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'arbitration',
  riskType: 'arbitration',
  contractTypes: ['offer_letter', 'freelancer', 'rental', 'general_contract'],
  keywords: patterns.arbitration.keywords,
  patterns: patterns.arbitration.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'Disputes may need to be resolved through arbitration instead of courts, which can limit your options.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
