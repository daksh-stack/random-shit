const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'overtime',
  riskType: 'overtime',
  contractTypes: ['offer_letter', 'internship', 'general_contract'],
  keywords: patterns.overtime.keywords,
  patterns: patterns.overtime.patterns,
  baseSeverity: 'medium',
  templateExplanation:
    'Language here may allow extra work hours without clear extra pay.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
