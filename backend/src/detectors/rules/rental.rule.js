const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'rental_terms',
  riskType: 'rental_terms',
  contractTypes: ['rental'],
  keywords: patterns.rental.keywords,
  patterns: patterns.rental.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'Rental terms here may include harsh deposit, lock-in, or penalty conditions.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
