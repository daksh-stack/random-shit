function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \f\v]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function splitParagraphs(text) {
  return normalizeText(text)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function truncate(text, maxLength = 700) {
  if (!text || text.length <= maxLength) return text || '';
  return `${text.slice(0, maxLength - 3)}...`;
}

function countWords(text) {
  return (text || '').split(/\s+/).filter(Boolean).length;
}

module.exports = {
  normalizeText,
  splitParagraphs,
  truncate,
  countWords,
};
