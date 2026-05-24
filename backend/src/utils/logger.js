const config = require('../config');

const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

function shouldLog(level) {
  return LEVELS[level] <= (LEVELS[config.logging.level] ?? LEVELS.info);
}

function formatMessage(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
}

const logger = {
  error(message, meta) {
    if (shouldLog('error')) console.error(formatMessage('error', message, meta));
  },
  warn(message, meta) {
    if (shouldLog('warn')) console.warn(formatMessage('warn', message, meta));
  },
  info(message, meta) {
    if (shouldLog('info')) console.info(formatMessage('info', message, meta));
  },
  debug(message, meta) {
    if (shouldLog('debug')) console.debug(formatMessage('debug', message, meta));
  },
};

module.exports = logger;
