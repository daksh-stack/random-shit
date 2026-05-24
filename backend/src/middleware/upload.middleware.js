const path = require('path');
const multer = require('multer');
const config = require('../config');
const { ALLOWED_MIME_TYPES } = require('../config/constants');
const { ensureDir, sanitizeFilename } = require('../utils/fileUtils');
const AppError = require('../utils/AppError');

const storage = multer.diskStorage({
  async destination(req, file, cb) {
    try {
      const dir = path.join(config.paths.tempDir, req.requestId);
      await ensureDir(dir);
      cb(null, dir);
    } catch (err) {
      cb(err);
    }
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = sanitizeFilename(file.originalname);
    cb(null, `original${ext || path.extname(safeName)}`);
  },
});

function fileFilter(req, file, cb) {
  const allowedExtensions = ALLOWED_MIME_TYPES[file.mimetype];

  if (!allowedExtensions) {
    return cb(
      new AppError(
        `Unsupported file type: ${file.mimetype}`,
        415,
        'UNSUPPORTED_FILE'
      ),
      false
    );
  }

  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(ext)) {
    return cb(
      new AppError(
        'File extension does not match file type',
        415,
        'UNSUPPORTED_FILE'
      ),
      false
    );
  }

  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxFileSizeBytes,
    files: 1,
  },
});

function handleMulterError(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return next(
        new AppError(
          `File too large. Maximum size is ${config.upload.maxFileSizeMb}MB`,
          413,
          'FILE_TOO_LARGE'
        )
      );
    }
    return next(new AppError(err.message, 400, 'UPLOAD_ERROR'));
  }
  return next(err);
}

module.exports = {
  uploadSingle: upload.single('file'),
  handleMulterError,
};
