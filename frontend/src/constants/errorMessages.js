const ERROR_MESSAGES = {
  VALIDATION_ERROR: 'Please check your file and contract type, then try again.',
  UNSUPPORTED_FILE: 'Unsupported file type. Use PDF, PNG, JPG, JPEG, or DOCX.',
  FILE_TOO_LARGE: 'File is too large. Maximum size is 10 MB.',
  EXTRACTION_FAILED: 'Could not read this file. Try a clearer PDF or image.',
  NO_TEXT_FOUND: 'Not enough text found. Upload a clearer document.',
  AI_UNAVAILABLE: 'AI explanation is temporarily unavailable. Rule-based results may still appear.',
  RATE_LIMITED: 'Too many requests. Please wait a few minutes and try again.',
  REQUEST_TIMEOUT: 'Analysis took too long. Try a smaller or clearer file.',
  NETWORK_ERROR: 'Connection failed. Check your network and try again.',
  UNKNOWN: 'Something went wrong. Please try again.',
};

export function getErrorMessage(code, fallback) {
  return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES.UNKNOWN;
}
