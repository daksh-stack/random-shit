const express = require('express');
const healthRoutes = require('./health.routes');
const analysisRoutes = require('./analysis.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/analyze', analysisRoutes);

module.exports = router;
