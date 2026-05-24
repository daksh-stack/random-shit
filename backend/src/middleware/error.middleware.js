const config = require('../config');
const logger = require('../utils/logger');
const AppError = require('../utils/AppError');

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  const requestId = req.requestId || 'unknown';

  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An unexpected error occurred';
  let details = null;

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = err.message;
  }

  logger.error('Request error', {
    requestId,
    code,
    statusCode,
    message: err.message,
    stack: config.isProduction ? undefined : err.stack,
  });

  const body = {
    success: false,
    requestId,
    error: {
      code,
      message,
    },
  };

  if (details) {
    body.error.details = details;
  }

  if (!config.isProduction && err.stack && !(err instanceof AppError)) {
    body.error.stack = err.stack;
  }

  res.status(statusCode).json(body);
}

module.exports = errorHandler;
