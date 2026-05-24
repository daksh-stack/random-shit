const { SEVERITY_LEVELS } = require('../config/constants');

function isValidSeverity(value) {
  return SEVERITY_LEVELS.includes(value);
}

function validateGeminiResponse(data, expectedIds) {
  const errors = [];

  if (!data || typeof data !== 'object') {
    return { valid: false, errors: ['Response is not an object'] };
  }

  if (!Array.isArray(data.clauses)) {
    errors.push('clauses must be an array');
    return { valid: false, errors };
  }

  const returnedIds = new Set();

  for (const clause of data.clauses) {
    if (!clause.id || typeof clause.id !== 'string') {
      errors.push('Each clause must have a string id');
      continue;
    }

    returnedIds.add(clause.id);

    if (!isValidSeverity(clause.severity)) {
      errors.push(`Invalid severity for clause ${clause.id}`);
    }

    if (!clause.explanation || typeof clause.explanation !== 'string') {
      errors.push(`Missing explanation for clause ${clause.id}`);
    }

    if (!clause.simplifiedMeaning || typeof clause.simplifiedMeaning !== 'string') {
      errors.push(`Missing simplifiedMeaning for clause ${clause.id}`);
    }

    if (!Array.isArray(clause.questionsToAsk)) {
      errors.push(`questionsToAsk must be array for clause ${clause.id}`);
    }
  }

  const missingIds = expectedIds.filter((id) => !returnedIds.has(id));

  if (missingIds.length > 0) {
    errors.push(`Missing analysis for clause ids: ${missingIds.join(', ')}`);
  }

  if (data.summary && typeof data.summary !== 'string') {
    errors.push('summary must be a string when provided');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

module.exports = {
  validateGeminiResponse,
  isValidSeverity,
};
