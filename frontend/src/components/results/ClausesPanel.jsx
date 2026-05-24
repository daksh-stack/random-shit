import { Card } from '../ui/Card.jsx';
import { formatRiskType } from '../../utils/formatters.js';
import { Badge } from '../ui/Badge.jsx';
import { getSeverityBadgeClasses } from '../../utils/riskColors.js';
import { formatSeverity } from '../../utils/formatters.js';

export function ClausesPanel({ risks }) {
  if (!risks?.length) return null;

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-lg font-semibold text-text-primary mb-5">
        Important Clauses
      </h2>
      <div className="space-y-4">
        {risks.map((risk, index) => (
          <div
            key={`${risk.type}-${index}`}
            className="rounded-lg border border-white/[0.06] bg-elevated/50 p-4"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-xs font-medium text-text-primary">
                {formatRiskType(risk.type)}
              </span>
              <Badge className={getSeverityBadgeClasses(risk.severity)}>
                {formatSeverity(risk.severity)}
              </Badge>
            </div>
            <p className="text-xs font-mono text-text-muted leading-relaxed line-clamp-4">
              {risk.clause}
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}
