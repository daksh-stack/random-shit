const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'vague_compensation',
  riskType: 'vague_compensation',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'general_contract'],
  keywords: patterns.vagueCompensation.keywords,
  patterns: patterns.vagueCompensation.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'Pay or benefits may be unclear or changeable at the other party\'s discretion.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
