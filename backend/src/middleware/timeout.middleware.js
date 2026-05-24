const config = require('../config');
const AppError = require('../utils/AppError');

function requestTimeout(req, res, next) {
  const timeoutMs = config.requestTimeoutMs;

  req.timedOut = false;

  const timer = setTimeout(() => {
    req.timedOut = true;
    if (!res.headersSent) {
      next(new AppError('Request timed out', 408, 'REQUEST_TIMEOUT'));
    }
  }, timeoutMs);

  const clear = () => clearTimeout(timer);
  res.on('finish', clear);
  res.on('close', clear);

  next();
}

module.exports = requestTimeout;
