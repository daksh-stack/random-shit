const fs = require('fs/promises');
const pdfParse = require('pdf-parse');
const AppError = require('../utils/AppError');
const { normalizeText } = require('../utils/textUtils');

async function parsePdf(filePath) {
  try {
    const buffer = await fs.readFile(filePath);
    const data = await pdfParse(buffer);
    const text = normalizeText(data.text || '');

    return {
      text,
      metadata: {
        pages: data.numpages || 0,
        parser: 'pdf-parse',
      },
    };
  } catch (err) {
    throw new AppError(
      `Failed to parse PDF: ${err.message}`,
      422,
      'EXTRACTION_FAILED'
    );
  }
}

module.exports = { parsePdf };
