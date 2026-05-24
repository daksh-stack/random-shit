export function getSeverityBadgeClasses(severity) {
  const map = {
    low: 'bg-risk-low/10 text-risk-low border-risk-low/20',
    medium: 'bg-risk-medium/10 text-risk-medium border-risk-medium/20',
    high: 'bg-risk-high/10 text-risk-high border-risk-high/20',
    critical: 'bg-risk-critical/10 text-risk-critical border-risk-critical/20',
  };
  return map[severity] || 'bg-surface-2 text-text-secondary border-border-subtle';
}

export function getSeverityBorderClass(severity) {
  const map = {
    low: 'border-l-risk-low',
    medium: 'border-l-risk-medium',
    high: 'border-l-risk-high',
    critical: 'border-l-risk-critical',
  };
  return map[severity] || 'border-l-border-subtle';
}

export function getScoreColorClass(level) {
  const map = {
    low: 'text-risk-low',
    medium: 'text-risk-medium',
    high: 'text-risk-high',
    critical: 'text-risk-critical',
  };
  return map[level] || 'text-text-primary';
}

export function getScoreBarClass(level) {
  const map = {
    low: 'bg-risk-low',
    medium: 'bg-risk-medium',
    high: 'bg-risk-high',
    critical: 'bg-risk-critical',
  };
  return map[level] || 'bg-accent';
}
