const express = require('express');
const asyncHandler = require('../middleware/asyncHandler');
const { uploadSingle, handleMulterError } = require('../middleware/upload.middleware');
const validateRequest = require('../middleware/validate.middleware');
const { analyzeValidation } = require('../validators/analysis.validator');
const { analyze } = require('../controllers/analysis.controller');

const router = express.Router();

router.post(
  '/',
  uploadSingle,
  handleMulterError,
  analyzeValidation,
  validateRequest,
  asyncHandler(analyze)
);

module.exports = router;
