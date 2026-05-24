import { Copy, Download, RotateCcw, Check, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function ActionButtons({
  onCopy,
  onDownload,
  onReset,
  copied,
  isDownloading,
  downloadError,
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3">
        <Button variant="secondary" onClick={onCopy} className="flex-1 sm:flex-none">
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy results
            </>
          )}
        </Button>
        <Button
          variant="secondary"
          onClick={onDownload}
          disabled={isDownloading}
          className="flex-1 sm:flex-none"
        >
          {isDownloading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating…
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Download report
            </>
          )}
        </Button>
        <Button variant="ghost" onClick={onReset} className="flex-1 sm:flex-none">
          <RotateCcw className="h-4 w-4" />
          Analyze another
        </Button>
      </div>
      {downloadError && (
        <p className="text-sm text-risk-high" role="alert">
          {downloadError}
        </p>
      )}
    </div>
  );
}
