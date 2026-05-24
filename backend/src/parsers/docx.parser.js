const fs = require('fs/promises');
const mammoth = require('mammoth');
const AppError = require('../utils/AppError');
const { normalizeText } = require('../utils/textUtils');

async function parseDocx(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const result = await mammoth.extractRawText({ buffer });
    const text = normalizeText(result.value || '');

    return {
      text,
      metadata: {
        parser: 'mammoth',
        messages: (result.messages || []).length,
      },
    };
  } catch (err) {
    throw new AppError(
      `Failed to parse DOCX: ${err.message}`,
      422,
      'EXTRACTION_FAILED'
    );
  }
}

module.exports = { parseDocx };
