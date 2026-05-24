const path = require('path');
const config = require('../config');
const AppError = require('../utils/AppError');
const { parsePdf } = require('../parsers/pdf.parser');
const { parseImage } = require('../parsers/image.parser');
const { parseDocx } = require('../parsers/docx.parser');
const logger = require('../utils/logger');

const MIME_HANDLERS = {
  'application/pdf': 'pdf',
  'image/png': 'image',
  'image/jpeg': 'image',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
};

async function extractText(file, requestId) {
  const handlerType = MIME_HANDLERS[file.mimetype];

  if (!handlerType) {
    throw new AppError('Unsupported file type for extraction', 415, 'UNSUPPORTED_FILE');
  }

  let result;
  let usedOcr = false;

  if (handlerType === 'pdf') {
    result = await parsePdf(file.path);

    if (result.text.length < config.analysis.ocrFallbackThreshold) {
      logger.info('PDF text below threshold, attempting OCR fallback', { requestId });
      try {
        const ocrResult = await parseImage(file.path, requestId);
        if (ocrResult.text.length > result.text.length) {
          result = ocrResult;
          usedOcr = true;
        }
      } catch (err) {
        logger.warn('OCR fallback failed for PDF', { requestId, error: err.message });
      }
    }
  } else if (handlerType === 'image') {
    result = await parseImage(file.path, requestId);
    usedOcr = true;
  } else if (handlerType === 'docx') {
    result = await parseDocx(file.path);
  }

  if (!result?.text || result.text.length < config.analysis.minTextLength) {
    throw new AppError(
      'Could not extract enough text from the uploaded file. Try a clearer PDF or image.',
      422,
      'NO_TEXT_FOUND'
    );
  }

  return {
    text: result.text,
    metadata: {
      ...result.metadata,
      usedOcr,
      mimeType: file.mimetype,
      originalName: path.basename(file.originalname),
      charCount: result.text.length,
    },
  };
}

module.exports = { extractText };
