function validateEnv() {
  const errors = [];

  if (!process.env.GEMINI_API_KEY) {
    errors.push('GEMINI_API_KEY is required');
  }

  const port = Number(process.env.PORT || 3000);
  if (Number.isNaN(port) || port < 1 || port > 65535) {
    errors.push('PORT must be a valid number between 1 and 65535');
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n- ${errors.join('\n- ')}`);
  }
}

module.exports = { validateEnv };
