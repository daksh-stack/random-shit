export const ANALYSIS_STEPS = [
  { id: 'upload', label: 'Uploading document' },
  { id: 'extract', label: 'Extracting text' },
  { id: 'detect', label: 'Scanning for risky clauses' },
  { id: 'analyze', label: 'Generating explanations' },
];

export const ACCEPTED_FILE_TYPES = {
  'application/pdf': ['.pdf'],
  'image/png': ['.png'],
  'image/jpeg': ['.jpg', '.jpeg'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    '.docx',
  ],
};

export const ACCEPTED_EXTENSIONS = ['.pdf', '.png', '.jpg', '.jpeg', '.docx'];

export const ACCEPT_LABEL = 'PDF, PNG, JPG, DOCX — max 10 MB';
