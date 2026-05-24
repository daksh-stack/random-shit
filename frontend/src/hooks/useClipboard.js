import { useState, useCallback } from 'react';

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    const timer = setTimeout(() => setCopied(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return { copy, copied };
}
