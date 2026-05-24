const createApp = require('./app');
const config = require('./config');
const { validateEnv } = require('./config/env.schema');
const logger = require('./utils/logger');

async function startServer() {
  try {
    validateEnv();

    const app = await createApp();

    const server = app.listen(config.port, () => {
      logger.info('Server started', {
        port: config.port,
        env: config.env,
      });
    });

    const shutdown = (signal) => {
      logger.info(`${signal} received, shutting down`);
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled rejection', { reason: String(reason) });
    });

    process.on('uncaughtException', (err) => {
      logger.error('Uncaught exception', { message: err.message, stack: err.stack });
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to start server', { message: err.message });
    process.exit(1);
  }
}

startServer();
