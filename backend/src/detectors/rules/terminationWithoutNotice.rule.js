const patterns = require('../patterns/clausePatterns');
const { runRule } = require('./baseRule');

const ruleDef = {
  id: 'termination_without_notice',
  riskType: 'termination_without_notice',
  contractTypes: ['offer_letter', 'internship', 'freelancer', 'rental', 'general_contract'],
  keywords: patterns.terminationWithoutNotice.keywords,
  patterns: patterns.terminationWithoutNotice.patterns,
  baseSeverity: 'high',
  templateExplanation:
    'The other party may be able to end the agreement quickly with little or no notice to you.',
};

function detect(text, contractType) {
  if (!ruleDef.contractTypes.includes(contractType)) return [];
  return runRule(text, ruleDef);
}

module.exports = { detect, ruleDef };
