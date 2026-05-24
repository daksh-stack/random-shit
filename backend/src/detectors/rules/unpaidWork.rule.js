const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'unpaid_work',
  riskType: 'unpaid_work',
  contractTypes: ['offer_letter', 'internship', 'freelancer'],
  keywords: patterns.unpaidWork.keywords,
  patterns: patterns.unpaidWork.patterns,
  baseSeverity: 'high',
  templateExplanation:
    'The agreement may allow work without guaranteed pay or stipend.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
