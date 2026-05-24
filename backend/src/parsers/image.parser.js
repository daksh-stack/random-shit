const Tesseract = require('tesseract.js');
const AppError = require('../utils/AppError');
const { normalizeText } = require('../utils/textUtils');
const logger = require('../utils/logger');

async function parseImage(filePath, requestId) {
  try {
    logger.info('Starting OCR', { requestId });

    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          logger.debug('OCR progress', { requestId, progress: m.progress });
        }
      },
    });

    const text = normalizeText(result.data?.text || '');

    return {
      text,
      metadata: {
        parser: 'tesseract',
        confidence: result.data?.confidence || null,
      },
    };
  } catch (err) {
    throw new AppError(
      `OCR failed: ${err.message}`,
      422,
      'EXTRACTION_FAILED'
    );
  }
}

module.exports = { parseImage };
