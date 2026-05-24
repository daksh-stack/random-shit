const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'employment_bond',
  riskType: 'employment_bond',
  contractTypes: ['offer_letter', 'internship', 'general_contract'],
  keywords: patterns.employmentBond.keywords,
  patterns: patterns.employmentBond.patterns,
  baseSeverity: 'high',
  templateExplanation:
    'This may require you to stay with the employer for a fixed period or pay damages if you leave early.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
