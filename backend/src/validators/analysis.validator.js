const { body } = require('express-validator');
const { CONTRACT_TYPES } = require('../config/constants');

const analyzeValidation = [
  body('contractType')
    .trim()
    .notEmpty()
    .withMessage('contractType is required')
    .isIn(CONTRACT_TYPES)
    .withMessage(`contractType must be one of: ${CONTRACT_TYPES.join(', ')}`),
  body('generateReport')
    .optional()
    .isIn(['true', 'false', true, false, '1', '0', 1, 0])
    .withMessage('generateReport must be a boolean'),
];

function parseGenerateReport(value) {
  if (value === undefined || value === null || value === '') return false;
  return value === true || value === 'true' || value === '1' || value === 1;
}

module.exports = {
  analyzeValidation,
  parseGenerateReport,
};
