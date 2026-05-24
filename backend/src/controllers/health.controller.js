const config = require('../config');

function getHealth(req, res) {
  res.status(200).json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: config.env,
    version: '1.0.0',
  });
}

module.exports = { getHealth };
