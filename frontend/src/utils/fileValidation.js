import { ACCEPTED_EXTENSIONS, ACCEPTED_FILE_TYPES } from '../constants/analysisSteps.js';
import { env } from '../config/env.js';

export function validateFile(file) {
  if (!file) {
    return { valid: false, error: 'Please select a file to upload.' };
  }

  if (file.size > env.MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large. Maximum size is ${env.MAX_FILE_SIZE_MB} MB.`,
    };
  }

  const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;

  if (!ACCEPTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Unsupported file type. Use PDF, PNG, JPG, JPEG, or DOCX.',
    };
  }

  const allowedExtensions = ACCEPTED_FILE_TYPES[file.type];
  if (allowedExtensions && !allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: 'File extension does not match file type.',
    };
  }

  if (!allowedExtensions && !ACCEPTED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: 'Unsupported file type. Use PDF, PNG, JPG, JPEG, or DOCX.',
    };
  }

  return { valid: true, error: null };
}
