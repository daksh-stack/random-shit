const fs = require('fs');
const AppError = require('../utils/AppError');
const { parseGenerateReport } = require('../validators/analysis.validator');
const { analyzeContract } = require('../services/analysis.service');
const { cleanupRegistry } = require('../services/cleanup.service');
const logger = require('../utils/logger');

async function analyze(req, res, next) {
  const requestId = req.requestId;
  let registry = null;

  try {
    if (!req.file) {
      throw new AppError('File is required. Use form field name "file".', 400, 'VALIDATION_ERROR');
    }

    const contractType = req.body.contractType;
    const generateReport = parseGenerateReport(req.body.generateReport);

    const result = await analyzeContract({
      file: req.file,
      contractType,
      generateReport,
      requestId,
    });

    registry = result.registry;

    if (generateReport && result.reportPath) {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="risk-report-${requestId}.pdf"`
      );
      res.setHeader('X-Request-Id', requestId);
      res.setHeader('X-Risk-Score', String(result.analysis.riskScore));
      res.setHeader('X-Risk-Level', result.analysis.riskLevel);

      const stream = fs.createReadStream(result.reportPath);

      const cleanup = async () => {
        try {
          await cleanupRegistry(registry, requestId);
        } catch (cleanupErr) {
          logger.warn('Cleanup after PDF stream failed', {
            requestId,
            error: cleanupErr.message,
          });
        }
      };

      stream.on('end', cleanup);
      stream.on('close', cleanup);
      stream.on('error', async (streamErr) => {
        await cleanup();
        next(streamErr);
      });

      return stream.pipe(res);
    }

    const response = { ...result.analysis };
    await cleanupRegistry(registry, requestId);
    return res.status(200).json(response);
  } catch (err) {
    if (registry) {
      await cleanupRegistry(registry, requestId);
    }
    return next(err);
  }
}

module.exports = { analyze };
