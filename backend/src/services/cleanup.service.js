const path = require('path');
const config = require('../config');
const { removeDir, safeUnlink } = require('../utils/fileUtils');
const logger = require('../utils/logger');

class CleanupRegistry {
  constructor() {
    this.paths = new Set();
    this.dirs = new Set();
  }

  addFile(filePath) {
    if (filePath) this.paths.add(filePath);
  }

  addDir(dirPath) {
    if (dirPath) this.dirs.add(dirPath);
  }

  addRequestDir(requestId) {
    this.addDir(path.join(config.paths.tempDir, requestId));
  }
}

async function cleanupRegistry(registry, requestId) {
  for (const filePath of registry.paths) {
    try {
      await safeUnlink(filePath);
    } catch (err) {
      logger.warn('Failed to delete temp file', { requestId, filePath, error: err.message });
    }
  }

  for (const dirPath of registry.dirs) {
    try {
      await removeDir(dirPath);
    } catch (err) {
      logger.warn('Failed to delete temp directory', { requestId, dirPath, error: err.message });
    }
  }
}

module.exports = {
  CleanupRegistry,
  cleanupRegistry,
};
