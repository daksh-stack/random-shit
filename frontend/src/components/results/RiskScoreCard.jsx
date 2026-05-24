import { Card } from '../ui/Card.jsx';
import {
  formatRiskLevel,
  formatScoreInterpretation,
} from '../../utils/formatters.js';
import {
  getScoreColorClass,
  getScoreBarClass,
} from '../../utils/riskColors.js';

export function RiskScoreCard({ score, level }) {
  const scoreColor = getScoreColorClass(level);
  const barColor = getScoreBarClass(level);

  return (
    <Card className="p-6 md:p-8">
      <p className="text-sm text-text-secondary mb-4">Overall Risk Score</p>
      <div className="flex flex-col sm:flex-row sm:items-end gap-6">
        <div>
          <span
            className={`text-5xl md:text-6xl font-semibold tabular-nums tracking-tight ${scoreColor}`}
          >
            {score}
          </span>
          <span className="text-2xl text-text-muted font-normal">/100</span>
        </div>
        <div className="flex-1">
          <p className={`text-lg font-medium ${scoreColor}`}>
            {formatRiskLevel(level)}
          </p>
          <p className="mt-2 text-sm text-text-secondary leading-relaxed">
            {formatScoreInterpretation(score, level)}
          </p>
        </div>
      </div>
      <div className="mt-6 h-1.5 w-full rounded-full bg-surface-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${Math.min(score, 100)}%` }}
          role="progressbar"
          aria-valuenow={score}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Risk score"
        />
      </div>
    </Card>
  );
}
