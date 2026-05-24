const employmentBond = require('./rules/employmentBond.rule');
const noticePeriod = require('./rules/noticePeriod.rule');
const ipOwnership = require('./rules/ipOwnership.rule');
const confidentiality = require('./rules/confidentiality.rule');
const terminationWithoutNotice = require('./rules/terminationWithoutNotice.rule');
const arbitration = require('./rules/arbitration.rule');
const exclusivity = require('./rules/exclusivity.rule');
const overtime = require('./rules/overtime.rule');
const vagueCompensation = require('./rules/vagueCompensation.rule');
const unpaidWork = require('./rules/unpaidWork.rule');
const rental = require('./rules/rental.rule');

const ALL_RULES = [
  employmentBond,
  noticePeriod,
  ipOwnership,
  confidentiality,
  terminationWithoutNotice,
  arbitration,
  exclusivity,
  overtime,
  vagueCompensation,
  unpaidWork,
  rental,
];

function detectClauses(text, contractType) {
  const allMatches = [];

  for (const rule of ALL_RULES) {
    const matches = rule.detect(text, contractType);
    allMatches.push(...matches);
  }

  return allMatches;
}

module.exports = {
  detectClauses,
  ALL_RULES,
};
