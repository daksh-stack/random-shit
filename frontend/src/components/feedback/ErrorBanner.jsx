import { AlertCircle } from 'lucide-react';

export function ErrorBanner({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div
      role="alert"
      className="mb-6 flex items-start gap-3 rounded-lg border border-risk-high/30 bg-risk-high/5 px-4 py-3"
    >
      <AlertCircle className="h-5 w-5 shrink-0 text-risk-high mt-0.5" aria-hidden="true" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary">{message}</p>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="mt-2 text-xs text-text-secondary hover:text-text-primary underline"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}
