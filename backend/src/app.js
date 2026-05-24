const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger.middleware');
const requestTimeout = require('./middleware/timeout.middleware');
const routes = require('./routes');
const notFoundHandler = require('./middleware/notFound.middleware');
const errorHandler = require('./middleware/error.middleware');
const { ensureDir } = require('./utils/fileUtils');

async function createApp() {
  await ensureDir(config.paths.tempDir);

  const app = express();

  app.set('trust proxy', 1);

  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origin === '*' ? true : config.cors.origin.split(','),
      methods: ['GET', 'POST'],
    })
  );

  app.use(
    rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.max,
      standardHeaders: true,
      legacyHeaders: false,
      message: {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
        },
      },
    })
  );

  app.use(requestLogger);
  app.use(requestTimeout);

  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  app.get('/', (req, res) => {
    res.json({
      success: true,
      name: 'Clause Risk Analyzer API',
      version: '1.0.0',
      docs: '/api/v1/health',
    });
  });

  app.use('/api/v1', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
