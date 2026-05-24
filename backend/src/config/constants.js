const CONTRACT_TYPES = [
  'offer_letter',
  'internship',
  'freelancer',
  'rental',
  'general_contract',
];

const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];

const SEVERITY_WEIGHTS = {
  low: 10,
  medium: 25,
  high: 45,
  critical: 60,
};

const RISK_LEVEL_BANDS = [
  { max: 30, level: 'low' },
  { max: 60, level: 'medium' },
  { max: 85, level: 'high' },
  { max: 100, level: 'critical' },
];

const ALLOWED_MIME_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
};

const DISCLAIMER =
  'This is not legal advice. Consult a qualified professional for binding decisions.';

const SECTION_KEYWORDS = [
  'termination',
  'notice',
  'confidentiality',
  'intellectual property',
  'arbitration',
  'compensation',
  'salary',
  'bond',
  'non-compete',
  'exclusivity',
  'overtime',
  'probation',
];

module.exports = {
  CONTRACT_TYPES,
  SEVERITY_LEVELS,
  SEVERITY_WEIGHTS,
  RISK_LEVEL_BANDS,
  ALLOWED_MIME_TYPES,
  DISCLAIMER,
  SECTION_KEYWORDS,
};
