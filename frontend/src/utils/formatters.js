const RISK_TYPE_LABELS = {
  employment_bond: 'Employment Bond',
  notice_period: 'Notice Period',
  ip_ownership: 'IP Ownership',
  confidentiality: 'Confidentiality',
  termination_without_notice: 'Termination Without Notice',
  arbitration: 'Arbitration',
  exclusivity: 'Exclusivity / Non-Compete',
  overtime: 'Overtime & Hours',
  vague_compensation: 'Vague Compensation',
  unpaid_work: 'Unpaid Work',
  rental_terms: 'Rental Terms',
};

const SEVERITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

const RISK_LEVEL_LABELS = {
  low: 'Low Risk',
  medium: 'Moderate Risk',
  high: 'High Risk',
  critical: 'Critical Risk',
};

export function formatRiskType(type) {
  if (!type) return 'Unknown';
  return (
    RISK_TYPE_LABELS[type] ||
    type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

export function formatSeverity(severity) {
  return SEVERITY_LABELS[severity] || severity || 'Unknown';
}

export function formatRiskLevel(level) {
  return RISK_LEVEL_LABELS[level] || 'Risk Assessment';
}

export function formatScoreInterpretation(score, level) {
  if (score <= 30) {
    return 'Few significant risks were detected. Still review key clauses before signing.';
  }
  if (score <= 60) {
    return 'Some clauses may affect your flexibility or compensation. Review the highlights below.';
  }
  if (score <= 85) {
    return 'Several clauses could limit your rights or create future problems. Read carefully before signing.';
  }
  return 'Multiple serious risk indicators found. Consider negotiating or seeking professional advice.';
}

export function sortRisksBySeverity(risks) {
  const order = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...risks].sort(
    (a, b) => (order[a.severity] ?? 4) - (order[b.severity] ?? 4)
  );
}
