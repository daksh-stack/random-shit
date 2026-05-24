import { MessageCircleQuestion } from 'lucide-react';
import { Card } from '../ui/Card.jsx';

export function QuestionsSection({ questions }) {
  if (!questions.length) return null;

  return (
    <Card className="p-6 md:p-8">
      <div className="flex items-center gap-2 mb-5">
        <MessageCircleQuestion
          className="h-5 w-5 text-accent"
          aria-hidden="true"
        />
        <h2 className="text-lg font-semibold text-text-primary">
          Questions To Ask HR
        </h2>
      </div>
      <ol className="space-y-3 list-decimal list-inside">
        {questions.map((question) => (
          <li
            key={question}
            className="text-sm text-text-secondary leading-relaxed pl-1"
          >
            <span className="text-text-primary">{question}</span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-xs text-text-muted">
        Copy results to save these questions before your meeting.
      </p>
    </Card>
  );
}
