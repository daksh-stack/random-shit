import { useRef, useState, useCallback } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { ACCEPT_LABEL } from '../../constants/analysisSteps.js';

export function UploadZone({
  file,
  onFileSelect,
  onClear,
  disabled,
  error,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files) => {
      const selected = files?.[0];
      if (selected) onFileSelect(selected);
    },
    [onFileSelect]
  );

  const onDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!disabled) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload contract file"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !disabled && !file && inputRef.current?.click()}
        className={`
          relative rounded-xl border border-dashed px-6 py-10 text-center transition-colors cursor-pointer
          ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-white/15 bg-surface-1/50'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-white/25 hover:bg-surface-1'}
          ${error ? 'border-risk-high/40' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          accept=".pdf,.png,.jpg,.jpeg,.docx"
          disabled={disabled}
          onChange={(e) => handleFiles(e.target.files)}
        />

        {file ? (
          <div className="flex flex-col items-center gap-3">
            <FileText className="h-8 w-8 text-accent" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text-primary truncate max-w-xs">
                {file.name}
              </p>
              <p className="text-xs text-text-muted mt-1">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            {!disabled && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onClear();
                }}
                className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary"
              >
                <X className="h-3.5 w-3.5" />
                Remove file
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="h-8 w-8 text-text-muted" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-text-primary">
                Drop your contract here
              </p>
              <p className="text-xs text-text-muted mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-text-muted">{ACCEPT_LABEL}</p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-risk-high" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
