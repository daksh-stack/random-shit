import { ListChecks } from 'lucide-react';
import { Card } from '../ui/Card.jsx';

export function SuggestedActions({ actions }) {
  if (!actions.length) return null;

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-2 mb-5">
        <ListChecks className="h-5 w-5 text-accent" aria-hidden="true" />
        <h2 className="text-lg font-semibold text-text-primary">
          Suggested Actions
        </h2>
      </div>
      <ul className="space-y-3">
        {actions.map((action) => (
          <li
            key={action}
            className="text-sm text-text-secondary leading-relaxed flex gap-3"
          >
            <span className="text-accent shrink-0 mt-0.5">→</span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
