import { Card } from '../ui/Card.jsx';

export function SummarySection({ summary, warnings }) {
  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-lg font-semibold text-text-primary mb-4">
        Contract Summary
      </h2>
      {warnings?.length > 0 && (
        <div className="mb-4 rounded-lg border border-risk-medium/20 bg-risk-medium/5 px-4 py-3">
          {warnings.map((w) => (
            <p key={w} className="text-sm text-risk-medium">
              {w}
            </p>
          ))}
        </div>
      )}
      <p className="text-[15px] text-text-secondary leading-relaxed max-w-prose">
        {summary}
      </p>
    </Card>
  );
}
